'use client';

import React, { useEffect, useState } from 'react';
import { getEducation, saveEducationItem, deleteEducationItem } from '@/lib/data-service';
import { Education } from '@/lib/types';
import { initialEducation } from '@/lib/supabase/fallback-data';
import { Plus, Edit2, Trash2, Save, X, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminEducationPage() {
  const [educationList, setEducationList] = useState<Education[]>(initialEducation);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<Education> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    try {
      const data = await getEducation();
      if (data) setEducationList(data);
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
    setEditingItem({
      institution: '',
      period: '',
      description_id: '',
      description_en: '',
      order_index: educationList.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Education) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus riwayat pendidikan ini?')) return;
    const res = await deleteEducationItem(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Riwayat pendidikan berhasil dihapus.' });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Gagal menghapus.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const res = await saveEducationItem(editingItem);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Riwayat pendidikan berhasil disimpan!' });
      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Gagal menyimpan data.' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Kelola Riwayat Pendidikan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tambah, edit, atau hapus daftar riwayat sekolah dan institusi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl font-semibold bg-[#e63946] hover:bg-[#dc2626] text-white shadow-md shadow-red-500/20 transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pendidikan</span>
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

      {/* List */}
      <div className="bg-white dark:bg-[#1e1e24] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : educationList.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Belum ada data pendidikan. Klik "Tambah Pendidikan" di atas.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {educationList.map((item, index) => (
              <div key={item.id || index} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex-shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {item.institution}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">ID:</span> {item.description_id}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">EN:</span> {item.description_en}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1e24] w-full max-w-lg rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {editingItem.id ? 'Edit Riwayat Pendidikan' : 'Tambah Riwayat Pendidikan'}
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
                  Nama Institusi / Sekolah
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.institution || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                  placeholder="Contoh: SMK Telkom Purwokerto"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Periode Tahun
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.period || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                    placeholder="2024-2027"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={editingItem.order_index ?? 1}
                    onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Deskripsi (Bahasa Indonesia)
                </label>
                <textarea
                  rows={2}
                  value={editingItem.description_id || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Deskripsi (English)
                </label>
                <textarea
                  rows={2}
                  value={editingItem.description_en || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description_en: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
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
