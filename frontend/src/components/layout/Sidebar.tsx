import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUI } from '../../contexts/UIContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  BookOpenIcon, 
  UserGroupIcon,
  AcademicCapIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUI();
  const { t } = useLanguage();
  const location = useLocation();

  const navigation = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: HomeIcon,
      description: t('nav.dashboardDesc')
    },
    {
      name: t('nav.essays'),
      href: '/essays',
      icon: DocumentTextIcon,
      description: t('nav.essaysDesc')
    },
    {
      name: t('nav.admissionsPulse'),
      href: '/admissions-pulse',
      icon: CloudIcon,
      description: t('nav.admissionsPulseDesc')
    },
    {
      name: t('nav.resources'),
      href: '/resources',
      icon: BookOpenIcon,
      description: t('nav.resourcesDesc')
    },
    {
      name: t('nav.community'),
      href: '/community',
      icon: UserGroupIcon,
      description: t('nav.communityDesc')
    },
    {
      name: t('nav.mentor'),
      href: '/mentor',
      icon: AcademicCapIcon,
      description: t('nav.mentorDesc')
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-black border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-bold text-white text-korean">AdmitAI Korea</h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[56px] ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <item.icon className={`w-6 h-6 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-white/50 group-hover:text-white'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-korean">{item.name}</span>
                    <p className="text-xs text-white/50 mt-1 text-korean hidden lg:block">
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-black rounded-lg shadow-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Sidebar; 