'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, isSupabase } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn(email, password);
      if (res.success) {
        router.push('/admin');
      } else {
        setError(res.error || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121214] p-4 sm:p-6">
      <div className="max-w-md w-full">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Admin CMS Portal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Kelola konten website portofolio Gilang Surya Ramadhan
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#1e1e24] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl space-y-6">
          
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Email Admin
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Kata Sandi {isSupabase ? '' : '(Opsional di mode lokal)'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold bg-[#e63946] hover:bg-[#dc2626] text-white shadow-lg shadow-red-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              <span>{loading ? 'Memproses...' : 'Masuk ke Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
            ← Kembali ke Website Utama
          </Link>
        </div>

      </div>
    </div>
  );
}
