import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PrivateSEO from '../components/seo/PrivateSEO';

const translations = {
  en: {
    title: 'Admissions Pulse',
    comingSoon: 'This page is coming soon!'
  },
  ko: {
    title: '입학 펄스',
    comingSoon: '이 페이지는 곧 제공됩니다!'
  }
};

type Lang = keyof typeof translations;

const AdmissionsPulsePage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[(language as Lang)] || translations.en;

  return (
    <div className="space-y-6">
      <PrivateSEO title={t.title} language={language as Lang} />
      <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 text-lg text-center">{t.comingSoon}</p>
      </div>
    </div>
  );
};

export default AdmissionsPulsePage; 