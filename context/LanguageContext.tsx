'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'id' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
  t: (idText: string, enText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('id');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
      setLangState(savedLang);
      document.documentElement.lang = savedLang;
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.lang = newLang;
  };

  const toggleLang = () => {
    const nextLang = lang === 'id' ? 'en' : 'id';
    setLang(nextLang);
  };

  const t = (idText: string, enText: string) => {
    return lang === 'id' ? idText : enText;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
