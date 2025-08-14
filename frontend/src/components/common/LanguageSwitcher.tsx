import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'button' | 'dropdown' | 'icon';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  variant = 'button' 
}) => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const isKorean = currentLanguage === 'ko';

  const toggleLanguage = () => {
    const newLanguage = isKorean ? 'en' : 'ko';
    i18n.changeLanguage(newLanguage);
  };

  const getLanguageLabel = () => {
    return isKorean ? 'English' : '한국어';
  };

  const getLanguageCode = () => {
    return isKorean ? 'EN' : 'KO';
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors ${className}`}
        aria-label={`Switch to ${isKorean ? 'English' : 'Korean'}`}
        title={`Switch to ${isKorean ? 'English' : 'Korean'}`}
      >
        <span className="text-sm font-medium text-primary-700">
          {getLanguageCode()}
        </span>
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={currentLanguage}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          aria-label="Select language"
        >
          <option value="en">English</option>
          <option value="ko">한국어</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${className}`}
      aria-label={`Switch to ${isKorean ? 'English' : 'Korean'}`}
    >
      <span className="mr-2">{getLanguageCode()}</span>
      <span>{getLanguageLabel()}</span>
    </button>
  );
};

export default LanguageSwitcher; 