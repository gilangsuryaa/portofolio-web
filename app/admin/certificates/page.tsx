'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCertificates, saveCertificate, deleteCertificate } from '@/lib/data-service';
import { Certificate } from '@/lib/types';
import { Plus, Edit2, Trash2, Save, X, Award, CheckCircle2, AlertCircle, GripVertical } from 'lucide-react';
import ImageUploadInput from '@/components/ImageUploadInput';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await getCertificates();
      if (data) setCertificates(data);
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
    setEditingCert({
      title: '',
      issuer: '',
      issued_date: new Date().getFullYear().toString(),
      image_url: '',
      display_order: certificates.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingCert({ ...cert });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus sertifikat "${title}"?`)) return;
    const res = await deleteCertificate(id);
    if (res.success) {
      setFeedback({ type: 'success', message: `Sertifikat "${title}" berhasil dihapus.` });
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Gagal menghapus sertifikat.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.title || !editingCert.issuer || !editingCert.image_url) {
      setFeedback({ type: 'error', message: 'Mohon isi semua field yang diperlukan.' });
      return;
    }

    const res = await saveCertificate(editingCert);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Sertifikat berhasil disimpan!' });
      setIsModalOpen(false);
      setEditingCert(null);
      loadData();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Gagal menyimpan sertifikat.' });
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const draggedCert = certificates.find(c => c.id === draggedId);
    const targetCert = certificates.find(c => c.id === targetId);
    if (!draggedCert || !targetCert) return;

    const draggedOrder = draggedCert.display_order;
    const targetOrder = targetCert.display_order;

    const updated = certificates.map(c => {
      if (c.id === draggedId) return { ...c, display_order: targetOrder };
      if (c.id === targetId) return { ...c, display_order: draggedOrder };
      return c;
    }).sort((a, b) => a.display_order - b.display_order);

    setCertificates(updated);

    await Promise.all([
      saveCertificate({ ...draggedCert, display_order: targetOrder }),
      saveCertificate({ ...targetCert, display_order: draggedOrder }),
    ]);

    setDraggedId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Kelola Sertifikat
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tambah, edit, atau hapus sertifikat dan penghargaan profesional.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl font-semibold bg-[#e63946] hover:bg-[#dc2626] text-white shadow-md shadow-red-500/20 transition flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sertifikat</span>
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

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#1e1e24] rounded-3xl border border-gray-200 dark:border-gray-800 text-gray-500">
          Belum ada sertifikat. Klik "Tambah Sertifikat" untuk membuat sertifikat pertama Anda.
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              draggable
              onDragStart={() => handleDragStart(cert.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(cert.id)}
              className={`p-4 rounded-2xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between gap-4 hover:border-red-500/40 transition cursor-move ${
                draggedId === cert.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-grow">
                <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                
                <div className="w-16 h-12 rounded-lg bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Image
                    src={cert.image_url || '/img/placeholder-cert.png'}
                    alt={cert.title}
                    width={64}
                    height={48}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>

                <div className="min-w-0 flex-grow">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {cert.issuer} • {cert.issued_date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleOpenEdit(cert)}
                  className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cert.id, cert.title)}
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

      {isModalOpen && editingCert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e1e24] w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {editingCert.id ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
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
                  Nama Sertifikat *
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.title || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  placeholder="Contoh: AWS Solutions Architect"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Penyelenggara / Lembaga *
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.issuer || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                  placeholder="Contoh: Amazon Web Services"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Tahun / Tanggal Didapat
                </label>
                <input
                  type="text"
                  value={editingCert.issued_date || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, issued_date: e.target.value })}
                  placeholder="Contoh: 2024 atau 12 Agustus 2024"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <ImageUploadInput
                label="Gambar Sertifikat *"
                value={editingCert.image_url || ''}
                onChange={(url) => setEditingCert({ ...editingCert, image_url: url })}
                folder="certificates"
                aspectRatio="auto"
                bucket="certificates"
                helperText="Upload gambar sertifikat (PNG, JPG, WEBP). Rekomendasi: 800x600px"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Urutan Tampil
                </label>
                <input
                  type="number"
                  value={editingCert.display_order ?? 1}
                  onChange={(e) => setEditingCert({ ...editingCert, display_order: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
