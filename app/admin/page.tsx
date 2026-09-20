'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjects, getContactMessages, getSkills, getEducation, getProfile, getCertificates } from '@/lib/data-service';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  Mail,
  Code2,
  GraduationCap,
  Award,
  Plus,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileCode2
} from 'lucide-react';
import { Project, Certificate, ContactMessage } from '@/lib/types';

export default function AdminDashboardPage() {
  const { isSupabase } = useAuth();
  const [projectCount, setProjectCount] = useState(0);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [skillCount, setSkillCount] = useState(0);
  const [educationCount, setEducationCount] = useState(0);
  const [certCount, setCertCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projs, msgs, sks, edus, certs] = await Promise.all([
          getProjects(),
          getContactMessages(),
          getSkills(),
          getEducation(),
          getCertificates(),
        ]);
        setProjectCount(projs.length);
        setMessages(msgs);
        setSkillCount(sks.length);
        setEducationCount(edus.length);
        setCertCount(certs.length);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Selamat datang di panel kontrol portofolio Gilang Surya Ramadhan.
        </p>
      </div>

      {/* Supabase Status Banner */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isSupabase 
          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50' 
          : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${
            isSupabase ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
          }`}>
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-bold text-base ${isSupabase ? 'text-emerald-900 dark:text-emerald-300' : 'text-amber-900 dark:text-amber-300'}`}>
              {isSupabase ? 'Supabase Database Cloud Terhubung!' : 'Supabase Belum Dikonfigurasi (Mode Offline / Local Active)'}
            </h3>
            <p className={`text-xs sm:text-sm mt-1 max-w-xl ${isSupabase ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {isSupabase
                ? 'Semua data dan pesan kontak disimpan langsung di Supabase Cloud Database secara real-time.'
                : 'Website dan Admin CMS saat ini menyimpan perubahan pada browser lokal. Untuk menghubungkan ke database cloud Supabase, isi file .env.local dan jalankan script SQL supabase/schema.sql.'}
            </p>
          </div>
        </div>

        {!isSupabase && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white shadow-sm">
              <FileCode2 className="w-3.5 h-3.5" />
              File SQL: supabase/schema.sql
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Proyek</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {loading ? '...' : projectCount}
          </div>
          <Link href="/admin/projects" className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1">
            Kelola Proyek <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pesan Kontak</span>
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{loading ? '...' : messages.length}</span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-full">
                {unreadCount} baru
              </span>
            )}
          </div>
          <Link href="/admin/messages" className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline inline-flex items-center gap-1">
            Lihat Pesan Masuk <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Keahlian (Skills)</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {loading ? '...' : skillCount}
          </div>
          <Link href="/admin/skills" className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline inline-flex items-center gap-1">
            Kelola Skills <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pendidikan</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {loading ? '...' : educationCount}
          </div>
          <Link href="/admin/education" className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1">
            Kelola Riwayat <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        </div>

      {/* Quick Actions & Recent Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Aksi Cepat</h2>
          <div className="space-y-3">
            <Link
              href="/admin/projects/new"
              className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 hover:border-red-500 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Tambah Proyek Baru</h4>
                  <p className="text-xs text-gray-500">Buat case study proyek baru</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin/profile"
              className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 hover:border-red-500 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Edit Profil & Hero</h4>
                  <p className="text-xs text-gray-500">Perbarui headline, bio, dan link</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin/messages"
              className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 hover:border-red-500 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Lihat Pesan Kontak</h4>
                  <p className="text-xs text-gray-500">Cek pesan dari pengunjung</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pesan Terbaru</h2>
            <Link href="/admin/messages" className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline">
              Lihat Semua
            </Link>
          </div>

          <div className="bg-white dark:bg-[#1e1e24] rounded-3xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden shadow-sm">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Belum ada pesan kontak yang masuk.
              </div>
            ) : (
              messages.slice(0, 4).map((msg) => (
                <div key={msg.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {msg.name}
                      </span>
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {msg.email}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 pt-1">
                      {msg.message}
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
                    {new Date(msg.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
