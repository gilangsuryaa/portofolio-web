'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { fading } = useLanguage();

  return (
    <div
      className={`transition-opacity duration-150 motion-reduce:transition-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
}
