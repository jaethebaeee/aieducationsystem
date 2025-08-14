import React from 'react';
import { useUI } from '../../contexts/UIContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../hooks/useSubscription';

const Header: React.FC = () => {
  const { toggleSidebar } = useUI();
  const { currentLanguage, setLanguage } = useLanguage();
  const { active, loading, plan } = useSubscription();

  return (
    <header className="bg-black/70 border-b border-white/10 sticky top-0 z-40 backdrop-blur">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side - Menu button and logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-white">AdmitAI Korea</h1>
          </div>
        </div>
        {/* Right side - Language toggle + plan badge */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
              loading ? 'text-white/60 border-white/10' : active ? 'text-green-300 border-green-700/50 bg-green-600/10' : 'text-yellow-300 border-yellow-700/50 bg-yellow-600/10'
            }`}>
              {loading ? '…' : active ? (plan || 'PAID').toUpperCase() : 'FREE'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLanguage('ko')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentLanguage === 'ko'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentLanguage === 'en'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 