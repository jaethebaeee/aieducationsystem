import React from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  AcademicCapIcon, 
  GlobeAltIcon, 
  UserGroupIcon, 
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const translations = {
  en: {
    title: 'Welcome to AdmitAI Korea',
    subtitle: 'Your AI-powered journey to US university success starts here',
    description: 'We\'re excited to help you navigate the complex world of US college admissions with our innovative AI technology and cultural expertise.',
    
    // Features
    features: [
      {
        icon: AcademicCapIcon,
  title: 'Admissions Outlook System',
        description: 'Real-time insights into what each university is looking for this year'
      },
      {
        icon: GlobeAltIcon,
        title: 'Cultural Storytelling Coach',
        description: 'Transform your Korean background into compelling narratives'
      },
      {
        icon: UserGroupIcon,
        title: 'Personalized Roadmap',
        description: 'Step-by-step guidance tailored to your goals and timeline'
      },
      {
        icon: SparklesIcon,
        title: 'AI-Powered Analysis',
        description: 'Advanced essay feedback and application optimization'
      }
    ],

    // Process
    process: {
      title: 'Your 5-Minute Setup Journey',
      steps: [
        {
          number: '01',
          title: 'Set Your Goals',
          description: 'Tell us about your dream universities and career aspirations'
        },
        {
          number: '02',
          title: 'Choose Your Universities',
          description: 'Select from our curated list of Korean-friendly US universities'
        },
        {
          number: '03',
          title: 'Complete Your Profile',
          description: 'Share your academic background and achievements'
        },
        {
          number: '04',
          title: 'Get Your Roadmap',
          description: 'Receive your personalized application strategy'
        }
      ]
    },

    // Benefits
    benefits: [
      '95% accuracy in university recommendations',
      'Cultural context awareness for Korean students',
      'Real-time admissions trend analysis',
      '24/7 AI mentor support',
      'Parent dashboard for family involvement',
      'Community of Korean students'
    ],

    // CTA
    cta: {
      primary: 'Start My Journey',
      secondary: 'Learn More About Our Approach',
      timeEstimate: 'Takes only 5 minutes'
    },

    // Trust indicators
    trust: {
      title: 'Trusted by Korean Students Worldwide',
      stats: [
        { number: '2,500+', label: 'Students Helped' },
        { number: '95%', label: 'Success Rate' },
        { number: '150+', label: 'Universities' },
        { number: '24/7', label: 'AI Support' }
      ]
    }
  },
  ko: {
    title: 'AdmitAI Korea에 오신 것을 환영합니다',
    subtitle: '미국 대학 성공을 위한 AI 기반 여정이 여기서 시작됩니다',
    description: '혁신적인 AI 기술과 문화적 전문성을 통해 복잡한 미국 대학 입학 과정을 안내해드릴 수 있어 기쁩니다.',
    
    features: [
      {
        icon: AcademicCapIcon,
        title: '대학 날씨 시스템',
        description: '각 대학이 올해 찾고 있는 것에 대한 실시간 인사이트'
      },
      {
        icon: GlobeAltIcon,
        title: '문화적 스토리텔링 코치',
        description: '한국적 배경을 매력적인 내러티브로 변환'
      },
      {
        icon: UserGroupIcon,
        title: '개인화 로드맵',
        description: '목표와 일정에 맞춘 단계별 가이드'
      },
      {
        icon: SparklesIcon,
        title: 'AI 기반 분석',
        description: '고급 에세이 피드백 및 지원서 최적화'
      }
    ],

    process: {
      title: '5분 설정 여정',
      steps: [
        {
          number: '01',
          title: '목표 설정',
          description: '꿈의 대학과 진로 포부에 대해 알려주세요'
        },
        {
          number: '02',
          title: '대학 선택',
          description: '한국 학생 친화적인 미국 대학 목록에서 선택'
        },
        {
          number: '03',
          title: '프로필 완성',
          description: '학업 배경과 성과를 공유해주세요'
        },
        {
          number: '04',
          title: '로드맵 받기',
          description: '개인화된 지원 전략을 받아보세요'
        }
      ]
    },

    benefits: [
      '대학 추천 95% 정확도',
      '한국 학생을 위한 문화적 맥락 인식',
      '실시간 입학 트렌드 분석',
      '24/7 AI 멘토 지원',
      '가족 참여를 위한 학부모 대시보드',
      '한국 학생 커뮤니티'
    ],

    cta: {
      primary: '내 여정 시작하기',
      secondary: '우리의 접근 방식 알아보기',
      timeEstimate: '5분만에 완료'
    },

    trust: {
      title: '전 세계 한국 학생들이 신뢰하는 서비스',
      stats: [
        { number: '2,500+', label: '도움받은 학생' },
        { number: '95%', label: '성공률' },
        { number: '150+', label: '대학' },
        { number: '24/7', label: 'AI 지원' }
      ]
    }
  }
};

type Lang = keyof typeof translations;

const WelcomePage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[(language as Lang)] || translations.en;

  const handleStartJourney = () => {
    navigate('/onboarding/goals');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PrivateSEO title={t.title} language={language as 'ko' | 'en'} />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">AdmitAI Korea</span>
                <div className="text-xs text-gray-500">AI-Powered Admissions</div>
              </div>
            </div>
            <Button to="/dashboard" variant="ghost">{language === 'ko' ? '나중에 하기' : 'Skip for now'}</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <SparklesIcon className="w-4 h-4 mr-2" />
              {language === 'ko' ? 'AI 기반 입학 준비' : 'AI-Powered Admissions'}
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
            <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" variant="primary" onClick={handleStartJourney}>{t.cta.primary}</Button>
            <Button size="lg" variant="outline" to="/about">{t.cta.secondary}</Button>
          </div>
          <p className="text-sm text-gray-500">
            {t.cta.timeEstimate}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {language === 'ko' ? '왜 AdmitAI Korea인가요?' : 'Why Choose AdmitAI Korea?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t.process.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.process.steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < t.process.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRightIcon className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {language === 'ko' ? 'AdmitAI Korea의 장점' : 'Benefits of AdmitAI Korea'}
          </h2>
          <Card padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t.trust.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.trust.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ko' ? '지금 시작하세요' : 'Ready to Get Started?'}
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              {language === 'ko' 
                ? '5분만에 개인화된 입학 로드맵을 받아보세요'
                : 'Get your personalized admissions roadmap in just 5 minutes'
              }
            </p>
            <Button size="lg" variant="primary" onClick={handleStartJourney}>{t.cta.primary}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 