import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const translations = {
  en: {
    title: 'Feedback',
    comingSoon: 'This page is coming soon!'
  },
  ko: {
    title: '피드백',
    comingSoon: '이 페이지는 곧 제공됩니다!'
  }
};

type Lang = keyof typeof translations;

const FeedbackPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[(language as Lang)] || translations.en;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 text-lg text-center">{t.comingSoon}</p>
      </div>
    </div>
  );
};

export default FeedbackPage; 