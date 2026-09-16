'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProjects, deleteProject } from '@/lib/data-service';
import { Project } from '@/lib/types';
import { initialProjects } from '@/lib/supabase/fallback-data';
import { Plus, Edit2, Trash2, ExternalLink, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    try {
      const data = await getProjects();
      if (data) setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${title}"?`)) return;
    const res = await deleteProject(id);
    if (res.success) {
      setFeedback({ type: 'success', message: `Proyek "${title}" berhasil dihapus.` });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Gagal menghapus proyek.' });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Kelola Portofolio & Case Studies
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tambah proyek baru, edit studi kasus, ganti gambar, dan kelola tautan live demo / repo.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="px-5 py-2.5 rounded-xl font-semibold bg-[#e63946] hover:bg-[#dc2626] text-white shadow-md shadow-red-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek Baru</span>
        </Link>
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

      {/* Grid Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-12 text-center">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-white dark:bg-[#1e1e24] rounded-3xl border border-gray-200 dark:border-gray-800 text-gray-500">
            Belum ada proyek. Klik "Tambah Proyek Baru" untuk membuat proyek pertama Anda.
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id || proj.slug}
              className="rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image
                    src={proj.cover_image || '/img/optimized/portfolio/home.webp'}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-black/60 text-white backdrop-blur-md">
                      {proj.category_id || proj.category_en}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[11px] font-mono rounded bg-white/80 dark:bg-black/80 text-gray-800 dark:text-gray-200">
                      /{proj.slug}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {proj.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {proj.description_id}
                  </p>
                  {proj.tools && (
                    <p className="text-xs text-gray-400 pt-1">
                      <span className="font-semibold text-gray-500">Tools:</span> {proj.tools}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2 mt-4">
                <Link
                  href={`/project/${proj.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white inline-flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Halaman</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects/edit/${proj.id}`}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="p-1.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
