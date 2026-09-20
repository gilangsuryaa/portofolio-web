'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Certificate } from '@/lib/types';
import { Award, ChevronLeft, ChevronRight, X, Calendar, Building2 } from 'lucide-react';

interface CertificatesProps {
  certificates: Certificate[];
}

export default function CertificatesSection({ certificates }: CertificatesProps) {
  const { t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const canScrollLeft = scrollPos > 0;
  const canScrollRight = carouselRef.current ? scrollPos < carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10 : false;

  const handleScroll = useCallback(() => {
    if (carouselRef.current) {
      setScrollPos(carouselRef.current.scrollLeft);
    }
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, certificates.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const openModal = (cert: Certificate) => setSelectedCert(cert);
  const closeModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setSelectedCert(null);
      setIsModalClosing(false);
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedCert]);

  if (certificates.length === 0) return null;

  return (
    <>
      <section id="certificates" className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>{t('Pencapaian & Kredensial', 'Achievements & Credentials')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {t('Sertifikat', 'Certificates')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-sm">
            {t('Sertifikasi profesional dan penghargaan yang telah diraih.', 'Professional certifications and achievements earned.')}
          </p>
        </div>

        <div className="bento-card p-6 sm:p-8 bg-white dark:bg-[#141417]">
          <div className="bento-glow" />
          
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-2 px-2 mb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => openModal(cert)}
                className="flex-shrink-0 w-[260px] sm:w-[300px] cursor-pointer group"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#18181d] border border-neutral-200/70 dark:border-neutral-800 mb-3 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 transition-all">
                  <Image
                    src={cert.image_url || '/img/placeholder-cert.png'}
                    alt={cert.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="300px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {cert.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              </button>
            )}

            {certificates.length > 1 && (
              <div className="flex justify-center gap-1.5">
                {certificates.map((_, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700"
                  />
                ))}
              </div>
            )}

            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              </button>
            )}
          </div>
        </div>
      </section>

      {selectedCert && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
            isModalClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in duration-200'
          }`}
          onClick={closeModal}
        >
          <div
            className={`relative bg-white dark:bg-[#141417] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl transition-all duration-300 ${
              isModalClosing 
                ? 'opacity-0 scale-95 translate-y-2' 
                : 'opacity-100 scale-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-neutral-100/90 dark:bg-neutral-800/90 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors backdrop-blur-sm"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>

            <div className="relative w-full bg-neutral-100 dark:bg-[#18181d] rounded-t-2xl overflow-hidden">
              <Image
                src={selectedCert.image_url || '/img/placeholder-cert.png'}
                alt={selectedCert.title}
                width={800}
                height={600}
                className="object-contain w-full h-auto max-h-[50vh]"
                sizes="(max-width: 768px) 100vw, 672px"
                unoptimized
              />
            </div>

            <div className="p-5 sm:p-6 space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white pr-8">
                {selectedCert.title}
              </h3>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span>{selectedCert.issuer}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>{selectedCert.issued_date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
