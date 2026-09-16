'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Project } from '@/lib/types';
import { Briefcase, ArrowUpRight, Github, Sparkles } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsProps) {
  const { lang, t } = useLanguage();

  return (
    <section id="work" className="py-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t('Karya & Portofolio', 'Selected Works')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {t('Proyek Unggulan', 'Featured Projects')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm">
          {t('Koleksi aplikasi web dan mobile yang dirancang dengan teliti.', 'A curated selection of web and mobile applications engineered with care.')}
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {projects.map((project, idx) => {
          const category = lang === 'id' ? project.category_id : project.category_en;
          const desc = lang === 'id' ? project.description_id : project.description_en;
          
          // Asymmetric column widths: First is 7 cols, second is 5 cols, others 6 cols
          const colSpan = idx === 0 
            ? 'lg:col-span-7' 
            : idx === 1 
            ? 'lg:col-span-5' 
            : 'lg:col-span-6';

          return (
            <div
              key={project.id || project.slug}
              className={`bento-card ${colSpan} p-6 sm:p-8 flex flex-col justify-between group bg-white dark:bg-[#141417] relative`}
            >
              <div className="bento-glow" />

              {/* Cover Image Container */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-[#18181d] border border-neutral-200/70 dark:border-neutral-800 mb-6">
                <Image
                  src={project.cover_image || '/img/optimized/portfolio/home.webp'}
                  alt={project.title}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={project.cover_image.startsWith('data:')}
                />
                
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-neutral-900 dark:text-white border border-black/5 dark:border-white/10 shadow-sm">
                    {category}
                  </span>
                </div>
              </div>

              {/* Text info & Actions */}
              <div className="space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                        title="GitHub Repo"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                  {project.tools ? (
                    <span className="text-xs text-neutral-500 truncate max-w-[60%]">
                      {project.tools}
                    </span>
                  ) : (
                    <span />
                  )}

                  <Link
                    href={`/project/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  >
                    <span>{t('Studi Kasus', 'Case Study')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
