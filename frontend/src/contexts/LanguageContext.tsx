import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  toggleLanguage: () => void;
  isKorean: boolean;
  isEnglish: boolean;
  t: (key: string, options?: any) => string;
  currentLanguage: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('preferred-language');
    if (saved === 'ko' || saved === 'en') return saved;
    return i18n.language || (navigator.language.startsWith('ko') ? 'ko' : 'en');
  });

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  }, [i18n]);

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
  }, [language, setLanguage]);

  useEffect(() => {
    // Initialize language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('preferred-language');
    const browserLanguage = navigator.language.startsWith('ko') ? 'ko' : 'en';
    const initialLanguage = savedLanguage || browserLanguage;
    
    if (initialLanguage !== i18n.language) {
      setLanguage(initialLanguage);
    }
  }, [i18n, setLanguage]);

  useEffect(() => {
    // Update state when i18n language changes
    setLanguageState(i18n.language);
  }, [i18n.language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    isKorean: language === 'ko',
    isEnglish: language === 'en',
    t,
    currentLanguage: language,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 