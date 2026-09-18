'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Moon, Sun, Menu, X, ArrowUpRight } from 'lucide-react';
import { Profile } from '@/lib/types';

interface NavbarProps {
  profile?: Profile | null;
}

export default function Navbar({ profile }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const name = profile?.name || 'Gilang Surya Ramadhan';
  const logoUrl = profile?.logo_url || '/img/optimized/gw-bunder.webp';

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-4 z-50 max-w-5xl mx-auto px-4 sm:px-6">
      <nav className="bento-card px-4 sm:px-6 py-3 bg-white/80 dark:bg-[#121215]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg shadow-black/[0.03] dark:shadow-black/40 flex items-center justify-between rounded-full">
        
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-black/10 dark:ring-white/10 group-hover:scale-105 transition-transform duration-300">
            <Image
              src={logoUrl}
              alt="Logo"
              fill
              className="object-cover"
              sizes="32px"
              priority
            />
          </div>
          <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 tracking-tight mr-3">
            {name}
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <Link href="/#about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            {t('Tentang', 'About')}
          </Link>
          <Link href="/#work" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            {t('Proyek', 'Projects')}
          </Link>
          <Link href="/#skills" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            {t('Keahlian', 'Skills')}
          </Link>
          <Link href="/#education" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            {t('Pendidikan', 'Education')}
          </Link>
          <Link href="/#contact" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            {t('Kontak', 'Contact')}
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 ml-4">
          
           {/* Theme Toggle */}
           <button
             onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
             aria-label="Toggle theme"
             className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
           >
             <span className="relative block w-4 h-4">
               <Moon
                 className={`absolute inset-0 w-4 h-4 transition-all duration-300 ease-out motion-reduce:transition-none ${
                   theme === 'dark' ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                 }`}
               />
               <Sun
                 className={`absolute inset-0 w-4 h-4 text-amber-400 transition-all duration-300 ease-out motion-reduce:transition-none ${
                   theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                 }`}
               />
             </span>
           </button>

           {/* Language Toggle */}
           <button
             onClick={toggleLang}
             aria-label="Toggle language"
             className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors relative overflow-hidden"
           >
             <span className="relative block w-full h-full">
               <span
                 className={`inline-block transition-all duration-300 ease-out motion-reduce:transition-none ${
                   lang === 'id' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75 absolute'
                 }`}
               >
                 EN
               </span>
               <span
                 className={`inline-block transition-all duration-300 ease-out motion-reduce:transition-none ${
                   lang === 'id' ? 'opacity-0 rotate-90 scale-75 absolute' : 'opacity-100 rotate-0 scale-100'
                 }`}
               >
                 ID
               </span>
             </span>
           </button>

          {/* Contact CTA */}
          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <span>{t('Hubungi', 'Get in Touch')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="md:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            {/* Kedua ikon ditumpuk agar bisa saling memudar, bukan berganti mendadak */}
            <span className="relative block w-4 h-4">
              <Menu
                className={`absolute inset-0 w-4 h-4 transition-all duration-300 ease-out motion-reduce:transition-none ${
                  mobileOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`absolute inset-0 w-4 h-4 transition-all duration-300 ease-out motion-reduce:transition-none ${
                  mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </span>
          </button>

        </div>
      </nav>

      {/* Mobile Drawer — selalu ter-mount agar transisinya bisa berjalan.
          Saat tertutup: transparan, tidak bisa diklik, dan disembunyikan dari
          pembaca layar serta urutan tab lewat `invisible`. */}
      <div
        className={`md:hidden fixed inset-0 top-20 z-40 px-4 bg-black/40 backdrop-blur-md transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
      >
          <div
            className={`bento-card bg-white dark:bg-[#121215] p-6 flex flex-col gap-4 shadow-2xl rounded-3xl mt-2 border border-black/5 dark:border-white/10 transition-all duration-300 ease-out motion-reduce:transition-none ${
              mobileOpen
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-4 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/#about" onClick={closeMobile} className="text-sm font-medium text-neutral-800 dark:text-neutral-200 py-1">
              {t('Tentang Saya', 'About Me')}
            </Link>
            <Link href="/#work" onClick={closeMobile} className="text-sm font-medium text-neutral-800 dark:text-neutral-200 py-1">
              {t('Portofolio & Proyek', 'Projects')}
            </Link>
            <Link href="/#skills" onClick={closeMobile} className="text-sm font-medium text-neutral-800 dark:text-neutral-200 py-1">
              {t('Keahlian & Stack', 'Skills & Stack')}
            </Link>
            <Link href="/#education" onClick={closeMobile} className="text-sm font-medium text-neutral-800 dark:text-neutral-200 py-1">
              {t('Riwayat Pendidikan', 'Education')}
            </Link>
            <Link href="/#contact" onClick={closeMobile} className="text-sm font-medium text-neutral-800 dark:text-neutral-200 py-1">
              {t('Kontak Saya', 'Contact')}
            </Link>
            <Link
              href="/#contact"
              onClick={closeMobile}
              className="mt-2 text-center py-2.5 text-xs font-semibold rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            >
              {t('Hubungi Saya ↵', 'Get in Touch ↵')}
            </Link>
          </div>
      </div>
    </header>
  );
}
