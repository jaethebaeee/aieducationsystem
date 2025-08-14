import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForSchoolsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black">
      <header className="pt-28 pb-16 text-center px-4">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
          {t('forSchools.hero.title')}
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          {t('forSchools.hero.subtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/onboarding/advisor" className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-200">
            {t('forSchools.hero.ctaPrimary')}
          </Link>
          <Link to="/contact" className="px-8 py-4 border border-white/30 text-white hover:border-purple-500 hover:text-purple-500 rounded-lg font-semibold transition-all duration-200">
            {t('forSchools.hero.ctaSecondary')}
          </Link>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">{t('forSchools.sections.features.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-bg-card border border-white/10 rounded-2xl p-6">
              <p className="text-white font-medium">{t('forSchools.sections.features.items.dashboard')}</p>
            </div>
            <div className="bg-bg-card border border-white/10 rounded-2xl p-6">
              <p className="text-white font-medium">{t('forSchools.sections.features.items.prompts')}</p>
            </div>
            <div className="bg-bg-card border border-white/10 rounded-2xl p-6">
              <p className="text-white font-medium">{t('forSchools.sections.features.items.workflows')}</p>
            </div>
            <div className="bg-bg-card border border-white/10 rounded-2xl p-6">
              <p className="text-white font-medium">{t('forSchools.sections.features.items.checklists')}</p>
            </div>
            <div className="bg-bg-card border border-white/10 rounded-2xl p-6">
              <p className="text-white font-medium">{t('forSchools.sections.features.items.oversight')}</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-bg-card border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">{t('forSchools.sections.pricing.title')}</h3>
            <p className="text-text-secondary mb-6">{t('forSchools.sections.pricing.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="px-8 py-4 border border-white/30 text-white hover:border-purple-500 hover:text-purple-500 rounded-lg font-semibold transition-all duration-200">
                {t('forSchools.sections.pricing.ctaContact')}
              </Link>
              <Link to="/onboarding/advisor" className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-200">
                {t('forSchools.sections.pricing.ctaStart')}
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-6">{t('forSchools.sections.faq.title')}</h3>
          <div className="space-y-4">
            <div className="bg-bg-card border border-white/10 rounded-2xl p-6">
              <p className="text-white font-medium mb-1">{t('forSchools.sections.faq.q1.q')}</p>
              <p className="text-text-secondary text-sm">{t('forSchools.sections.faq.q1.a')}</p>
            </div>
            <div className="bg-bg-card border border-white/10 rounded-2xl p-6">
              <p className="text-white font-medium mb-1">{t('forSchools.sections.faq.q2.q')}</p>
              <p className="text-text-secondary text-sm">{t('forSchools.sections.faq.q2.a')}</p>
            </div>
            <div className="bg-bg-card border border-white/10 rounded-2xl p-6">
              <p className="text-white font-medium mb-1">{t('forSchools.sections.faq.q3.q')}</p>
              <p className="text-text-secondary text-sm">{t('forSchools.sections.faq.q3.a')}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForSchoolsPage;

