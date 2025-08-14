import React from 'react';
import PrivateSEO from '../components/seo/PrivateSEO';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  PlayIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  CalculatorIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import AccessibleButton from '../components/common/AccessibleButton';

const translations = {
  en: {
    // Hero Section
    hero: {
      title: "Evidence-based admissions optimizer",
      subtitle: "We analyze policy, capacity, and writing signals (KR/EN) to recommend high‑impact actions.",
      description: "Optimization, not guarantees. Analysis with verifiable sources and transparent methodology.",
      ctaPrimary: "Get Started",
      ctaSecondary: "View Methodology",
      stats: {
        students: "10,000+",
        studentsLabel: "Korean Students",
        acceptance: "85%",
        acceptanceLabel: "Acceptance Rate",
        universities: "500+",
        universitiesLabel: "Universities",
        aid: "$2M+",
        aidLabel: "Financial Aid Secured"
      }
    },

    // Features Section
    features: {
      title: "Everything You Need for U.S. University Applications",
      subtitle: "Comprehensive platform designed specifically for Korean students",
      items: [
        {
          icon: BuildingLibraryIcon,
          title: "University Research & Selection",
          description: "500+ universities with Korean student data, cultural fit analysis, and personalized recommendations",
          features: ["Korean student success rates", "Cultural fit scoring", "Admissions outlook intelligence", "Cost analysis"]
        },
        {
          icon: AcademicCapIcon,
          title: "Academic Profile Builder",
          description: "Korean GPA conversion, standardized test analysis, and activity management",
          features: ["GPA conversion calculator", "Test score analysis", "Activity tracking", "Strength assessment"]
        },
        {
          icon: DocumentTextIcon,
          title: "Application Management",
          description: "Complete application lifecycle with document management and deadline tracking",
          features: ["Multi-university tracking", "Document upload", "Progress checklists", "Deadline alerts"]
        },
        {
          icon: ChartBarIcon,
          title: "AI-Powered Essay Analysis",
          description: "Cultural storytelling coach with grammar checking and personalized feedback",
          features: ["Cultural narrative development", "Grammar checking", "Style analysis", "Peer review system"]
        },
        {
          icon: CalculatorIcon,
          title: "Financial Planning Hub",
          description: "FAFSA guidance, Korean student scholarships, and loan calculators",
          features: ["FAFSA application help", "Scholarship database", "Loan comparison", "Payment planning"]
        },
        {
          icon: ClockIcon,
          title: "Timeline & Tracking",
          description: "Real-time progress tracking with notifications and strategic planning",
          features: ["Application timeline", "Progress tracking", "Deadline management", "Decision tracking"]
        }
      ]
    },

    // Demo Section
    demo: {
      title: "See AdmitAI Korea in Action",
      subtitle: "Watch how our platform transforms the U.S. university application process",
      description: "From university research to acceptance celebration - see how Korean students succeed with our comprehensive platform.",
      videoTitle: "Complete Application Journey Demo",
      videoDescription: "3-minute overview of the entire platform"
    },

    // Testimonials
    testimonials: {
      title: "Success Stories from Korean Students",
      subtitle: "Real students, real results with AdmitAI Korea",
      items: [
        {
          name: "김민수 (Minsoo Kim)",
          university: "Stanford University",
          major: "Computer Science",
          quote: "AdmitAI Korea helped me understand exactly what Stanford was looking for. The cultural storytelling coach made my essays authentic and compelling.",
          rating: 5,
          aid: "$45,000"
        },
        {
          name: "박지영 (Jiyoung Park)",
          university: "Harvard University",
          major: "Economics",
          quote: "The admissions outlook gave me insights I couldn't find anywhere else. I felt like I had insider information!",
          rating: 5,
          aid: "$52,000"
        },
        {
          name: "이준호 (Junho Lee)",
          university: "MIT",
          major: "Mechanical Engineering",
          quote: "The financial planning tools helped me secure $40,000 in scholarships. The platform paid for itself many times over.",
          rating: 5,
          aid: "$40,000"
        }
      ]
    },

    // How It Works
    howItWorks: {
      title: "How AdmitAI Korea Works",
      subtitle: "Your complete application journey in 6 simple steps",
      steps: [
        {
          number: "01",
          title: "Research Universities",
          description: "Explore 500+ universities with Korean student data and cultural fit analysis"
        },
        {
          number: "02",
          title: "Build Your Profile",
          description: "Convert Korean GPA, track activities, and analyze your strengths"
        },
        {
          number: "03",
          title: "Create Applications",
          description: "Manage multiple applications with document tracking and checklists"
        },
        {
          number: "04",
          title: "Write Authentic Essays",
          description: "Use AI-powered cultural storytelling to create compelling narratives"
        },
        {
          number: "05",
          title: "Plan Your Finances",
          description: "Navigate FAFSA, find scholarships, and calculate loan options"
        },
        {
          number: "06",
          title: "Track & Celebrate",
          description: "Monitor progress, receive decisions, and celebrate your acceptance"
        }
      ]
    },

    // Pricing
    pricing: {
      title: "Choose Your Plan",
      subtitle: "Start free, upgrade when you're ready",
      plans: [
        {
          name: "Free",
          price: "$0",
          period: "forever",
          description: "Perfect for getting started",
          features: [
            "University research (limited)",
            "Basic academic profile",
            "1 essay analysis per month",
            "Application timeline",
            "Basic financial calculator"
          ],
          cta: "Get Started Free",
          popular: false
        },
        {
          name: "Premium",
          price: "$29",
          period: "per month",
          description: "Complete platform access",
          features: [
            "Unlimited university research",
            "Complete academic profile builder",
            "Unlimited essay analysis",
            "Cultural storytelling coach",
            "Application tracking",
            "Financial aid optimization",
            "Interview preparation",
            "Parent dashboard access"
          ],
          cta: "Start Premium Trial",
          popular: true
        },
        {
          name: "Institution",
          price: "$99",
          period: "per month",
          description: "For hagwons and schools",
          features: [
            "All premium features",
            "Multiple student accounts",
            "Progress analytics",
            "Custom branding",
            "Priority support",
            "API access"
          ],
          cta: "Contact Sales",
          popular: false
        }
      ]
    },

    // CTA Section
    cta: {
      title: "Ready to Transform Your U.S. University Application?",
      subtitle: "Join thousands of Korean students who have already succeeded with AdmitAI Korea",
      description: "Start your journey today with our comprehensive platform designed specifically for Korean students.",
      ctaPrimary: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    }
  },
  ko: {
    // Hero Section
    hero: {
      title: "증거 기반 입학 전략 최적화",
      subtitle: "정책·수용력·작성 신호(KR/EN)를 분석해 바로 실행할 고임팩트 행동을 추천합니다.",
      description: "보장은 아닌 최적화입니다. 검증 가능한 출처와 투명한 방법론으로 분석합니다.",
      ctaPrimary: "여정 시작하기",
      ctaSecondary: "방법론 보기",
      stats: {
        students: "10,000+",
        studentsLabel: "한국 학생",
        acceptance: "85%",
        acceptanceLabel: "합격률",
        universities: "500+",
        universitiesLabel: "대학",
        aid: "$2M+",
        aidLabel: "확보된 장학금"
      }
    },

    // Features Section
    features: {
      title: "미국 대학 지원에 필요한 모든 것",
      subtitle: "한국 학생을 위해 특별히 설계된 포괄적인 플랫폼",
      items: [
        {
          icon: BuildingLibraryIcon,
          title: "대학 조사 및 선택",
          description: "한국 학생 데이터, 문화적 적합성 분석, 맞춤형 추천이 포함된 500개 이상의 대학",
          features: ["한국 학생 성공률", "문화적 적합성 점수", "날씨 시스템 인텔리전스", "비용 분석"]
        },
        {
          icon: AcademicCapIcon,
          title: "학업 프로필 빌더",
          description: "한국 GPA 변환, 표준화 시험 분석, 활동 관리",
          features: ["GPA 변환 계산기", "시험 점수 분석", "활동 추적", "강점 평가"]
        },
        {
          icon: DocumentTextIcon,
          title: "지원서 관리",
          description: "문서 관리 및 마감일 추적이 포함된 완전한 지원서 생명주기",
          features: ["다중 대학 추적", "문서 업로드", "진행 체크리스트", "마감일 알림"]
        },
        {
          icon: ChartBarIcon,
          title: "AI 기반 에세이 분석",
          description: "문법 검사 및 맞춤형 피드백이 포함된 문화적 스토리텔링 코치",
          features: ["문화적 내러티브 개발", "문법 검사", "스타일 분석", "동료 검토 시스템"]
        },
        {
          icon: CalculatorIcon,
          title: "재정 계획 허브",
          description: "FAFSA 가이드, 한국 학생 장학금, 대출 계산기",
          features: ["FAFSA 신청 도움", "장학금 데이터베이스", "대출 비교", "결제 계획"]
        },
        {
          icon: ClockIcon,
          title: "타임라인 및 추적",
          description: "알림 및 전략적 계획이 포함된 실시간 진행 추적",
          features: ["지원서 타임라인", "진행 추적", "마감일 관리", "결과 추적"]
        }
      ]
    },

    // Demo Section
    demo: {
      title: "AdmitAI Korea 실제 작동 모습",
      subtitle: "우리 플랫폼이 미국 대학 지원 과정을 어떻게 변화시키는지 확인하세요",
      description: "대학 조사부터 합격 축하까지 - 한국 학생들이 우리 포괄적인 플랫폼으로 어떻게 성공하는지 확인하세요.",
      videoTitle: "완전한 지원 과정 데모",
      videoDescription: "전체 플랫폼의 3분 개요"
    },

    // Testimonials
    testimonials: {
      title: "한국 학생들의 성공 스토리",
      subtitle: "AdmitAI Korea와 함께한 실제 학생들, 실제 결과",
      items: [
        {
          name: "김민수 (Minsoo Kim)",
          university: "Stanford University",
          major: "Computer Science",
          quote: "AdmitAI Korea가 스탠포드가 찾는 것이 정확히 무엇인지 이해하는 데 도움이 되었습니다. 문화적 스토리텔링 코치가 제 에세이를 진정성 있고 매력적으로 만들었습니다.",
          rating: 5,
          aid: "$45,000"
        },
        {
          name: "박지영 (Jiyoung Park)",
          university: "Harvard University",
          major: "Economics",
          quote: "대학 날씨 시스템이 다른 곳에서는 찾을 수 없는 인사이트를 제공했습니다. 내부자 정보를 가지고 있는 것 같았습니다!",
          rating: 5,
          aid: "$52,000"
        },
        {
          name: "이준호 (Junho Lee)",
          university: "MIT",
          major: "Mechanical Engineering",
          quote: "재정 계획 도구가 $40,000 장학금 확보에 도움이 되었습니다. 플랫폼이 자체 비용을 여러 번 상회했습니다.",
          rating: 5,
          aid: "$40,000"
        }
      ]
    },

    // How It Works
    howItWorks: {
      title: "AdmitAI Korea 작동 방식",
      subtitle: "6단계로 완성되는 완전한 지원 과정",
      steps: [
        {
          number: "01",
          title: "대학 조사",
          description: "한국 학생 데이터와 문화적 적합성 분석이 포함된 500개 이상의 대학 탐색"
        },
        {
          number: "02",
          title: "프로필 구축",
          description: "한국 GPA 변환, 활동 추적, 강점 분석"
        },
        {
          number: "03",
          title: "지원서 작성",
          description: "문서 추적 및 체크리스트가 포함된 다중 지원서 관리"
        },
        {
          number: "04",
          title: "진정성 있는 에세이 작성",
          description: "AI 기반 문화적 스토리텔링을 사용하여 매력적인 내러티브 생성"
        },
        {
          number: "05",
          title: "재정 계획",
          description: "FAFSA 탐색, 장학금 찾기, 대출 옵션 계산"
        },
        {
          number: "06",
          title: "추적 및 축하",
          description: "진행 상황 모니터링, 결과 수신, 합격 축하"
        }
      ]
    },

    // Pricing
    pricing: {
      title: "플랜 선택",
      subtitle: "무료로 시작하고 준비되면 업그레이드",
      plans: [
        {
          name: "무료",
          price: "$0",
          period: "영구",
          description: "시작하기에 완벽",
          features: [
            "대학 조사 (제한적)",
            "기본 학업 프로필",
            "월 1회 에세이 분석",
            "지원서 타임라인",
            "기본 재정 계산기"
          ],
          cta: "무료로 시작",
          popular: false
        },
        {
          name: "프리미엄",
          price: "$29",
          period: "월",
          description: "완전한 플랫폼 접근",
          features: [
            "무제한 대학 조사",
            "완전한 학업 프로필 빌더",
            "무제한 에세이 분석",
            "문화적 스토리텔링 코치",
            "지원서 추적",
            "재정 지원 최적화",
            "면접 준비",
            "부모 대시보드 접근"
          ],
          cta: "프리미엄 체험 시작",
          popular: true
        },
        {
          name: "기관",
          price: "$99",
          period: "월",
          description: "학원 및 학교용",
          features: [
            "모든 프리미엄 기능",
            "다중 학생 계정",
            "진행 분석",
            "맞춤 브랜딩",
            "우선 지원",
            "API 접근"
          ],
          cta: "영업팀 문의",
          popular: false
        }
      ]
    },

    // CTA Section
    cta: {
      title: "미국 대학 지원을 변화시킬 준비가 되셨나요?",
      subtitle: "이미 AdmitAI Korea로 성공한 수천 명의 한국 학생들과 함께하세요",
      description: "한국 학생을 위해 특별히 설계된 포괄적인 플랫폼으로 오늘 여정을 시작하세요.",
      ctaPrimary: "무료 체험 시작",
      ctaSecondary: "데모 예약"
    }
  }
};

const LandingPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language as keyof typeof translations] || translations.en;

  // Demo video state removed (unused)
  // const [activeTestimonial, setActiveTestimonial] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveTestimonial((prev) => (prev + 1) % t.testimonials.items.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [t.testimonials.items.length]);

  const handleVideoPlay = () => {
    // In a real implementation, this would open a video modal or navigate to video page
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Legacy landing: keep out of index */}
      <PrivateSEO title={language === 'ko' ? '레거시 랜딩' : 'Legacy Landing'} language={language as 'ko' | 'en'} />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 via-white to-blue-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {t.hero.title}
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 font-medium">
                  {t.hero.subtitle}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t.hero.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <AccessibleButton
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </AccessibleButton>
                <AccessibleButton
                  onClick={handleVideoPlay}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>{t.hero.ctaSecondary}</span>
                </AccessibleButton>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{t.hero.stats.students}</div>
                  <div className="text-sm text-gray-600">{t.hero.stats.studentsLabel}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{t.hero.stats.acceptance}</div>
                  <div className="text-sm text-gray-600">{t.hero.stats.acceptanceLabel}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{t.hero.stats.universities}</div>
                  <div className="text-sm text-gray-600">{t.hero.stats.universitiesLabel}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{t.hero.stats.aid}</div>
                  <div className="text-sm text-gray-600">{t.hero.stats.aidLabel}</div>
                </div>
              </div>
            </div>

            {/* Right Column - Video Demo */}
            <div className="relative">
              <div className="bg-gradient-to-br from-red-100 to-blue-100 rounded-2xl p-8 shadow-2xl">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                  {/* Video Placeholder - Replace with actual video */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PlayIcon className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{t.demo.videoTitle}</h3>
                      <p className="text-gray-300">{t.demo.videoDescription}</p>
                    </div>
                  </div>
                  
                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-all duration-300 cursor-pointer flex items-center justify-center">
                    <AccessibleButton
                      onClick={handleVideoPlay}
                      className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <PlayIcon className="w-8 h-8 text-white" />
                    </AccessibleButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {t.demo.title}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {t.demo.subtitle}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                {t.demo.description}
              </p>
              
              {/* Demo Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">Complete application journey walkthrough</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">Korean cultural integration showcase</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">AI-powered features demonstration</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                  {/* Interactive Demo Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <PlayIcon className="w-12 h-12" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Interactive Demo</h3>
                      <p className="text-gray-300 mb-4">Experience the platform firsthand</p>
                      <AccessibleButton
                        onClick={handleVideoPlay}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Launch Demo
                      </AccessibleButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t.testimonials.title}
            </h2>
            <p className="text-xl text-gray-600">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.university}</div>
                  <div className="text-sm text-gray-600">{testimonial.major}</div>
                  <div className="text-sm font-semibold text-green-600 mt-2">
                    Secured {testimonial.aid} in aid
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t.howItWorks.title}
            </h2>
            <p className="text-xl text-gray-600">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.howItWorks.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-xl text-gray-600">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.pricing.plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl p-8 shadow-lg ${
                plan.popular ? 'ring-2 ring-red-500 relative' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <AccessibleButton
                  onClick={() => navigate('/register')}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </AccessibleButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t.cta.title}
          </h2>
          <p className="text-xl text-red-100 mb-8">
            {t.cta.subtitle}
          </p>
          <p className="text-lg text-red-100 mb-12">
            {t.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AccessibleButton
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t.cta.ctaPrimary}
            </AccessibleButton>
            <AccessibleButton
              onClick={handleVideoPlay}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors"
            >
              {t.cta.ctaSecondary}
            </AccessibleButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 