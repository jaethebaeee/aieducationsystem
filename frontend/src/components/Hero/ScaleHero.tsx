import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TrustBar from '../common/TrustBar';
import EvidencePanel from '../common/EvidencePanel';

interface HeroProps {
  className?: string;
}

const ScaleHero: React.FC<HeroProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  return (
    <section className={`min-h-screen flex items-center justify-center relative overflow-hidden bg-black ${className}`}>
      {/* Gradient Rings Background (Scale AI style) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Ring 1 */}
          <div className="absolute w-96 h-96 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="w-full h-full rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-rotate opacity-30"
                 style={{ 
                   background: 'conic-gradient(from 0deg, #8b5cf6, #ec4899, #f59e0b, #8b5cf6)',
                   mask: 'radial-gradient(circle, transparent 47%, black 50%)',
                   WebkitMask: 'radial-gradient(circle, transparent 47%, black 50%)'
                 }}>
            </div>
          </div>
          
          {/* Ring 2 */}
          <div className="absolute w-[30rem] h-[30rem] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="w-full h-full rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-rotate-reverse opacity-20"
                 style={{ 
                   background: 'conic-gradient(from 180deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
                   mask: 'radial-gradient(circle, transparent 47%, black 50%)',
                   WebkitMask: 'radial-gradient(circle, transparent 47%, black 50%)'
                 }}>
            </div>
          </div>
          
          {/* Ring 3 */}
          <div className="absolute w-[36rem] h-[36rem] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="w-full h-full rounded-full border-2 border-transparent bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 animate-rotate-slow opacity-15"
                 style={{ 
                   background: 'conic-gradient(from 270deg, #f59e0b, #8b5cf6, #3b82f6, #f59e0b)',
                   mask: 'radial-gradient(circle, transparent 47%, black 50%)',
                   WebkitMask: 'radial-gradient(circle, transparent 47%, black 50%)'
                 }}>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Evidence-based
          <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            admissions optimizer
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-text-secondary font-normal max-w-3xl mx-auto mb-8 leading-relaxed">
          We analyze policy, capacity, and writing signals to recommend high‑impact actions. Optimization, not guarantees.
        </p>
        {/* Cohort qualifier */}
        <p className="text-sm text-white/60 mb-6">
          2023–2024 cohort, n=12,042. Metrics reported with 95% CI; see <Link to="/methodology#metrics" className="underline hover:text-white">methodology</Link>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-2">
          <Link to="/schools" className="inline-flex items-center justify-center px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/25">
            {t('forSchools.hero.ctaPrimary')}
          </Link>
          <Link to="/methodology" className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white hover:border-purple-500 hover:text-purple-500 rounded-lg font-semibold text-lg transition-all duration-200">
            View methodology →
          </Link>
        </div>

        {/* Microcopy under primary CTA */}
        <p className="text-text-muted text-sm mb-8">No credit card required. Takes 2 minutes.</p>

        {/* Evidence and trust */}
        <EvidencePanel />
        <div className="mt-8">
          <TrustBar />
        </div>
      </div>
    </section>
  );
};

export default ScaleHero;