'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Widget Cloudflare Turnstile.
 *
 * Dibuat tanpa paket npm tambahan — cukup skrip resmi Cloudflare dengan mode
 * render eksplisit, supaya widget bisa mengikuti tema gelap/terang dan bahasa
 * situs, serta bisa di-reset setelah form dikirim.
 *
 * Token yang dihasilkan hanya berlaku sekali pakai dan kedaluwarsa dalam
 * beberapa menit, karena itu ada callback untuk kedaluwarsa dan galat.
 */

const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('bukan browser'));
    if (window.turnstile) return resolve();

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('skrip gagal dimuat')));
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('skrip gagal dimuat'));
    document.head.appendChild(script);
  });
}

interface TurnstileProps {
  siteKey: string;
  onToken: (token: string) => void;
  /** Naikkan nilainya untuk memaksa widget mengulang tantangan. */
  resetKey?: number;
}

export default function Turnstile({ siteKey, onToken, resetKey = 0 }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const { theme } = useTheme();
  const { lang } = useLanguage();

  // Disimpan di ref agar perubahan fungsi induk tidak memicu render ulang widget.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          language: lang,
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current(''),
        });
      })
      .catch(() => {
        // Skrip Cloudflare tidak bisa dimuat (jaringan diblokir, pemblokir iklan).
        // Widget tidak tampil; server tetap menolak kiriman tanpa token yang sah.
        onTokenRef.current('');
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* widget sudah tidak ada */
        }
        widgetIdRef.current = null;
      }
      onTokenRef.current('');
    };
    // Tema dan bahasa ikut dependensi: widget dibuat ulang agar tampilannya
    // menyesuaikan. Konsekuensinya token lama dibuang, dan itu memang benar.
  }, [siteKey, theme, lang]);

  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        /* abaikan */
      }
      onTokenRef.current('');
    }
  }, [resetKey]);

  return <div ref={containerRef} />;
}
