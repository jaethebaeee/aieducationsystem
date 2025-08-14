import React, { useState } from 'react';
import SEOHead from '../components/seo/SEOHead';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { paymentsAPI } from '../services/api';
import { toast } from 'react-toastify';

interface PricingTier {
  id: string;
  name: string;
  nameKo: string;
  price: number;
  priceKo: string;
  period: string;
  periodKo: string;
  description: string;
  descriptionKo: string;
  features: string[];
  featuresKo: string[];
  popular?: boolean;
  recommended?: boolean;
  callout?: string;
  calloutKo?: string;
}

const PricingPage: React.FC = () => {
  const { i18n } = useTranslation();
  const language = i18n.language;
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [animateDiscount, setAnimateDiscount] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuth();

  const handleUpgrade = async (planId: 'basic' | 'premium' | 'enterprise') => {
    try {
      if (!isAuthenticated) {
        toast.info(language === 'ko' ? '먼저 로그인 해주세요.' : 'Please log in first.');
        return (window.location.href = '/login');
      }
      const res = await paymentsAPI.createSubscription(planId);
      if (res.success) {
        toast.success(language === 'ko' ? '구독이 활성화되었습니다.' : 'Subscription activated.');
        // Navigate to a premium area or refresh
        window.location.href = '/';
      }
    } catch (e) {
      // interceptor already toasts
    }
  };

  type FeatureGroup = {
    key: 'apps' | 'analytics' | 'coaching';
    label: string;
    labelKo: string;
    color: string; // tailwind text color class for icon
    icon: string; // emoji icon
    items: string[];
    itemsKo: string[];
  };

  const getGroupedFeatures = (tierId: string): FeatureGroup[] => {
    const apps: FeatureGroup = {
      key: 'apps',
      label: 'Application Tools',
      labelKo: '지원 도구',
      color: 'text-indigo-500',
      icon: '🎯',
      items: [],
      itemsKo: [],
    };
    const analytics: FeatureGroup = {
      key: 'analytics',
      label: 'Analytics & Insights',
      labelKo: '분석 및 인사이트',
      color: 'text-blue-500',
      icon: '📊',
      items: [],
      itemsKo: [],
    };
    const coaching: FeatureGroup = {
      key: 'coaching',
      label: 'Coaching & Support',
      labelKo: '코칭 및 지원',
      color: 'text-purple-500',
      icon: '🤝',
      items: [],
      itemsKo: [],
    };

    if (tierId === 'free') {
      apps.items.push('Standard essay templates');
      apps.itemsKo.push('기본 에세이 템플릿');
      analytics.items.push('3 AI essay analyses per month');
      analytics.itemsKo.push('월 3회 AI 에세이 분석');
      coaching.items.push('Email support');
      coaching.itemsKo.push('이메일 지원');
      coaching.items.push('Basic cultural storytelling guide');
      coaching.itemsKo.push('기본 문화적 스토리텔링 가이드');
    }

    if (tierId === 'basic') {
      apps.items.push('Unlimited AI essay analyses');
      apps.itemsKo.push('무제한 AI 에세이 분석');
      apps.items.push('Personalized application roadmap');
      apps.itemsKo.push('개인화된 지원 로드맵');
      apps.items.push('Essay version history');
      apps.itemsKo.push('에세이 버전 관리');
      analytics.items.push('Admissions outlook insights');
      analytics.itemsKo.push('대학별 입학 트렌드 인사이트');
      analytics.items.push('Progress tracking dashboard');
      analytics.itemsKo.push('진행 상황 추적 대시보드');
      coaching.items.push('Advanced cultural storytelling coach');
      coaching.itemsKo.push('고급 문화적 스토리텔링 코치');
      coaching.items.push('Priority email support');
      coaching.itemsKo.push('우선 이메일 지원');
    }

    if (tierId === 'premium') {
      apps.items.push('Everything in Basic');
      apps.itemsKo.push('베이직 플랜의 모든 기능');
      apps.items.push('Interview preparation tools');
      apps.itemsKo.push('면접 준비 도구');
      apps.items.push('Application deadline alerts');
      apps.itemsKo.push('지원 마감일 알림');
      analytics.items.push('Advanced university matching & outlook');
      analytics.itemsKo.push('고급 대학 매칭');
      analytics.items.push('Success rate analytics');
      analytics.itemsKo.push('성공률 분석');
      coaching.items.push('1-on-1 mentor sessions (2/month)');
      coaching.itemsKo.push('1:1 멘토링 세션 (월 2회)');
      coaching.items.push('Financial aid guidance');
      coaching.itemsKo.push('장학금 가이드');
      coaching.items.push('Parent dashboard access');
      coaching.itemsKo.push('부모님 대시보드 접근');
      coaching.items.push('Priority phone support');
      coaching.itemsKo.push('우선 전화 지원');
    }

    if (tierId === 'enterprise') {
      apps.items.push('Everything in Premium');
      apps.itemsKo.push('프리미엄 플랜의 모든 기능');
      apps.items.push('Custom university partnerships');
      apps.itemsKo.push('맞춤형 대학 파트너십');
      analytics.items.push('Advanced analytics dashboard');
      analytics.itemsKo.push('고급 분석 대시보드');
      analytics.items.push('API access');
      analytics.itemsKo.push('API 접근');
      coaching.items.push('Unlimited mentor sessions');
      coaching.itemsKo.push('무제한 멘토링 세션');
      coaching.items.push('White-label solutions');
      coaching.itemsKo.push('화이트 라벨 솔루션');
      coaching.items.push('Custom integrations');
      coaching.itemsKo.push('맞춤형 통합');
      coaching.items.push('Dedicated account manager');
      coaching.itemsKo.push('전담 계정 관리자');
      coaching.items.push('Staff training sessions');
      coaching.itemsKo.push('직원 교육 세션');
    }

    return [apps, analytics, coaching];
  };

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Free',
      nameKo: '무료',
      price: 0,
      priceKo: '0',
      period: 'forever',
      periodKo: '영구',
      description: 'Perfect for getting started with your college application journey',
      descriptionKo: '대학 입학 준비를 시작하기에 완벽한 플랜',
      features: [
        '3 AI essay analyses per month',
        'Basic cultural storytelling guide',
        'Access to community forum',
        'Standard essay templates',
        'Email support'
      ],
      featuresKo: [
        '월 3회 AI 에세이 분석',
        '기본 문화적 스토리텔링 가이드',
        '커뮤니티 포럼 접근',
        '기본 에세이 템플릿',
        '이메일 지원'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      nameKo: '베이직',
      price: billingPeriod === 'monthly' ? 29 : 290,
      priceKo: billingPeriod === 'monthly' ? '29,000' : '290,000',
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      periodKo: billingPeriod === 'monthly' ? '월' : '년',
      description: 'Essential tools for serious applicants',
      descriptionKo: '진지한 지원자를 위한 필수 도구',
      callout: 'Best for high school juniors starting their journey',
      calloutKo: '입시 여정을 시작하는 고등학생에게 적합',
      features: [
        'Unlimited AI essay analyses',
        'Advanced cultural storytelling coach',
        'University weather insights',
        'Personalized application roadmap',
        'Priority email support',
        'Essay version history',
        'Progress tracking dashboard'
      ],
      featuresKo: [
        '무제한 AI 에세이 분석',
        '고급 문화적 스토리텔링 코치',
        '대학별 입학 트렌드 인사이트',
        '개인화된 지원 로드맵',
        '우선 이메일 지원',
        '에세이 버전 관리',
        '진행 상황 추적 대시보드'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      nameKo: '프리미엄',
      price: billingPeriod === 'monthly' ? 59 : 590,
      priceKo: billingPeriod === 'monthly' ? '59,000' : '590,000',
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      periodKo: billingPeriod === 'monthly' ? '월' : '년',
      description: 'Complete support for your admission success',
      descriptionKo: '입학 성공을 위한 완전한 지원',
      callout: 'Best for seniors aiming for top-tier schools',
      calloutKo: '최상위권 대학을 목표로 하는 수험생에게 적합',
      features: [
        'Everything in Basic',
        '1-on-1 mentor sessions (2/month)',
        'Advanced university matching',
        'Interview preparation tools',
        'Financial aid guidance',
        'Parent dashboard access',
        'Priority phone support',
        'Application deadline alerts',
        'Success rate analytics'
      ],
      featuresKo: [
        '베이직 플랜의 모든 기능',
        '1:1 멘토링 세션 (월 2회)',
        '고급 대학 매칭',
        '면접 준비 도구',
        '장학금 가이드',
        '부모님 대시보드 접근',
        '우선 전화 지원',
        '지원 마감일 알림',
        '성공률 분석'
      ],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      nameKo: '엔터프라이즈',
      price: billingPeriod === 'monthly' ? 199 : 1990,
      priceKo: billingPeriod === 'monthly' ? '199,000' : '1,990,000',
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      periodKo: billingPeriod === 'monthly' ? '월' : '년',
      description: 'For schools and educational institutions',
      descriptionKo: '학교 및 교육기관을 위한 플랜',
      callout: 'Best for schools & consulting agencies',
      calloutKo: '학교 및 입시 컨설팅 기관에 적합',
      features: [
        'Everything in Premium',
        'Unlimited mentor sessions',
        'Custom university partnerships',
        'Advanced analytics dashboard',
        'White-label solutions',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        'Staff training sessions'
      ],
      featuresKo: [
        '프리미엄 플랜의 모든 기능',
        '무제한 멘토링 세션',
        '맞춤형 대학 파트너십',
        '고급 분석 대시보드',
        '화이트 라벨 솔루션',
        '전담 계정 관리자',
        'API 접근',
        '맞춤형 통합',
        '직원 교육 세션'
      ]
    }
  ];

  const isKorean = language === 'ko';

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={isKorean ? '가격 | AdmitAI Korea' : 'Pricing | AdmitAI Korea'}
        description={isKorean ? '한국 학생을 위한 AdmitAI Korea 요금제 — 무료로 시작하고 필요에 따라 업그레이드하세요.' : 'AdmitAI Korea pricing — start free and upgrade as needed for Korean students applying to U.S. universities.'}
        keywords={isKorean ? 'AdmitAI Korea 가격, 요금제, 한국 학생 미국 대학' : 'AdmitAI Korea pricing, plans, Korean students US college'}
        canonical="https://admitai.kr/pricing"
        ogImage="/og-image.jpg"
        ogImageAlt={isKorean ? 'AdmitAI Korea 요금제' : 'AdmitAI Korea Pricing Plans'}
        language={isKorean ? 'ko' : 'en'}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'AdmitAI Korea Plans',
          description: isKorean ? '한국 학생을 위한 미국 대학 지원 서비스 플랜' : 'Plans for Korean students applying to U.S. universities',
          brand: { '@type': 'Brand', name: 'AdmitAI Korea' },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: isKorean ? 'KRW' : 'USD',
            lowPrice: billingPeriod === 'monthly' ? 0 : 0,
            highPrice: billingPeriod === 'monthly' ? 199 : 1990,
            offerCount: 4,
            availability: 'https://schema.org/InStock'
          }
        }}
      />
      {/* Header */}
      <div className="bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              {isKorean ? '당신의 꿈의 대학으로—당신에게 맞는 플랜을 선택하세요' : 'Get Into Your Dream College – Pick the Plan That Fits You'}
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              {isKorean 
                ? '무료로 시작하고 언제든 업그레이드하세요. 모든 플랜은 14일 무료 체험과 입학 성공 사례로 검증되었습니다.'
                : 'Start free, upgrade anytime. Plans are backed by real outcomes from Korean students and schools.'
              }
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mt-8">
            <div className="bg-white/10 rounded-2xl p-1 border border-white/10 shadow-inner">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 rounded-xl text-base font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {isKorean ? '월간 결제' : 'Monthly'}
              </button>
              <button
                onClick={() => {
                  setBillingPeriod('yearly');
                  setAnimateDiscount(true);
                  setTimeout(() => setAnimateDiscount(false), 800);
                }}
                className={`px-6 py-3 rounded-xl text-base font-medium transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span>{isKorean ? '연간 결제' : 'Yearly'}</span>
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    billingPeriod === 'yearly'
                      ? 'bg-green-600/20 text-green-300 border-green-700/50'
                      : 'bg-green-600/10 text-green-300 border-green-700/40'
                  } ${billingPeriod === 'yearly' && animateDiscount ? 'animate-bounce' : ''}`}
                  aria-live="polite"
                >
                  {isKorean ? '17% 할인 – 2개월 무료' : 'Save 17% – 2 Months Free'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white/5 rounded-2xl border-2 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 ${
                tier.popular
                  ? 'border-blue-500/40 ring-2 ring-blue-500/20'
                  : tier.recommended
                  ? 'border-purple-500/40 ring-2 ring-purple-500/20'
                  : 'border-white/10'
              } ${tier.popular || tier.recommended ? 'scale-[1.02]' : ''}`}
            >
              {/* Popular/Recommended Badge */}
              {(tier.popular || tier.recommended) && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white ${
                  tier.popular ? 'bg-blue-500' : 'bg-purple-500'
                }`}>
                  {tier.popular 
                    ? (isKorean ? '인기' : 'Most Popular')
                    : (isKorean ? '추천' : 'Recommended')
                  }
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isKorean ? tier.nameKo : tier.name}
                  </h3>
                  <p className="text-text-secondary">
                    {isKorean ? tier.descriptionKo : tier.description}
                  </p>
                  {tier.callout && (
                    <p className={`mt-3 text-sm font-medium ${
                      tier.popular ? 'text-blue-300' : tier.recommended ? 'text-purple-300' : 'text-white/80'
                    }`}>
                      {isKorean ? tier.calloutKo : tier.callout}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white transition-all duration-200">
                      {isKorean ? '₩' : '$'}{isKorean ? tier.priceKo : tier.price}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-text-secondary ml-1 transition-opacity duration-200">
                        /{isKorean ? tier.periodKo : tier.period}
                      </span>
                    )}
                  </div>
                  {tier.price === 0 && (
                    <p className="text-sm text-text-secondary mt-1">
                      {isKorean ? '영구 무료' : 'Forever Free'}
                    </p>
                  )}
                  {tier.id === 'premium' && (
                    <p className="text-sm text-text-secondary mt-2">
                      {isKorean ? '하루 약 ₩1,900' : 'Just $1.90/day'}
                    </p>
                  )}
                </div>

                {/* Features - grouped by category with colored icons */}
                <div className="space-y-5 mb-8">
                  {getGroupedFeatures(tier.id).map((group) => (
                    <div key={group.key}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base" aria-hidden>
                          {group.icon}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {isKorean ? group.labelKo : group.label}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {(isKorean ? group.itemsKo : group.items).map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${group.color}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        <span className="text-white/90">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  {tier.id === 'free' ? (
                    <>
                      <Link
                        to="/register"
                        className={`w-full inline-flex justify-center items-center px-6 py-3 rounded-xl font-semibold transition-colors ${
                          tier.popular
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : tier.recommended
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-white text-black hover:bg-gray-200'
                        }`}
                      >
                        {isKorean ? '무료로 시작하기' : 'Get Started Free'}
                      </Link>
                      <p className="text-xs text-text-secondary mt-2">
                        {isKorean ? '5,000명+ 학생이 지금 가입 — 신용카드 불필요' : 'Join 5,000+ students today – no credit card required'}
                      </p>
                    </>
                  ) : (
                    isAuthenticated ? (
                      <button
                        onClick={() => handleUpgrade(tier.id as 'basic' | 'premium' | 'enterprise')}
                        className={`w-full inline-flex justify-center items-center px-6 py-3 rounded-xl font-semibold transition-colors ${
                          tier.popular
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : tier.recommended
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-white text-black hover:bg-gray-200'
                        }`}
                      >
                        {isKorean ? '업그레이드' : 'Upgrade'}
                      </button>
                    ) : (
                      <Link
                        to="/register"
                        className={`w-full inline-flex justify-center items-center px-6 py-3 rounded-xl font-semibold transition-colors ${
                          tier.popular
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : tier.recommended
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-white text-black hover:bg-gray-200'
                        }`}
                      >
                        {isKorean ? '지금 시작하기' : 'Get Started'}
                      </Link>
                    )
                  )}
                  {tier.id === 'premium' && (
                    <p className="text-xs text-text-secondary mt-2">
                      {isKorean ? '94% 만족도 보장' : 'Backed by a 94% satisfaction rate'}
                    </p>
                  )}
                  {tier.id === 'enterprise' && (
                    <p className="text-xs text-text-secondary mt-2">
                      {isKorean ? '파트너십 팀과 전화 상담 예약' : 'Schedule a call with our partnerships team'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {isKorean ? '자주 묻는 질문' : 'Frequently Asked Questions'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-xl p-6 shadow-sm border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                {isKorean ? '환불 정책은 어떻게 되나요?' : 'What is your refund policy?'}
              </h3>
              <p className="text-text-secondary">
                {isKorean 
                  ? '구독은 월 단위로 청구됩니다. 결제 기간 중 언제든지 취소할 수 있으며, 다음 결제부터 적용됩니다.'
                  : 'Subscriptions are billed monthly. You can cancel anytime; cancellation takes effect on your next billing date.'
                }
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 shadow-sm border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                {isKorean ? '언제든지 취소할 수 있나요?' : 'Can I cancel anytime?'}
              </h3>
              <p className="text-text-secondary">
                {isKorean 
                  ? '네, 언제든지 구독을 취소할 수 있습니다. 취소 후에도 결제 기간이 끝날 때까지 서비스를 이용할 수 있습니다.'
                  : 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.'
                }
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 shadow-sm border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                {isKorean ? '환불 정책은 어떻게 되나요?' : 'What\'s your refund policy?'}
              </h3>
              <p className="text-text-secondary">
                {isKorean 
                  ? '첫 30일 이내에 만족하지 못하시면 전액 환불해드립니다. 추가 질문이 있으시면 언제든 연락해주세요.'
                  : 'We offer a 30-day money-back guarantee. If you\'re not satisfied within the first 30 days, we\'ll refund your payment in full.'
                }
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 shadow-sm border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                {isKorean ? '팀이나 학교를 위한 할인이 있나요?' : 'Do you offer team or school discounts?'}
              </h3>
              <p className="text-text-secondary">
                {isKorean 
                  ? '네, 5명 이상의 학생이나 교육기관을 위한 특별 할인을 제공합니다. 엔터프라이즈 플랜을 확인해보세요.'
                  : 'Yes, we offer special discounts for groups of 5+ students or educational institutions. Check out our Enterprise plan.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              {isKorean ? '지금 시작하고 꿈을 향해 나아가세요' : 'Start Your Journey Today'}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {isKorean 
                ? 'AdmitAI Korea와 함께 성공적인 미국 대학 입학을 준비하세요. 14일 무료 체험으로 시작해보세요.'
                : 'Prepare for successful U.S. university admission with AdmitAI Korea.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                {isKorean ? '무료로 시작하기' : 'Get Started Free'}
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                {isKorean ? '문의하기' : 'Contact Sales'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 