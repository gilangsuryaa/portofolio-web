'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Download, ArrowUpRight, MapPin, Sparkles, Code, Briefcase } from 'lucide-react';
import { Profile } from '@/lib/types';

interface HeroProps {
  profile?: Profile | null;
}

export default function Hero({ profile }: HeroProps) {
  const { lang, t } = useLanguage();

  const title = lang === 'id' 
    ? (profile?.title_id || 'Gilang Surya Ramadhan — Specialist Programmer')
    : (profile?.title_en || 'Gilang Surya Ramadhan — Specialist Programmer');

  const tagline = lang === 'id'
    ? (profile?.tagline_id || 'Bersemangat dalam bidang teknologi, selalu mengikuti perkembangan terbaru dan berusaha memberikan solusi terbaik melalui pemrograman.')
    : (profile?.tagline_en || 'Passionate about technology, always keeping up with the latest developments and striving to provide the best solutions through programming.');

  const avatarUrl = profile?.avatar_url || '/img/optimized/gw.webp';
  const cvUrl = profile?.cv_url || '/assests/CV.pdf';
  const name = profile?.name || 'Gilang Surya Ramadhan';

  const location = profile?.location || 'Purwokerto, Indonesia';
  const specialization = profile?.specialization || 'Rekayasa Perangkat Lunak';
  const currentSchool = profile?.current_school || 'SMK Telkom';
  const schoolPeriod = profile?.school_period || '2024 - 2027';

  const cvFileName = `CV_${name.trim().replace(/\s+/g, '_')}.pdf`;

  // Subjudul diambil dari title profile, dengan nama dibuang agar tidak terduplikasi
  const subtitle =
    title.replace(name, '').replace(/^(\s*[-—]\s*)/, '').trim() ||
    'Specialist Programmer & Web Developer';

  return (
    <section className="pt-8 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main Bento Hero Card (8 cols) */}
        <div className="bento-card lg:col-span-8 p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-gradient-to-br from-white to-neutral-50 dark:from-[#141417] dark:to-[#0f0f12]">
          <div className="bento-glow" />
          
          <div className="space-y-6">
            
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('Tersedia untuk Kolaborasi & Proyek', 'Available for Collaboration & Work')}</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
                {name}
              </h1>
              <p className="text-base sm:text-lg font-medium text-neutral-500 dark:text-neutral-400">
                {subtitle}
              </p>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
              {tagline}
            </p>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-8 mt-4 border-t border-neutral-100 dark:border-neutral-800/80">
            <a
              href={cvUrl}
              download={cvFileName}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>{t('Unduh CV', 'Download CV')}</span>
            </a>

            <a
              href="#work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 transition-all transform hover:-translate-y-0.5"
            >
              <span>{t('Lihat Proyek', 'View Projects')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Profile Image Bento Card (4 cols) */}
        <div className="bento-card lg:col-span-4 relative group min-h-[340px] sm:min-h-[400px] flex flex-col justify-end p-6 overflow-hidden bg-neutral-100 dark:bg-[#141417]">
          
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Bottom Floating Metadata Pills */}
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{location}</span>
            </div>

            <div className="flex items-center justify-between text-white pt-1">
              <div>
                <p className="text-xs text-neutral-300 font-medium">{t('Jurusan', 'Major')}</p>
                <p className="text-sm font-bold">{specialization}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-300 font-medium">{currentSchool}</p>
                <p className="text-sm font-bold">{schoolPeriod}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
