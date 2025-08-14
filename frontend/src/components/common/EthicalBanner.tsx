import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const EthicalBanner: React.FC = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const bannerContent = {
    ko: {
      title: 'AI 윤리 가이드라인',
      message: 'AdmitAI는 투명하고 윤리적인 AI 사용을 약속합니다. 우리의 AI는 학생들의 창의성을 지원하지만 대체하지 않습니다.',
      learnMore: '자세히 보기',
      dismiss: '닫기'
    },
    en: {
      title: 'AI Ethics Guidelines',
      message: 'AdmitAI commits to transparent and ethical AI use. Our AI supports but never replaces student creativity.',
      learnMore: 'Learn More',
      dismiss: 'Dismiss'
    }
  };

  const content = bannerContent[language as keyof typeof bannerContent] || bannerContent.en;

  return (
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-800">
                {content.title}
              </p>
              <p className="text-sm text-primary-700">
                {content.message}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {content.learnMore}
            </button>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {content.dismiss}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthicalBanner; 