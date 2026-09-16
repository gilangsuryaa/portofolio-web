'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Skill } from '@/lib/types';
import { Code2, Layers, Cpu, Sparkles } from 'lucide-react';

interface SkillsProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsProps) {
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-4">
      <div className="bento-card p-8 sm:p-10 bg-white dark:bg-[#141417]">
        <div className="bento-glow" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Code2 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {t('Keahlian & Teknologi', 'Skills & Technologies')}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t('Bahasa pemrograman, framework, dan tools yang saya gunakan.', 'Programming languages, frameworks, and modern tools in my workflow.')}
              </p>
            </div>
          </div>
        </div>

        {/* Minimalist Skills Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-[#18181d] border border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 flex items-center gap-3.5 group hover:shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#121215] border border-neutral-200/70 dark:border-neutral-700/80 p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Image
                  src={skill.icon_url}
                  alt={skill.name}
                  width={24}
                  height={24}
                  className="object-contain"
                  unoptimized
                />
              </div>
              
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {skill.name}
                </h4>
                <span className="text-[11px] text-neutral-400 block truncate">
                  {skill.category || 'Development'}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
