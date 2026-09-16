'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon, Loader2, Link2, FileText, CheckCircle2 } from 'lucide-react';
import { uploadFile } from '@/lib/upload-service';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  helperText?: string;
  isPdf?: boolean;
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  folder = 'uploads',
  accept = 'image/*',
  aspectRatio = 'auto',
  helperText,
  isPdf = false,
}: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const res = await uploadFile(file, folder);
      if (res.url) {
        onChange(res.url);
      } else {
        setError(res.error || 'Gagal memproses file.');
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal mengunggah file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isBase64 = value?.startsWith('data:');
  const isImage = !isPdf && value && (value.startsWith('http') || value.startsWith('/') || isBase64);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-gray-400 hover:text-red-500 transition flex items-center gap-1"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? 'Sembunyikan URL' : 'Input Manual URL'}</span>
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}

      {/* Upload Zone & Preview Box */}
      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700/80">
        
        {/* Preview Container */}
        {value ? (
          <div className="relative group flex-shrink-0">
            {isPdf ? (
              <div className="w-24 h-24 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex flex-col items-center justify-center p-2 text-center">
                <FileText className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-bold uppercase truncate max-w-full">PDF File</span>
              </div>
            ) : (
              <div
                className={`relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm ${
                  aspectRatio === 'square'
                    ? 'w-24 h-24'
                    : aspectRatio === 'video'
                    ? 'w-36 h-20'
                    : 'w-28 h-20'
                }`}
              >
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized={isBase64}
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
              title="Hapus foto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition cursor-pointer flex-shrink-0 bg-white/50 dark:bg-black/20"
          >
            {isPdf ? <FileText className="w-6 h-6 mb-1" /> : <ImageIcon className="w-6 h-6 mb-1" />}
            <span className="text-[10px] font-semibold">Pilih File</span>
          </div>
        )}

        {/* Action & Inputs */}
        <div className="flex-grow space-y-2 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer disabled:opacity-60 shadow-sm"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses File...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{value ? 'Ganti File Dari Komputer' : 'Pilih File Dari Komputer'}</span>
                </>
              )}
            </button>

            {value && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>File terpilih</span>
              </span>
            )}
          </div>

          {/* Fallback Manual URL Input */}
          {showUrlInput && (
            <div className="pt-2 animate-fade-in">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={isPdf ? 'https://example.com/file.pdf' : '/img/photo.webp atau https://...'}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          {helperText && (
            <p className="text-[11px] text-gray-400">{helperText}</p>
          )}
        </div>

      </div>
    </div>
  );
}
