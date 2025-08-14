import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HSDashboardSectionProps {
  className?: string;
}

const HSDashboardSection: React.FC<HSDashboardSectionProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  return (
    <section className={`py-24 bg-black ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs tracking-widest font-semibold text-purple-400/90 uppercase">{t('hsDashboard.tag')}</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-white">{t('hsDashboard.title')}</h2>
          <p className="mt-4 text-xl text-text-secondary max-w-3xl mx-auto">{t('hsDashboard.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Value bullets */}
          <div className="bg-bg-card border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-6">{t('forSchools.sections.features.title')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-purple-400"></div>
                <div>
                  <p className="text-white font-medium">{t('hsDashboard.bullets.hub.title')}</p>
                  <p className="text-text-secondary text-sm">{t('hsDashboard.bullets.hub.desc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-400"></div>
                <div>
                  <p className="text-white font-medium">{t('hsDashboard.bullets.write.title')}</p>
                  <p className="text-text-secondary text-sm">{t('hsDashboard.bullets.write.desc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-400"></div>
                <div>
                  <p className="text-white font-medium">{t('hsDashboard.bullets.workflow.title')}</p>
                  <p className="text-text-secondary text-sm">{t('hsDashboard.bullets.workflow.desc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-orange-400"></div>
                <div>
                  <p className="text-white font-medium">{t('hsDashboard.bullets.checklists.title')}</p>
                  <p className="text-text-secondary text-sm">{t('hsDashboard.bullets.checklists.desc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-pink-400"></div>
                <div>
                  <p className="text-white font-medium">{t('hsDashboard.bullets.oversight.title')}</p>
                  <p className="text-text-secondary text-sm">{t('hsDashboard.bullets.oversight.desc')}</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/schools" className="inline-flex items-center justify-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/25">
                {t('hsDashboard.ctaExplore')}
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white hover:border-purple-500 hover:text-purple-400 rounded-lg font-semibold transition-all duration-200">
                {t('hsDashboard.ctaTalk')}
              </Link>
            </div>
          </div>

          {/* Right: Mock dashboard card */}
          <div className="bg-bg-card border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-text-muted">{t('hsDashboard.mock.schoolView')}</p>
                <h4 className="text-white font-semibold">{t('hsDashboard.mock.applicationChecklist')}</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-text-muted text-sm">{t('hsDashboard.mock.live')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked readOnly className="w-4 h-4 rounded border-white/20 bg-black/30" />
                    <div>
                      <p className="text-white text-sm font-medium">Common App Personal Essay</p>
                      <p className="text-text-muted text-xs">Final draft approved</p>
                    </div>
                  </div>
                  <span className="text-green-400 text-sm font-medium">{t('hsDashboard.mock.done')}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-black/30" />
                    <div>
                      <p className="text-white text-sm font-medium">Cornell Supplement: College of Engineering</p>
                      <p className="text-text-muted text-xs">Outline ready • Draft 1 in review</p>
                    </div>
                  </div>
                  <span className="text-orange-400 text-sm font-medium">{t('hsDashboard.mock.inProgress')}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-black/30" />
                    <div>
                      <p className="text-white text-sm font-medium">Recommendations & School Report</p>
                      <p className="text-text-muted text-xs">Teacher A submitted • Counselor pending</p>
                    </div>
                  </div>
                  <span className="text-blue-400 text-sm font-medium">{t('hsDashboard.mock.awaiting')}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-black/30" />
                    <div>
                      <p className="text-white text-sm font-medium">Financial Aid: FAFSA / CSS Profile</p>
                      <p className="text-text-muted text-xs">FAFSA complete • CSS opens Oct</p>
                    </div>
                  </div>
                  <span className="text-text-muted text-sm font-medium">{t('hsDashboard.mock.planned')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted text-sm">{t('hsDashboard.mock.overallProgress')}</span>
                <span className="text-white text-sm font-medium">62%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[62%] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HSDashboardSection;

