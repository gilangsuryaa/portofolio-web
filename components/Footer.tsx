'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Profile } from '@/lib/types';
import { Linkedin, Mail, Github, Instagram, ArrowUp } from 'lucide-react';

interface FooterProps {
  profile?: Profile | null;
}

export default function Footer({ profile }: FooterProps) {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const name = profile?.name || 'Gilang Surya Ramadhan';
  const email = profile?.email || 'gs7832583@gmail.com';
  const linkedin = profile?.linkedin_url || 'https://www.linkedin.com/in/gilang-surya-ramadhan-781084391';
  const github = profile?.github_url || 'https://github.com/gilangsuryaa';
  const instagram = profile?.instagram_url || 'https://www.instagram.com/gilang.sra';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-neutral-200/60 dark:border-neutral-800/80 mt-12 text-xs text-neutral-500 dark:text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <p className="font-medium text-neutral-700 dark:text-neutral-300">
            &copy; {currentYear} {name}
          </p>
        </div>

        {/* Social Icons & Back to Top */}
        <div className="flex items-center gap-3">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-[#18181d] text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-[#18181d] text-neutral-600 dark:text-neutral-300 hover:text-red-500 transition"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}

          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-[#18181d] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
            >
              <Github className="w-4 h-4" />
            </a>
          )}

          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-[#18181d] text-neutral-600 dark:text-neutral-300 hover:text-pink-500 transition"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="p-2.5 rounded-full bg-neutral-100 dark:bg-[#18181d] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition ml-2"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
