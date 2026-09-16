'use client';

import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '@/lib/data-service';
import { Profile } from '@/lib/types';
import { initialProfile } from '@/lib/supabase/fallback-data';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import ImageUploadInput from '@/components/ImageUploadInput';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfile();
        if (data) setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await updateProfile(profile);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Profil berhasil diperbarui!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Gagal menyimpan profil.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Terjadi kesalahan sistem.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Pengaturan Profil & Hero
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ubah identitas, headline, tentang saya, dan tautan sosial media.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Identitas Dasar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Identitas Utama
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Email Kontak
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <ImageUploadInput
              label="Foto Profil (Avatar)"
              value={profile.avatar_url}
              onChange={(url) => handleChange('avatar_url', url)}
              folder="avatars"
              aspectRatio="square"
              helperText="Pilih foto profil dari komputer (PNG, JPG, WEBP). Foto akan otomatis dioptimasi."
            />

            <ImageUploadInput
              label="Logo Navigasi"
              value={profile.logo_url}
              onChange={(url) => handleChange('logo_url', url)}
              folder="logos"
              aspectRatio="square"
              helperText="Pilih icon/logo lingkaran untuk navbar."
            />

            <ImageUploadInput
              label="File CV (Curriculum Vitae)"
              value={profile.cv_url}
              onChange={(url) => handleChange('cv_url', url)}
              folder="documents"
              accept=".pdf"
              isPdf={true}
              helperText="Pilih dokumen file CV dalam format PDF."
            />
          </div>
        </div>

        {/* Hero Headline & Tagline (Bilingual) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Hero Section (Bilingual ID / EN)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Judul Hero (Bahasa Indonesia)
              </label>
              <input
                type="text"
                value={profile.title_id}
                onChange={(e) => handleChange('title_id', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Judul Hero (English)
              </label>
              <input
                type="text"
                value={profile.title_en}
                onChange={(e) => handleChange('title_en', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Tagline Hero (Bahasa Indonesia)
              </label>
              <textarea
                rows={2}
                value={profile.tagline_id}
                onChange={(e) => handleChange('tagline_id', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Tagline Hero (English)
              </label>
              <textarea
                rows={2}
                value={profile.tagline_en}
                onChange={(e) => handleChange('tagline_en', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Detail Kartu Profil (Hero) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Detail Kartu Hero (Lokasi & Sekolah)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Lokasi
              </label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Purwokerto, Indonesia"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Jurusan
              </label>
              <input
                type="text"
                value={profile.specialization || ''}
                onChange={(e) => handleChange('specialization', e.target.value)}
                placeholder="Rekayasa Perangkat Lunak"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Sekolah Saat Ini
              </label>
              <input
                type="text"
                value={profile.current_school || ''}
                onChange={(e) => handleChange('current_school', e.target.value)}
                placeholder="SMK Telkom"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Periode Sekolah
              </label>
              <input
                type="text"
                value={profile.school_period || ''}
                onChange={(e) => handleChange('school_period', e.target.value)}
                placeholder="2024 - 2027"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Tentang Saya (Bilingual) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Tentang Saya / About Me (Bilingual)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Deskripsi Bio (Bahasa Indonesia)
              </label>
              <textarea
                rows={4}
                value={profile.about_id}
                onChange={(e) => handleChange('about_id', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Deskripsi Bio (English)
              </label>
              <textarea
                rows={4}
                value={profile.about_en}
                onChange={(e) => handleChange('about_en', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Kartu Spesialisasi (About) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Kartu Spesialisasi (Section About)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Spesialisasi
              </label>
              <input
                type="text"
                value={profile.specialization_1 || ''}
                onChange={(e) => handleChange('specialization_1', e.target.value)}
                placeholder="Frontend & Web"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Framework
              </label>
              <input
                type="text"
                value={profile.specialization_2 || ''}
                onChange={(e) => handleChange('specialization_2', e.target.value)}
                placeholder="Next.js & Laravel"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Database
              </label>
              <input
                type="text"
                value={profile.specialization_3 || ''}
                onChange={(e) => handleChange('specialization_3', e.target.value)}
                placeholder="Supabase & SQL"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Prinsip Kerja / Filosofi (Bilingual) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Prinsip Kerja / Philosophy (Bilingual ID / EN)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Judul Prinsip (Bahasa Indonesia)
              </label>
              <input
                type="text"
                value={profile.philosophy_id || ''}
                onChange={(e) => handleChange('philosophy_id', e.target.value)}
                placeholder="Membangun aplikasi yang cepat, bersih, dan berorientasi pengguna."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Judul Prinsip (English)
              </label>
              <input
                type="text"
                value={profile.philosophy_en || ''}
                onChange={(e) => handleChange('philosophy_en', e.target.value)}
                placeholder="Building fast, clean, and user-centric applications."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Deskripsi Prinsip (Bahasa Indonesia)
              </label>
              <textarea
                rows={2}
                value={profile.philosophy_desc_id || ''}
                onChange={(e) => handleChange('philosophy_desc_id', e.target.value)}
                placeholder="Selalu antusias mempelajari teknologi terdepan..."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Deskripsi Prinsip (English)
              </label>
              <textarea
                rows={2}
                value={profile.philosophy_desc_en || ''}
                onChange={(e) => handleChange('philosophy_desc_en', e.target.value)}
                placeholder="Passionate about exploring modern web technologies..."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Motto Singkat
              </label>
              <input
                type="text"
                value={profile.motto || ''}
                onChange={(e) => handleChange('motto', e.target.value)}
                placeholder="Clean Code & Architecture"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Tautan Sosial Media */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Tautan Sosial Media
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={profile.github_url}
                onChange={(e) => handleChange('github_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={profile.linkedin_url}
                onChange={(e) => handleChange('linkedin_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={profile.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl font-semibold bg-[#e63946] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Simpan Perubahan Profil</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
