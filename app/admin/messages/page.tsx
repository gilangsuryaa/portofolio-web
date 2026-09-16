'use client';

import React, { useEffect, useState } from 'react';
import { getContactMessages, markMessageRead, deleteMessage } from '@/lib/data-service';
import { ContactMessage } from '@/lib/types';
import { Mail, CheckCircle2, Trash2, MailOpen, Calendar, Clock, RefreshCw } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    const nextStatus = !msg.is_read;
    const res = await markMessageRead(msg.id, nextStatus);
    if (res.success) {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: nextStatus } : m)));
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read: nextStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini secara permanen?')) return;
    const res = await deleteMessage(id);
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleSelect = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      await markMessageRead(msg.id, true);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Kotak Masuk Pesan (Contact Messages)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pesan yang dikirimkan oleh pengunjung melalui formulir kontak website.
          </p>
        </div>

        <button
          onClick={loadMessages}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e24] text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Muat Ulang</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Messages List */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1e1e24] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 font-semibold uppercase">
            <span>Daftar Pesan ({messages.length})</span>
            <span>{messages.filter(m => !m.is_read).length} Belum Dibaca</span>
          </div>

          <div className="overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 flex-grow">
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center text-sm text-gray-400">
                Belum ada pesan yang masuk.
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelect(msg)}
                    className={`p-4 cursor-pointer transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-red-50/70 dark:bg-red-950/30 border-l-4 border-red-500'
                        : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                    } ${!msg.is_read ? 'font-semibold' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        {!msg.is_read && (
                          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        )}
                        <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {msg.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {msg.email}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1e1e24] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8 flex flex-col justify-between h-[600px] overflow-y-auto">
          {selectedMessage ? (
            <div className="space-y-6 animate-fade-in flex flex-col justify-between h-full">
              <div className="space-y-6">
                
                {/* Actions */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedMessage)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 transition flex items-center gap-1.5"
                    >
                      {selectedMessage.is_read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                      <span>{selectedMessage.is_read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    title="Hapus Pesan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Sender Info */}
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedMessage.name}
                  </h2>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>Email:</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-red-600 dark:text-red-400 font-semibold hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="text-xs text-gray-400 pt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(selectedMessage.created_at).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/80">
                  <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Reply Button */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Balasan Portofolio - Gilang Surya Ramadhan`}
                  className="px-6 py-2.5 rounded-xl font-semibold bg-[#e63946] hover:bg-[#dc2626] text-white shadow-md shadow-red-500/20 transition flex items-center gap-2 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Balas via Email</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8">
              <Mail className="w-12 h-12 stroke-1 mb-3 text-gray-300 dark:text-gray-600" />
              <h3 className="font-semibold text-base text-gray-700 dark:text-gray-300">Pilih Pesan</h3>
              <p className="text-xs max-w-xs mt-1">
                Klik salah satu pesan di sebelah kiri untuk melihat isi pesan secara lengkap.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
