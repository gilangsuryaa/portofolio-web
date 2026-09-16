'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Profile } from '@/lib/types';
import { User, Sparkles, Code2, Compass } from 'lucide-react';

interface AboutProps {
  profile?: Profile | null;
}

export default function About({ profile }: AboutProps) {
  const { lang, t } = useLanguage();

  const aboutText = lang === 'id'
    ? (profile?.about_id || 'Saya adalah seorang siswa SMK Telkom Purwokerto...')
    : (profile?.about_en || 'I am a student at SMK Telkom Purwokerto...');

  const spec1 = profile?.specialization_1 || 'Frontend & Web';
  const spec2 = profile?.specialization_2 || 'Next.js & Laravel';
  const spec3 = profile?.specialization_3 || 'Supabase & SQL';

  const philosophy = lang === 'id'
    ? (profile?.philosophy_id || 'Membangun aplikasi yang cepat, bersih, dan berorientasi pengguna.')
    : (profile?.philosophy_en || 'Building fast, clean, and user-centric applications.');

  const philosophyDesc = lang === 'id'
    ? (profile?.philosophy_desc_id || 'Selalu antusias mempelajari teknologi terdepan dan menyajikan arsitektur kode yang terstruktur.')
    : (profile?.philosophy_desc_en || 'Passionate about exploring modern web technologies and engineering well-architected solutions.');

  const motto = profile?.motto || 'Clean Code & Architecture';

  return (
    <section id="about" className="py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main About Story Bento (8 cols) */}
        <div className="bento-card lg:col-span-8 p-8 sm:p-10 flex flex-col justify-between bg-white dark:bg-[#141417]">
          <div className="bento-glow" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <User className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {t('Tentang Saya', 'About Me')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {t('Fokus pada Pemrograman & Pengembangan Solusi Modern', 'Focused on Programming & Modern Software Solutions')}
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed pt-2">
              {aboutText}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#18181d] border border-neutral-100 dark:border-neutral-800">
              <p className="text-neutral-400 font-medium">{t('Spesialisasi', 'Specialization')}</p>
              <p className="text-neutral-800 dark:text-neutral-200 font-bold mt-0.5">{spec1}</p>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#18181d] border border-neutral-100 dark:border-neutral-800">
              <p className="text-neutral-400 font-medium">{t('Framework', 'Framework')}</p>
              <p className="text-neutral-800 dark:text-neutral-200 font-bold mt-0.5">{spec2}</p>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-[#18181d] border border-neutral-100 dark:border-neutral-800 col-span-2 sm:col-span-1">
              <p className="text-neutral-400 font-medium">{t('Database', 'Database')}</p>
              <p className="text-neutral-800 dark:text-neutral-200 font-bold mt-0.5">{spec3}</p>
            </div>
          </div>

        </div>

        {/* Quick Philosophy / Mindset Bento (4 cols) */}
        <div className="bento-card lg:col-span-4 p-8 flex flex-col justify-between bg-gradient-to-br from-neutral-900 to-neutral-950 text-white dark:from-[#18181c] dark:to-[#121215]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 text-amber-300">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {t('Prinsip Kerja', 'My Philosophy')}
              </span>
            </div>

            <h3 className="text-xl font-bold leading-snug">
              {philosophy}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {philosophyDesc}
            </p>
          </div>

          <div className="pt-6 flex items-center justify-between text-xs text-neutral-400 border-t border-white/10">
            <span>{motto}</span>
            <span className="text-emerald-400 font-semibold">{t('Siap', 'Ready')}</span>
          </div>

        </div>

      </div>
    </section>
  );
}
