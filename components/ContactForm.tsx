'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { submitContactMessage } from '@/lib/data-service';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Profile } from '@/lib/types';
import Turnstile from '@/components/Turnstile';

interface ContactFormProps {
  profile?: Profile | null;
}

// Selama site key belum dipasang, widget tidak dirender dan form tetap berfungsi
// seperti sebelumnya. Jadi situs tidak rusak sebelum kuncinya dikonfigurasi.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactForm({ profile }: ContactFormProps) {
  const email = profile?.email || 'gilangsuryaramadhan10@gmail.com';
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const turnstileAktif = Boolean(TURNSTILE_SITE_KEY);
  const menungguVerifikasi = turnstileAktif && !turnstileToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await submitContactMessage(formData, turnstileToken || undefined);
      if (res.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(
          res.error === 'turnstile'
            ? t(
                'Verifikasi keamanan gagal. Silakan coba lagi.',
                'Security verification failed. Please try again.'
              )
            : t('Terjadi kesalahan saat mengirim pesan.', 'An error occurred while sending your message.')
        );
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || t('Gagal mengirim pesan.', 'Failed to send the message.'));
    } finally {
      // Token Turnstile hanya sekali pakai. Baik berhasil maupun gagal, widget
      // harus diulang agar percobaan berikutnya punya token yang sah.
      if (turnstileAktif) {
        setTurnstileToken('');
        setTurnstileResetKey((n) => n + 1);
      }
    }
  };

  return (
    <section id="contact" className="py-6">
      <div className="bento-card p-8 sm:p-12 bg-white dark:bg-[#141417]">
        <div className="bento-glow" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t('Hubungi Saya', 'Let’s Connect')}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
                {t('Mari Memulai Sesuatu yang Hebat Bersama.', 'Let’s Build Something Great Together.')}
              </h2>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {t(
                  'Tertarik untuk bekerja sama, diskusi proyek, atau sekadar menyapa? Kirim pesan dan saya akan merespons secepatnya.',
                  'Interested in collaboration, discussing an exciting project, or simply saying hello? Drop a message below.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#191920] border border-neutral-100 dark:border-neutral-800 space-y-1">
              <span className="text-xs text-neutral-400 font-medium">{t('Email Langsung', 'Direct Email')}</span>
              {/* Alamat email adalah satu kata panjang tanpa spasi, jadi browser
                  tidak punya titik patah alami. Tanpa break-words, teksnya menembus
                  kotak di layar sempit. Ukuran font dikecilkan di mobile agar tetap
                  muat satu baris pada ponsel umum, dan break-words menjadi jaring
                  pengaman untuk layar yang lebih sempit lagi atau saat pengguna
                  memperbesar ukuran font sistem. */}
              <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white break-words">
                {email}
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            {status === 'success' ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-neutral-50 dark:bg-[#18181d] border border-neutral-100 dark:border-neutral-800 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {t('Pesan Berhasil Terkirim!', 'Message Sent Successfully!')}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-sm">
                  {t('Terima kasih telah menghubungi. Pesan Anda telah tersimpan dan akan segera saya balas.', 'Thank you for reaching out. Your message has been received and I will reply soon.')}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 mt-2"
                >
                  {t('Kirim Pesan Lain', 'Send Another Message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      {t('Nama', 'Name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#18181d] border border-neutral-200/80 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#18181d] border border-neutral-200/80 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {t('Pesan', 'Message')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('Tulis pesan Anda di sini...', 'Write your message...')}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-[#18181d] border border-neutral-200/80 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none"
                  />
                </div>

                {turnstileAktif && (
                  <div className="flex flex-col gap-2">
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY as string}
                      onToken={setTurnstileToken}
                      resetKey={turnstileResetKey}
                    />
                    {menungguVerifikasi && (
                      <p className="text-[11px] text-neutral-400">
                        {t(
                          'Selesaikan verifikasi di atas untuk mengaktifkan tombol kirim.',
                          'Complete the verification above to enable the send button.'
                        )}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || menungguVerifikasi}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('Mengirim Pesan...', 'Sending Message...')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('Kirim Pesan', 'Send Message')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
