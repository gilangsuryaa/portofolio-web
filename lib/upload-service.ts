import { getSupabaseBrowserClient, isSupabaseConfigured } from './supabase/client';

/**
 * Compress an image file on the client-side to keep size small for database & storage
 */
export async function compressImage(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to webp if supported, or jpeg
        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a file (image or pdf) to Supabase Storage, with fallback to Base64 DataURL
 */
export async function uploadFile(
  file: File,
  folder = 'uploads',
  bucket = 'portfolio'
): Promise<{ url: string; error?: string }> {
  const supabase = getSupabaseBrowserClient();

  const isImage = file.type.startsWith('image/');

  if (supabase && isSupabaseConfigured) {
    try {
      const fileExt = file.name.split('.').pop() || (isImage ? 'webp' : 'pdf');
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          return { url: publicUrlData.publicUrl };
        }
      } else {
        console.warn('Supabase storage upload returned error (falling back to Base64 data):', error?.message);
      }
    } catch (err: any) {
      console.warn('Storage upload catch error, using Base64 fallback:', err?.message);
    }
  }

  // Fallback: Convert to Base64 data URL
  try {
    if (isImage) {
      const compressedDataUrl = await compressImage(file);
      return { url: compressedDataUrl };
    } else {
      // PDF or other documents
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ url: e.target?.result as string });
        reader.onerror = (e) => reject({ url: '', error: 'Failed to read file' });
        reader.readAsDataURL(file);
      });
    }
  } catch (err: any) {
    return { url: '', error: err?.message || 'Gagal memproses file.' };
  }
}
