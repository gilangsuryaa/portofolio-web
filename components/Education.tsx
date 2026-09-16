'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Education } from '@/lib/types';
import { GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';

interface EducationProps {
  educationList: Education[];
}

export default function EducationSection({ educationList }: EducationProps) {
  const { lang, t } = useLanguage();

  return (
    <section id="education" className="py-4">
      <div className="bento-card p-8 sm:p-10 bg-white dark:bg-[#141417]">
        <div className="bento-glow" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <GraduationCap className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {t('Riwayat Pendidikan', 'Academic Background')}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t('Jejak perjalanan sekolah dan kejuruan', 'Educational milestones and timeline')}
              </p>
            </div>
          </div>
        </div>

        {/* Bento Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {educationList.map((edu, idx) => {
            const desc = lang === 'id' ? edu.description_id : edu.description_en;
            const isCurrent = idx === educationList.length - 1;

            return (
              <div
                key={edu.id || idx}
                className={`p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isCurrent
                    ? 'bg-neutral-50 dark:bg-[#191920] border border-blue-500/30 dark:border-blue-500/30 shadow-sm'
                    : 'bg-neutral-50/60 dark:bg-[#17171c] border border-neutral-200/60 dark:border-neutral-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white dark:bg-[#121215] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>{edu.period}</span>
                    </span>

                    {isCurrent && (
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('Aktif', 'Active')}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {edu.institution}
                  </h3>

                  <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
