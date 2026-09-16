'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getSkills, saveSkillItem, deleteSkillItem } from '@/lib/data-service';
import { Skill } from '@/lib/types';
import { initialSkills } from '@/lib/supabase/fallback-data';
import { Plus, Edit2, Trash2, Save, X, Code2, CheckCircle2, AlertCircle } from 'lucide-react';
import ImageUploadInput from '@/components/ImageUploadInput';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    try {
      const data = await getSkills();
      if (data) setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingSkill({
      name: '',
      icon_url: 'https://skillicons.dev/icons?i=',
      category: 'Frontend',
      order_index: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus keahlian ini?')) return;
    const res = await deleteSkillItem(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Keahlian berhasil dihapus.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Gagal menghapus.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    const res = await saveSkillItem(editingSkill);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Keahlian berhasil disimpan!' });
      setIsModalOpen(false);
      setEditingSkill(null);
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Gagal menyimpan keahlian.' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Kelola Keahlian (Skills)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Atur badge teknologi dan skill icons yang tampil di halaman portofolio.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl font-semibold bg-[#e63946] hover:bg-[#dc2626] text-white shadow-md shadow-red-500/20 transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Skill</span>
        </button>
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

      {/* Grid Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between gap-4 hover:border-red-500/40 transition group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-gray-800 flex items-center justify-center flex-shrink-0">
                <Image
                  src={skill.icon_url}
                  alt={skill.name}
                  width={28}
                  height={28}
                  className="rounded object-contain"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                  {skill.name}
                </h3>
                <span className="text-xs text-gray-400">
                  {skill.category || 'General'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handleOpenEdit(skill)}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1e24] w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {editingSkill.id ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Nama Skill / Bahasa / Framework
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="Contoh: React, Next.js, Python, Tailwind"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <ImageUploadInput
                label="Icon / Logo Skill"
                value={editingSkill.icon_url || ''}
                onChange={(url) => setEditingSkill({ ...editingSkill, icon_url: url })}
                folder="skills"
                aspectRatio="square"
                helperText="Pilih gambar icon dari komputer atau gunakan URL dari skillicons.dev."
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={editingSkill.category || 'General'}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                    placeholder="Frontend, Backend, Database..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={editingSkill.order_index ?? 1}
                    onChange={(e) => setEditingSkill({ ...editingSkill, order_index: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-semibold bg-[#e63946] hover:bg-[#dc2626] text-white shadow-md shadow-red-500/20 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
