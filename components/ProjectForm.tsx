'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveProject } from '@/lib/data-service';
import { Project } from '@/lib/types';
import { Save, ArrowLeft, Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ImageUploadInput from '@/components/ImageUploadInput';
import { uploadFile } from '@/lib/upload-service';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  isNew?: boolean;
}

export default function ProjectForm({ initialData, isNew = false }: ProjectFormProps) {
  const router = useRouter();
  const challengeFileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    category_id: 'Website',
    category_en: 'Website',
    description_id: '',
    description_en: '',
    cover_image: '/img/optimized/portfolio/home.webp',
    overview_id: '',
    overview_en: '',
    role_id: 'Fullstack Developer',
    role_en: 'Fullstack Developer',
    tools: 'Next.js, Tailwind CSS, TypeScript',
    timeline_id: '1 Bulan',
    timeline_en: '1 Month',
    process_id: '',
    process_en: '',
    challenge_id: '',
    challenge_en: '',
    challenge_images: [],
    github_url: '',
    live_url: '',
    order_index: 1,
    featured: true,
    ...initialData,
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof Project, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && isNew && !prev.slug) {
        next.slug = (value as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return next;
    });
  };

  const handleScreenshotFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingScreenshot(true);
    try {
      const res = await uploadFile(file, 'projects/challenges');
      if (res.url) {
        const current = formData.challenge_images || [];
        setFormData({
          ...formData,
          challenge_images: [...current, res.url],
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal mengunggah gambar screenshot.');
    } finally {
      setUploadingScreenshot(false);
      if (challengeFileRef.current) {
        challengeFileRef.current.value = '';
      }
    }
  };

  const handleAddChallengeImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const current = formData.challenge_images || [];
    setFormData({
      ...formData,
      challenge_images: [...current, newImageUrl.trim()]
    });
    setNewImageUrl('');
  };

  const handleRemoveChallengeImage = (index: number) => {
    const current = formData.challenge_images || [];
    setFormData({
      ...formData,
      challenge_images: current.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await saveProject(formData);
      if (res.success) {
        router.push('/admin/projects');
      } else {
        setError(res.error || 'Gagal menyimpan data proyek.');
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isNew ? 'Tambah Proyek Baru' : `Edit: ${formData.title || 'Proyek'}`}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Isi data detail studi kasus dan informasi proyek.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-semibold bg-[#e63946] hover:bg-[#dc2626] text-white shadow-md shadow-red-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Proyek</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Informasi Utama */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          1. Informasi Utama Proyek
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Judul Proyek
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Contoh: CRONELA"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              URL Slug (halaman /project/[slug])
            </label>
            <input
              type="text"
              required
              value={formData.slug || ''}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="cronela"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Kategori (Bahasa Indonesia)
            </label>
            <input
              type="text"
              value={formData.category_id || ''}
              onChange={(e) => handleChange('category_id', e.target.value)}
              placeholder="Website Pendidikan"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Kategori (English)
            </label>
            <input
              type="text"
              value={formData.category_en || ''}
              onChange={(e) => handleChange('category_en', e.target.value)}
              placeholder="Education Website"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Cover Image Upload Input */}
        <div className="pt-2">
          <ImageUploadInput
            label="Cover Foto Proyek"
            value={formData.cover_image || ''}
            onChange={(url) => handleChange('cover_image', url)}
            folder="projects"
            aspectRatio="video"
            helperText="Pilih foto thumbnail utama untuk proyek dari komputer."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Deskripsi Singkat Kartu (ID)
            </label>
            <textarea
              rows={3}
              value={formData.description_id || ''}
              onChange={(e) => handleChange('description_id', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Deskripsi Singkat Kartu (EN)
            </label>
            <textarea
              rows={3}
              value={formData.description_en || ''}
              onChange={(e) => handleChange('description_en', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Metadata Studi Kasus */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          2. Metadata Detail & Peran
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Peran (ID)
            </label>
            <input
              type="text"
              value={formData.role_id || ''}
              onChange={(e) => handleChange('role_id', e.target.value)}
              placeholder="Fullstack Developer"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Tools / Teknologi Digunakan
            </label>
            <input
              type="text"
              value={formData.tools || ''}
              onChange={(e) => handleChange('tools', e.target.value)}
              placeholder="PHP, CSS, JS, MySQL"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Timeline / Durasi
            </label>
            <input
              type="text"
              value={formData.timeline_id || ''}
              onChange={(e) => handleChange('timeline_id', e.target.value)}
              placeholder="3 Bulan"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Overview Proyek (ID)
            </label>
            <textarea
              rows={3}
              value={formData.overview_id || ''}
              onChange={(e) => handleChange('overview_id', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Overview Proyek (EN)
            </label>
            <textarea
              rows={3}
              value={formData.overview_en || ''}
              onChange={(e) => handleChange('overview_en', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Proses & Tantangan */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          3. Proses & Tantangan (Case Study Content)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Proses Pengerjaan (ID)
            </label>
            <textarea
              rows={4}
              value={formData.process_id || ''}
              onChange={(e) => handleChange('process_id', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Tantangan & Solusi (ID)
            </label>
            <textarea
              rows={4}
              value={formData.challenge_id || ''}
              onChange={(e) => handleChange('challenge_id', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
        </div>

        {/* Screenshot Tantangan & Galeri */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <label className="block text-xs font-semibold text-gray-500 uppercase">
            Screenshot Tambahan / Galeri Tantangan
          </label>
          
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700/80 space-y-3">
            <input
              type="file"
              ref={challengeFileRef}
              onChange={handleScreenshotFile}
              accept="image/*"
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={uploadingScreenshot}
                onClick={() => challengeFileRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer disabled:opacity-60 shadow-sm"
              >
                {uploadingScreenshot ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengunggah Foto...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Foto Screenshot Dari Komputer</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 flex-grow max-w-md">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="atau tempel URL gambar..."
                  className="flex-grow px-3 py-1.5 rounded-xl bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={handleAddChallengeImageUrl}
                  className="px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-xs font-semibold transition"
                >
                  Tambah
                </button>
              </div>
            </div>

            {formData.challenge_images && formData.challenge_images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {formData.challenge_images.map((img, i) => (
                  <div key={i} className="relative aspect-[16/10] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 group">
                    <Image
                      src={img}
                      alt={`Screenshot ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={img.startsWith('data:')}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveChallengeImage(i)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition"
                      title="Hapus gambar"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Tautan Luar & Konfigurasi */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          4. Tautan Luar (GitHub & Live URL)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              GitHub Repository URL
            </label>
            <input
              type="url"
              value={formData.github_url || ''}
              onChange={(e) => handleChange('github_url', e.target.value)}
              placeholder="https://github.com/username/project"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Live Demo URL
            </label>
            <input
              type="url"
              value={formData.live_url || ''}
              onChange={(e) => handleChange('live_url', e.target.value)}
              placeholder="https://my-app.com"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Urutan Tampil (Order Index)
            </label>
            <input
              type="number"
              value={formData.order_index ?? 1}
              onChange={(e) => handleChange('order_index', parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

    </form>
  );
}
