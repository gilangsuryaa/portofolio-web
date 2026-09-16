'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { getProjectBySlug, getProjects, getProfile } from '@/lib/data-service';
import { Project, Profile } from '@/lib/types';
import { initialProjects, initialProfile } from '@/lib/supabase/fallback-data';
import { ArrowLeft, ArrowRight, ArrowUpRight, Home, Sun, Moon, Github, Globe, Wrench, Clock, UserCheck, Layers } from 'lucide-react';

export default function ProjectCaseStudyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { lang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const [proj, list, prof] = await Promise.all([
          getProjectBySlug(slug),
          getProjects(),
          getProfile()
        ]);
        if (proj) setProject(proj);
        if (list) setAllProjects(list);
        if (prof) setProfile(prof);
      } catch (err) {
        console.error('Failed to load project details:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bento-bg)]">
        <div className="w-8 h-8 border-3 border-neutral-400 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bento-bg)] p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('Proyek Tidak Ditemukan', 'Project Not Found')}</h1>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-neutral-900 text-white font-semibold text-xs"
        >
          {t('Kembali ke Beranda', 'Back to Home')}
        </Link>
      </div>
    );
  }

  const currentIndex = allProjects.findIndex(p => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  const category = lang === 'id' ? project.category_id : project.category_en;
  const overview = lang === 'id' ? project.overview_id : project.overview_en;
  const role = lang === 'id' ? project.role_id : project.role_en;
  const timeline = lang === 'id' ? project.timeline_id : project.timeline_en;
  const process = lang === 'id' ? project.process_id : project.process_en;
  const challenge = lang === 'id' ? project.challenge_id : project.challenge_en;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bento-bg)] text-[var(--bento-text)]">
      
      {/* Floating Navbar */}
      <header className="sticky top-4 z-50 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="bento-card px-4 sm:px-6 py-3 bg-white/80 dark:bg-[#121215]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg shadow-black/[0.03] dark:shadow-black/40 flex items-center justify-between rounded-full">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-neutral-200 transition">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
              {profile.name}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleLang}
              aria-label="Toggle language"
              className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
            >
              {lang === 'id' ? 'EN' : 'ID'}
            </button>
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Bento Case Study */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-grow space-y-6 w-full">
        
        {/* Main Showcase Hero Bento */}
        <div className="bento-card p-8 sm:p-12 bg-white dark:bg-[#141417] space-y-8">
          <div className="bento-glow" />

          <div className="space-y-4 max-w-3xl">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
              {project.title}
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed pt-2">
              {overview || (lang === 'id' ? project.description_id : project.description_en)}
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-[#18181d] border border-neutral-200/70 dark:border-neutral-800 shadow-xl">
            <Image
              src={project.cover_image || '/img/optimized/portfolio/home.webp'}
              alt={project.title}
              fill
              className="object-cover object-top"
              priority
              unoptimized={project.cover_image.startsWith('data:')}
            />
          </div>
        </div>

        {/* Metadata Bento Grid (3 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {role && (
            <div className="bento-card p-6 bg-white dark:bg-[#141417]">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>{t('Peran Saya', 'My Role')}</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">{role}</p>
            </div>
          )}

          {project.tools && (
            <div className="bento-card p-6 bg-white dark:bg-[#141417]">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                <Wrench className="w-3.5 h-3.5 text-blue-500" />
                <span>{t('Teknologi', 'Tech Stack')}</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">{project.tools}</p>
            </div>
          )}

          {timeline && (
            <div className="bento-card p-6 bg-white dark:bg-[#141417]">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>{t('Durasi Proyek', 'Timeline')}</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">{timeline}</p>
            </div>
          )}
        </div>

        {/* Process & Challenges Bento Cards */}
        {process && (
          <div className="bento-card p-8 sm:p-10 bg-white dark:bg-[#141417] space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {t('Proses & Alur Kerja', 'Development Process & Workflow')}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {process}
            </p>
          </div>
        )}

        {challenge && (
          <div className="bento-card p-8 sm:p-10 bg-white dark:bg-[#141417] space-y-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {t('Tantangan & Solusi Arsitektur', 'The Challenge & Technical Solutions')}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {challenge}
            </p>

            {project.challenge_images && project.challenge_images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {project.challenge_images.map((imgUrl, i) => (
                  <div key={i} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100 dark:bg-[#18181d] shadow-sm">
                    <Image
                      src={imgUrl}
                      alt={`Challenge Screenshot ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={imgUrl.startsWith('data:')}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm transition hover:opacity-90"
            >
              <Github className="w-4 h-4" />
              <span>{t('Lihat Source Code', 'View Source Code')}</span>
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition"
            >
              <Globe className="w-4 h-4" />
              <span>{t('Kunjungi Live Demo', 'Visit Live Demo')}</span>
            </a>
          )}
        </div>

        {/* Prev / Next Navigation Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/80">
          {prevProject && (
            <Link
              href={`/project/${prevProject.slug}`}
              className="bento-card p-5 bg-white dark:bg-[#141417] flex items-center gap-3 hover:border-blue-500/40 transition group"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:-translate-x-1 transition-transform" />
              <div>
                <span className="block text-[11px] text-neutral-400">{t('Proyek Sebelumnya', 'Previous')}</span>
                <span className="font-bold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 transition-colors">
                  {prevProject.title}
                </span>
              </div>
            </Link>
          )}

          {nextProject && (
            <Link
              href={`/project/${nextProject.slug}`}
              className="bento-card p-5 bg-white dark:bg-[#141417] flex items-center justify-between hover:border-blue-500/40 transition group ml-auto w-full sm:w-auto sm:min-w-[240px]"
            >
              <div className="text-right flex-grow">
                <span className="block text-[11px] text-neutral-400">{t('Proyek Selanjutnya', 'Next')}</span>
                <span className="font-bold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 transition-colors">
                  {nextProject.title}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform ml-3" />
            </Link>
          )}
        </div>

      </main>

      <footer className="py-8 border-t border-neutral-200/60 dark:border-neutral-800/80 text-center text-xs text-neutral-400">
        &copy; {new Date().getFullYear()} {profile.name}
      </footer>
    </div>
  );
}
