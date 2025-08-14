import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import AccessibleButton from './AccessibleButton';

interface VideoDemoProps {
  isOpen: boolean;
  onClose: () => void;
  videoType: 'platform-overview' | 'university-research' | 'essay-analysis' | 'financial-planning';
}

interface DemoStep {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  duration: number; // seconds
  features: string[];
  featuresKo: string[];
}

const translations = {
  en: {
    close: 'Close',
    play: 'Play',
    pause: 'Pause',
    mute: 'Mute',
    unmute: 'Unmute',
    next: 'Next',
    previous: 'Previous',
    step: 'Step',
    of: 'of',
    skipIntro: 'Skip Intro',
    restart: 'Restart Demo'
  },
  ko: {
    close: '닫기',
    play: '재생',
    pause: '일시정지',
    mute: '음소거',
    unmute: '음소거 해제',
    next: '다음',
    previous: '이전',
    step: '단계',
    of: '/',
    skipIntro: '소개 건너뛰기',
    restart: '데모 다시 시작'
  }
};

const demoSteps: { [key: string]: DemoStep[] } = {
  'platform-overview': [
    {
      id: 'welcome',
      title: 'Welcome to AdmitAI Korea',
      titleKo: 'AdmitAI Korea에 오신 것을 환영합니다',
      description: 'The complete U.S. university application platform designed specifically for Korean students.',
      descriptionKo: '한국 학생을 위해 특별히 설계된 완전한 미국 대학 지원 플랫폼입니다.',
      duration: 5,
      features: ['Korean cultural integration', 'AI-powered insights', 'Comprehensive tracking'],
      featuresKo: ['한국 문화 통합', 'AI 기반 인사이트', '포괄적 추적']
    },
    {
      id: 'dashboard',
      title: 'Comprehensive Dashboard',
      titleKo: '포괄적인 대시보드',
      description: 'Track your entire application journey with real-time progress updates and personalized recommendations.',
      descriptionKo: '실시간 진행 업데이트와 맞춤형 추천으로 전체 지원 과정을 추적하세요.',
      duration: 8,
      features: ['Application progress', 'Financial aid summary', 'Upcoming deadlines', 'Quick actions'],
      featuresKo: ['지원서 진행률', '재정 지원 요약', '다가오는 마감일', '빠른 작업']
    },
    {
      id: 'university-research',
      title: 'University Research & Selection',
      titleKo: '대학 조사 및 선택',
  description: 'Explore 500+ universities with Korean student data, cultural fit analysis, and admissions outlook intelligence.',
      descriptionKo: '한국 학생 데이터, 문화적 적합성 분석, 날씨 시스템 인텔리전스가 포함된 500개 이상의 대학을 탐색하세요.',
      duration: 10,
  features: ['Korean student success rates', 'Cultural fit scoring', 'Admissions outlook', 'Cost comparison'],
      featuresKo: ['한국 학생 성공률', '문화적 적합성 점수', '날씨 분석', '비용 비교']
    },
    {
      id: 'academic-profile',
      title: 'Academic Profile Builder',
      titleKo: '학업 프로필 빌더',
      description: 'Convert Korean GPA, track standardized tests, and build a comprehensive academic profile.',
      descriptionKo: '한국 GPA를 변환하고, 표준화 시험을 추적하며, 포괄적인 학업 프로필을 구축하세요.',
      duration: 8,
      features: ['GPA conversion', 'Test score analysis', 'Activity tracking', 'Strength assessment'],
      featuresKo: ['GPA 변환', '시험 점수 분석', '활동 추적', '강점 평가']
    },
    {
      id: 'essay-analysis',
      title: 'AI-Powered Essay Analysis',
      titleKo: 'AI 기반 에세이 분석',
      description: 'Get cultural storytelling guidance, grammar checking, and personalized feedback for your essays.',
      descriptionKo: '에세이에 대한 문화적 스토리텔링 가이드, 문법 검사, 맞춤형 피드백을 받으세요.',
      duration: 12,
      features: ['Cultural storytelling', 'Grammar checking', 'Style analysis', 'Peer review'],
      featuresKo: ['문화적 스토리텔링', '문법 검사', '스타일 분석', '동료 검토']
    },
    {
      id: 'financial-planning',
      title: 'Financial Planning Hub',
      titleKo: '재정 계획 허브',
      description: 'Navigate FAFSA, find Korean student scholarships, and plan your financial aid strategy.',
      descriptionKo: 'FAFSA를 탐색하고, 한국 학생 장학금을 찾으며, 재정 지원 전략을 계획하세요.',
      duration: 10,
      features: ['FAFSA guidance', 'Scholarship database', 'Loan comparison', 'Payment planning'],
      featuresKo: ['FAFSA 가이드', '장학금 데이터베이스', '대출 비교', '결제 계획']
    }
  ],
  'university-research': [
    {
      id: 'search',
      title: 'Advanced University Search',
      titleKo: '고급 대학 검색',
      description: 'Filter universities by location, cost, acceptance rate, and Korean student success.',
      descriptionKo: '위치, 비용, 합격률, 한국 학생 성공률로 대학을 필터링하세요.',
      duration: 6,
      features: ['Location filtering', 'Cost analysis', 'Acceptance rates', 'Korean student data'],
      featuresKo: ['위치 필터링', '비용 분석', '합격률', '한국 학생 데이터']
    },
    {
  id: 'outlook',
  title: 'Admissions Outlook',
      titleKo: '대학 날씨 시스템',
      description: 'Get real-time admissions intelligence and strategic insights for each university.',
      descriptionKo: '각 대학에 대한 실시간 입학 인텔리전스와 전략적 인사이트를 얻으세요.',
      duration: 8,
      features: ['Admissions trends', 'Cultural preferences', 'Opportunities', 'Risk factors'],
      featuresKo: ['입학 트렌드', '문화적 선호도', '기회', '위험 요소']
    },
    {
      id: 'comparison',
      title: 'University Comparison',
      titleKo: '대학 비교',
      description: 'Compare multiple universities side-by-side with detailed analysis.',
      descriptionKo: '상세한 분석과 함께 여러 대학을 나란히 비교하세요.',
      duration: 7,
      features: ['Side-by-side comparison', 'Cost analysis', 'Success rates', 'Cultural fit'],
      featuresKo: ['나란한 비교', '비용 분석', '성공률', '문화적 적합성']
    }
  ],
  'essay-analysis': [
    {
      id: 'upload',
      title: 'Essay Upload & Analysis',
      titleKo: '에세이 업로드 및 분석',
      description: 'Upload your essay and get comprehensive AI-powered analysis and feedback.',
      descriptionKo: '에세이를 업로드하고 포괄적인 AI 기반 분석과 피드백을 받으세요.',
      duration: 6,
      features: ['Drag & drop upload', 'Instant analysis', 'Grammar checking', 'Style feedback'],
      featuresKo: ['드래그 앤 드롭 업로드', '즉시 분석', '문법 검사', '스타일 피드백']
    },
    {
      id: 'cultural',
      title: 'Cultural Storytelling Coach',
      titleKo: '문화적 스토리텔링 코치',
      description: 'Develop authentic cultural narratives that resonate with U.S. admissions officers.',
      descriptionKo: '미국 입학 담당자와 공감하는 진정성 있는 문화적 내러티브를 개발하세요.',
      duration: 10,
      features: ['Cultural prompts', 'Narrative development', 'Authenticity check', 'Cultural context'],
      featuresKo: ['문화적 프롬프트', '내러티브 개발', '진정성 확인', '문화적 맥락']
    },
    {
      id: 'feedback',
      title: 'Comprehensive Feedback',
      titleKo: '포괄적인 피드백',
      description: 'Receive detailed feedback on grammar, style, content, and cultural elements.',
      descriptionKo: '문법, 스타일, 내용, 문화적 요소에 대한 상세한 피드백을 받으세요.',
      duration: 8,
      features: ['Grammar analysis', 'Style suggestions', 'Content improvement', 'Cultural insights'],
      featuresKo: ['문법 분석', '스타일 제안', '내용 개선', '문화적 인사이트']
    }
  ],
  'financial-planning': [
    {
      id: 'fafsa',
      title: 'FAFSA Application Guide',
      titleKo: 'FAFSA 신청 가이드',
      description: 'Step-by-step guidance through the FAFSA application process.',
      descriptionKo: 'FAFSA 신청 과정을 단계별로 안내합니다.',
      duration: 8,
      features: ['Step-by-step guidance', 'Document checklist', 'Common mistakes', 'Tips for Korean students'],
      featuresKo: ['단계별 안내', '문서 체크리스트', '일반적인 실수', '한국 학생을 위한 팁']
    },
    {
      id: 'scholarships',
      title: 'Korean Student Scholarships',
      titleKo: '한국 학생 장학금',
      description: 'Comprehensive database of scholarships specifically for Korean students.',
      descriptionKo: '한국 학생을 위해 특별히 설계된 포괄적인 장학금 데이터베이스.',
      duration: 7,
      features: ['Korean-specific scholarships', 'Application guidance', 'Success rates', 'Deadline tracking'],
      featuresKo: ['한국 특화 장학금', '신청 안내', '성공률', '마감일 추적']
    },
    {
      id: 'loans',
      title: 'Loan Comparison & Planning',
      titleKo: '대출 비교 및 계획',
      description: 'Compare loan options and plan your repayment strategy.',
      descriptionKo: '대출 옵션을 비교하고 상환 전략을 계획하세요.',
      duration: 6,
      features: ['Loan comparison', 'Repayment calculators', 'Interest analysis', 'Payment planning'],
      featuresKo: ['대출 비교', '상환 계산기', '이자 분석', '결제 계획']
    }
  ]
};

const VideoDemo: React.FC<VideoDemoProps> = ({ isOpen, onClose, videoType }) => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  
  const steps = demoSteps[videoType] || demoSteps['platform-overview'];
  const currentStepData = steps[currentStep];

  const handlePlay = () => {
    setIsPlaying(true);
    startProgress();
  };

  const handlePause = () => {
    setIsPlaying(false);
    stopProgress();
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
      setIsPlaying(false);
      stopProgress();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
      setIsPlaying(false);
      stopProgress();
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
    stopProgress();
  };

  const startProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (currentStepData.duration * 10));
        if (newProgress >= 100) {
          if (currentStep < steps.length - 1) {
            handleNext();
          } else {
            setIsPlaying(false);
            stopProgress();
          }
          return 0;
        }
        return newProgress;
      });
    }, 100);
  };

  const stopProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const handleClose = () => {
    stopProgress();
    setIsPlaying(false);
    setProgress(0);
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'ko' ? currentStepData.titleKo : currentStepData.title}
            </h2>
            <p className="text-sm text-gray-600">
              {t.step} {currentStep + 1} {t.of} {steps.length}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <AccessibleButton
              onClick={handleRestart}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              {t.restart}
            </AccessibleButton>
            <AccessibleButton
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </AccessibleButton>
          </div>
        </div>

        {/* Video Content */}
        <div className="relative bg-gray-900 aspect-video">
          {/* Demo Content Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
                {isPlaying ? (
                  <PauseIcon className="w-16 h-16" />
                ) : (
                  <PlayIcon className="w-16 h-16" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {language === 'ko' ? currentStepData.titleKo : currentStepData.title}
              </h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {language === 'ko' ? currentStepData.descriptionKo : currentStepData.description}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <AccessibleButton
                onClick={isPlaying ? handlePause : handlePlay}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="w-5 h-5" />
                    <span>{t.pause}</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5" />
                    <span>{t.play}</span>
                  </>
                )}
              </AccessibleButton>
              
              <AccessibleButton
                onClick={handleMute}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="w-5 h-5" />
                ) : (
                  <SpeakerWaveIcon className="w-5 h-5" />
                )}
              </AccessibleButton>
            </div>

            <div className="flex items-center space-x-2">
              <AccessibleButton
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </AccessibleButton>
              <AccessibleButton
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRightIcon className="w-5 h-5" />
              </AccessibleButton>
            </div>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(language === 'ko' ? currentStepData.featuresKo : currentStepData.features).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDemo; 