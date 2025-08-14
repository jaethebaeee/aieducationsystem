import React from 'react';
import SEOHead from '../components/seo/SEOHead';
import ScaleNavigation from '../components/Navigation/ScaleNavigation';
import ScaleHero from '../components/Hero/ScaleHero';
import ProductSections from '../components/Products/ProductSections';
import FeaturesSection from '../components/Features/FeaturesSection';
import ScaleFooter from '../components/layout/ScaleFooter';
import ScientificOptimizer from '../components/Sections/ScientificOptimizer';
import AnnouncementBanner from '../components/common/AnnouncementBanner';
import HSDashboardSection from '../components/Sections/HSDashboardSection';

const ScaleLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <SEOHead
        title="AdmitAI Korea | 한국 학생을 위한 미국대학 지원 플랫폼"
        description="한국 학생을 위한 올인원 미국 대학 입학 플랫폼. 문화 맥락을 이해하는 AI, 대학 리서치, 에세이 분석, 재정 설계까지."
        keywords="미국 대학 입학, 한국 학생, 에세이 분석, 대학 리서치, 입학 전략, 재정 설계"
        canonical="https://admitplanner.site/"
        ogImage="/og-image.jpg"
        ogImageAlt="AdmitAI Korea platform preview"
        language="ko"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'AdmitAI Korea',
          url: 'https://admitai.kr/',
          logo: 'https://admitai.kr/logo.png',
          sameAs: [
            'https://www.facebook.com/admitaikorea',
            'https://www.instagram.com/admitaikorea',
            'https://www.youtube.com/channel/admitaikorea'
          ],
          contactPoint: [{
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'support@admitai.korea',
            areaServed: 'KR',
            availableLanguage: ['ko', 'en']
          }]
        }}
      />
      <AnnouncementBanner
        message="Applications for 2025 intake are open — start now to maximize your odds!"
        ctaLabel="Start now"
        to="/onboarding/advisor"
      />
      {/* Navigation */}
      <ScaleNavigation />
      
      {/* Hero Section */}
      <ScaleHero />

      {/* Product Sections */}
      <ProductSections />
      
      {/* HS Dashboard Section */}
      <HSDashboardSection />
      
      {/* Features Section */}
      <FeaturesSection />

      {/* Scientific Optimizer Section */}
      <ScientificOptimizer />

      {/* Footer */}
      <ScaleFooter />
    </div>
  );
};

export default ScaleLanding;