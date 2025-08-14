import React, { useState, useEffect, useMemo } from 'react';
import PrivateSEO from '../components/seo/PrivateSEO';
import RagInsightsPanel from '../components/RagInsightsPanel';
import RequireSubscription from '../components/auth/RequireSubscription';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  CloudIcon,
  SunIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface AdmissionsCondition {
  type: 'favorable' | 'moderate' | 'challenging' | 'difficult' | 'critical';
  label: string;
  labelKo: string;
  description: string;
  descriptionKo: string;
  color: string;
  icon: React.ComponentType<any>;
}

interface UniversityPulse {
  id: string;
  name: string;
  nameKo: string;
  condition: AdmissionsCondition;
  acceptanceRate: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  culturalFit: number;
  academicFit: number;
  financialFit: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  insights: string[];
  insightsKo: string[];
  recommendations: string[];
  recommendationsKo: string[];
  recentUpdates: string[];
  recentUpdatesKo: string[];
  koreanStudentAdvantage: string[];
  koreanStudentAdvantageKo: string[];
}

const AdmissionsPulsePage: React.FC = () => {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [hidePersonalizationBar, setHidePersonalizationBar] = useState<boolean>(() => {
    try {
      return localStorage.getItem('uni_personalization_bar_hidden') === '1';
    } catch {
      return false;
    }
  });
  const language = i18n.language;
  const isKorean = language === 'ko';
  const [universities, setUniversities] = useState<UniversityPulse[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<UniversityPulse[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityPulse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [activeQuickFilter, setActiveQuickFilter] = useState<null | 'ivy' | 'odds' | 'aid'>(null);
  const [sortMode, setSortMode] = useState<'fit' | 'odds' | 'aid'>('fit');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recentAdmissions] = useState([
    { name: '김민수', school: 'Stanford', date: '2 hours ago' },
    { name: 'Sarah Lee', school: 'Harvard', date: '4 hours ago' },
    { name: '박지영', school: 'MIT', date: '6 hours ago' },
    { name: 'Alex Kim', school: 'Yale', date: '1 day ago' },
    { name: '이준호', school: 'Columbia', date: '1 day ago' }
  ]);

  const admissionsConditions: AdmissionsCondition[] = useMemo(() => [
    {
      type: 'favorable',
      label: 'Favorable',
      labelKo: '유리함',
      description: 'Excellent conditions for Korean students',
      descriptionKo: '한국 학생들에게 매우 유리한 조건',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: SunIcon
    },
    {
      type: 'moderate',
      label: 'Moderate',
      labelKo: '보통',
      description: 'Moderate conditions for Korean students',
      descriptionKo: '한국 학생들에게 보통의 조건',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: CloudIcon
    },
    {
      type: 'challenging',
      label: 'Challenging',
      labelKo: '도전적',
      description: 'Challenging but achievable for Korean students',
      descriptionKo: '한국 학생들에게 도전적이지만 달성 가능한 조건',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: CloudIcon // Changed from BoltIcon to CloudIcon
    },
    {
      type: 'difficult',
      label: 'Difficult',
      labelKo: '어려움',
      description: 'Very difficult conditions for Korean students',
      descriptionKo: '한국 학생들에게 매우 어려운 조건',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: ExclamationTriangleIcon
    },
    {
      type: 'critical',
      label: 'Critical Changes',
      labelKo: '중요 변화',
      description: 'Critical policy changes affecting Korean students',
      descriptionKo: '한국 학생들에게 영향을 주는 중요한 정책 변화',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: ExclamationTriangleIcon
    }
  ], []);

  // Mock data - replace with API call
  useEffect(() => {
    const mockUniversities: UniversityPulse[] = [
      {
        id: '1',
        name: 'Stanford University',
        nameKo: '스탠포드 대학교',
        condition: admissionsConditions[0], // favorable
        acceptanceRate: 4.3,
        trend: 'decreasing',
        trendPercentage: -2.1,
        culturalFit: 85,
        academicFit: 92,
        financialFit: 78,
        deadline: '2024-12-01',
        priority: 'high',
        insights: [
          'Increased focus on interdisciplinary research and innovation',
          'Strong preference for students with entrepreneurial mindset',
          'Growing emphasis on sustainability and social impact',
          'Korean students with STEM backgrounds highly valued'
        ],
        insightsKo: [
          '학제간 연구와 혁신에 대한 관심 증가',
          '기업가 정신을 가진 학생들에 대한 강한 선호',
          '지속가능성과 사회적 영향에 대한 강조 증가',
          'STEM 배경을 가진 한국 학생들에 대한 높은 평가'
        ],
        recommendations: [
          'Highlight any startup or innovation projects in your essays',
          'Emphasize cross-cultural leadership experiences',
          'Include sustainability initiatives in your application',
          'Showcase your technical skills and problem-solving abilities'
        ],
        recommendationsKo: [
          '에세이에서 스타트업이나 혁신 프로젝트를 강조하세요',
          '문화간 리더십 경험을 강조하세요',
          '지원서에 지속가능성 이니셔티브를 포함하세요',
          '기술적 능력과 문제 해결 능력을 보여주세요'
        ],
        recentUpdates: [
          'New emphasis on AI/ML research opportunities',
          'Increased financial aid for international students',
          'Updated essay prompts for 2024-25 cycle'
        ],
        recentUpdatesKo: [
          'AI/ML 연구 기회에 대한 새로운 강조',
          '국제학생에 대한 재정 지원 증가',
          '2024-25 지원 시즌 에세이 주제 업데이트'
        ],
        koreanStudentAdvantage: [
          'Strong STEM education background',
          'Cultural diversity and global perspective',
          'High academic standards and work ethic'
        ],
        koreanStudentAdvantageKo: [
          '강력한 STEM 교육 배경',
          '문화적 다양성과 세계적 관점',
          '높은 학업 기준과 근면성'
        ]
      },
      {
        id: '2',
        name: 'Harvard University',
        nameKo: '하버드 대학교',
        condition: admissionsConditions[1], // moderate
        acceptanceRate: 4.6,
        trend: 'stable',
        trendPercentage: 0.5,
        culturalFit: 78,
        academicFit: 88,
        financialFit: 82,
        deadline: '2024-11-01',
        priority: 'high',
        insights: [
          'Maintaining traditional academic excellence standards',
          'Increased focus on global citizenship and leadership',
          'Strong emphasis on research and intellectual curiosity',
          'Korean students with humanities backgrounds welcome'
        ],
        insightsKo: [
          '전통적인 학술 우수성 기준 유지',
          '세계시민의식과 리더십에 대한 관심 증가',
          '연구와 지적 호기심에 대한 강한 강조',
          '인문학 배경을 가진 한국 학생들 환영'
        ],
        recommendations: [
          'Demonstrate intellectual curiosity through research projects',
          'Show global perspective and cultural awareness',
          'Emphasize academic achievements and leadership roles',
          'Connect your Korean background to global issues'
        ],
        recommendationsKo: [
          '연구 프로젝트를 통해 지적 호기심을 보여주세요',
          '세계적 관점과 문화적 인식을 보여주세요',
          '학업 성취와 리더십 역할을 강조하세요',
          '한국적 배경을 세계적 이슈와 연결하세요'
        ],
        recentUpdates: [
          'New interdisciplinary research initiatives',
          'Enhanced financial aid for middle-income families',
          'Updated interview process for 2024-25'
        ],
        recentUpdatesKo: [
          '새로운 학제간 연구 이니셔티브',
          '중간 소득층 가족을 위한 재정 지원 강화',
          '2024-25 인터뷰 과정 업데이트'
        ],
        koreanStudentAdvantage: [
          'Strong academic foundation and discipline',
          'Cultural heritage and storytelling ability',
          'Global perspective from Korean education'
        ],
        koreanStudentAdvantageKo: [
          '강력한 학업 기반과 규율',
          '문화적 유산과 스토리텔링 능력',
          '한국 교육에서 나오는 세계적 관점'
        ]
      },
      {
        id: '3',
        name: 'MIT',
        nameKo: '매사추세츠 공과대학',
        condition: admissionsConditions[2], // challenging
        acceptanceRate: 6.7,
        trend: 'increasing',
        trendPercentage: 1.2,
        culturalFit: 72,
        academicFit: 95,
        financialFit: 85,
        deadline: '2024-11-01',
        priority: 'medium',
        insights: [
          'Highly competitive STEM admissions with global competition',
          'Strong preference for demonstrated technical skills',
          'Growing emphasis on interdisciplinary engineering',
          'Korean students need to showcase unique technical projects'
        ],
        insightsKo: [
          '전 세계적 경쟁이 있는 매우 경쟁적인 STEM 분야 입학',
          '입증된 기술적 능력에 대한 강한 선호',
          '학제간 공학에 대한 강조 증가',
          '한국 학생들은 고유한 기술 프로젝트를 보여줘야 함'
        ],
        recommendations: [
          'Showcase technical projects with real-world impact',
          'Demonstrate problem-solving abilities through examples',
          'Include interdisciplinary project experiences',
          'Highlight innovation and creativity in technical work'
        ],
        recommendationsKo: [
          '실제 영향이 있는 기술 프로젝트를 보여주세요',
          '예시를 통해 문제 해결 능력을 보여주세요',
          '학제간 프로젝트 경험을 포함하세요',
          '기술적 작업에서 혁신과 창의성을 강조하세요'
        ],
        recentUpdates: [
          'New AI and robotics research opportunities',
          'Increased emphasis on hands-on project experience',
          'Updated portfolio requirements for 2024-25'
        ],
        recentUpdatesKo: [
          '새로운 AI와 로봇공학 연구 기회',
          '실습 프로젝트 경험에 대한 강조 증가',
          '2024-25 포트폴리오 요구사항 업데이트'
        ],
        koreanStudentAdvantage: [
          'Strong mathematical and technical foundation',
          'Systematic approach to problem-solving',
          'Experience with advanced technology education'
        ],
        koreanStudentAdvantageKo: [
          '강력한 수학적, 기술적 기반',
          '문제 해결에 대한 체계적 접근',
          '고급 기술 교육 경험'
        ]
      },
      {
        id: '4',
        name: 'Yale University',
        nameKo: '예일 대학교',
        condition: admissionsConditions[3], // difficult
        acceptanceRate: 5.9,
        trend: 'decreasing',
        trendPercentage: -1.8,
        culturalFit: 75,
        academicFit: 90,
        financialFit: 80,
        deadline: '2024-11-01',
        priority: 'medium',
        insights: [
          'Decreasing acceptance rates for international students',
          'Strong emphasis on liberal arts education and critical thinking',
          'Growing focus on social justice and activism',
          'Korean students need to demonstrate unique perspectives'
        ],
        insightsKo: [
          '국제학생에 대한 입학률 감소',
          '인문학 교육과 비판적 사고에 대한 강한 강조',
          '사회 정의와 활동주의에 대한 관심 증가',
          '한국 학생들은 고유한 관점을 보여줘야 함'
        ],
        recommendations: [
          'Emphasize liberal arts interests and achievements',
          'Show commitment to social justice causes',
          'Demonstrate intellectual breadth and curiosity',
          'Connect Korean culture to global social issues'
        ],
        recommendationsKo: [
          '인문학적 관심과 성취를 강조하세요',
          '사회 정의에 대한 헌신을 보여주세요',
          '지적 폭과 호기심을 보여주세요',
          '한국 문화를 세계적 사회 이슈와 연결하세요'
        ],
        recentUpdates: [
          'New interdisciplinary research programs',
          'Enhanced support for international student community',
          'Updated essay prompts focusing on global challenges'
        ],
        recentUpdatesKo: [
          '새로운 학제간 연구 프로그램',
          '국제학생 커뮤니티 지원 강화',
          '세계적 도전에 초점을 맞춘 에세이 주제 업데이트'
        ],
        koreanStudentAdvantage: [
          'Strong analytical and critical thinking skills',
          'Cultural perspective on global issues',
          'Experience with rigorous academic environment'
        ],
        koreanStudentAdvantageKo: [
          '강력한 분석적, 비판적 사고 능력',
          '세계적 이슈에 대한 문화적 관점',
          '엄격한 학업 환경 경험'
        ]
      },
      {
        id: '5',
        name: 'Columbia University',
        nameKo: '컬럼비아 대학교',
        condition: admissionsConditions[4], // critical
        acceptanceRate: 5.1,
        trend: 'increasing',
        trendPercentage: 3.2,
        culturalFit: 80,
        academicFit: 85,
        financialFit: 75,
        deadline: '2024-11-01',
        priority: 'low',
        insights: [
          'Major policy changes affecting international admissions',
          'Increased focus on urban engagement and social impact',
          'Growing emphasis on diversity and inclusion',
          'Korean students should highlight community involvement'
        ],
        insightsKo: [
          '국제학생 입학에 영향을 주는 주요 정책 변화',
          '도시 참여와 사회적 영향에 대한 관심 증가',
          '다양성과 포용성에 대한 강조 증가',
          '한국 학생들은 지역사회 참여를 강조해야 함'
        ],
        recommendations: [
          'Monitor policy changes closely and adapt strategy',
          'Emphasize urban engagement experiences',
          'Show commitment to diversity and inclusion',
          'Highlight community service and social impact work'
        ],
        recommendationsKo: [
          '정책 변화를 면밀히 모니터링하고 전략을 조정하세요',
          '도시 참여 경험을 강조하세요',
          '다양성과 포용성에 대한 헌신을 보여주세요',
          '지역사회 봉사와 사회적 영향 작업을 강조하세요'
        ],
        recentUpdates: [
          'New international student support programs',
          'Updated financial aid policies for 2024-25',
          'Enhanced urban engagement opportunities'
        ],
        recentUpdatesKo: [
          '새로운 국제학생 지원 프로그램',
          '2024-25 재정 지원 정책 업데이트',
          '도시 참여 기회 강화'
        ],
        koreanStudentAdvantage: [
          'Strong community values and social responsibility',
          'Experience with diverse urban environments',
          'Cultural bridge-building abilities'
        ],
        koreanStudentAdvantageKo: [
          '강력한 지역사회 가치와 사회적 책임감',
          '다양한 도시 환경 경험',
          '문화적 다리 역할 능력'
        ]
      }
    ];

    setTimeout(() => {
      setUniversities(mockUniversities);
      setFilteredUniversities(mockUniversities);
      setLoading(false);
    }, 1000);
  }, [admissionsConditions]);

  // Filter universities based on search and filters
  useEffect(() => {
    let filtered = universities;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(uni => 
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.nameKo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Condition filter
    if (conditionFilter !== 'all') {
      filtered = filtered.filter(uni => uni.condition.type === conditionFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(uni => uni.priority === priorityFilter);
    }

    // Quick filter chips
    if (activeQuickFilter) {
      switch (activeQuickFilter) {
        case 'ivy': {
          const ivySet = new Set([
            'Harvard University',
            'Yale University',
            'Columbia University',
            'Princeton University',
            'Brown University',
            'Dartmouth College',
            'University of Pennsylvania',
            'Cornell University',
          ]);
          filtered = filtered.filter((u) => ivySet.has(u.name));
          break;
        }
        case 'odds': {
          // Heuristic: high acceptance odds
          filtered = filtered.filter((u) => u.acceptanceRate >= 6);
          break;
        }
        case 'aid': {
          // Heuristic: strong financial aid friendliness proxy
          filtered = filtered.filter((u) => u.financialFit >= 80);
          break;
        }
        default:
          break;
      }
    }

    // Sort by selected mode
    const sorted = [...filtered];
    if (sortMode === 'fit') {
      sorted.sort((a, b) => (b.culturalFit + b.academicFit + b.financialFit) - (a.culturalFit + a.academicFit + a.financialFit));
    } else if (sortMode === 'odds') {
      sorted.sort((a, b) => b.acceptanceRate - a.acceptanceRate);
    } else if (sortMode === 'aid') {
      sorted.sort((a, b) => b.financialFit - a.financialFit);
    }

    setFilteredUniversities(sorted);
  }, [universities, searchQuery, conditionFilter, priorityFilter, activeQuickFilter, sortMode]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
      case 'decreasing': return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
      default: return <InformationCircleIcon className="w-4 h-4 text-gray-600" />; // Changed from MinusIcon to InformationCircleIcon
    }
  };

  const getTrendText = (trend: string, percentage: number) => {
    const absPercentage = Math.abs(percentage);
    if (trend === 'increasing') {
      return isKorean ? `+${absPercentage}% 증가` : `+${absPercentage}% increase`;
    } else if (trend === 'decreasing') {
      return isKorean ? `-${absPercentage}% 감소` : `-${absPercentage}% decrease`;
    } else {
      return isKorean ? '안정적' : 'Stable';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-text-secondary">
            {isKorean ? '입학 동향을 분석하고 있습니다...' : 'Analyzing admissions trends...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PrivateSEO title={isKorean ? '입학 펄스 | AdmitAI Korea' : 'Admissions Pulse | AdmitAI Korea'} language={isKorean ? 'ko' : 'en'} />
      
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with growth hooks */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                {/* Removed ChartBarIcon as it's not used */}
              </div>
              <h1 className="text-3xl font-bold text-white">
                {isKorean ? '입학 펄스' : 'Admissions Pulse'}
              </h1>
              {/* See My Fit Score CTA (top right on large screens) */}
              <div className="ml-auto hidden md:block">
                {!isAuthenticated && (
                  <Button
                    to="/register"
                    variant="outline"
                    className="border-white/20 text-white hover:border-purple-500 hover:text-purple-500"
                    size="md"
                  >
                    {isKorean ? '내 적합도 보기' : 'See My Fit Score'}
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl">
              {isKorean 
                ? '실시간 대학별 입학 동향과 한국 학생을 위한 맞춤형 전략적 인사이트를 제공합니다. 외부 요인과 정책 변화를 종합적으로 분석하여 최적의 지원 전략을 제시합니다.'
                : 'Real-time university admissions trends and strategic insights tailored for Korean students. We analyze external factors and policy changes to provide optimal application strategies.'
              }
            </p>
            {/* Personalization sign-in prompt bar */}
            {!isAuthenticated && !hidePersonalizationBar && (
              <div className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 text-white px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isKorean ? '로그인하여 대학별 개인화 합격 적합도 점수를 확인하세요.' : 'Sign in to see your personalized admit score for each university.'}
                </span>
                <div className="flex items-center gap-2">
                  <Button to="/login" size="sm" variant="secondary">{isKorean ? '로그인' : 'Sign in'}</Button>
                  <button
                    type="button"
                    aria-label={isKorean ? '배너 닫기' : 'Dismiss banner'}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white/80 hover:bg-white/10"
                    onClick={() => {
                      setHidePersonalizationBar(true);
                      try { localStorage.setItem('uni_personalization_bar_hidden', '1'); } catch {}
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Admissions Ticker - removed per design simplification */}
          {/* Intentionally removed ticker; consider reintroducing later as a subtle, anonymized trend chip if needed */}

          {/* Filters - sticky with live filtering */}
          <Card className="mb-8 sticky top-20 md:top-24 z-30" variant="dark">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                {/* Removed MagnifyingGlassIcon as it's not used */}
                <input
                  type="text"
                  placeholder={isKorean ? '대학 검색...' : 'Search universities...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500/40 focus:border-transparent"
                />
              </div>
              
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-purple-500/40 focus:border-transparent"
              >
                <option value="all">{isKorean ? '모든 조건' : 'All Conditions'}</option>
                {admissionsConditions.map((condition) => (
                  <option key={condition.type} value={condition.type}>
                    {isKorean ? condition.labelKo : condition.label}
                  </option>
                ))}
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-purple-500/40 focus:border-transparent"
              >
                <option value="all">{isKorean ? '모든 우선순위' : 'All Priorities'}</option>
                <option value="high">{isKorean ? '높음' : 'High'}</option>
                <option value="medium">{isKorean ? '보통' : 'Medium'}</option>
                <option value="low">{isKorean ? '낮음' : 'Low'}</option>
              </select>
              {/* Empty cell to balance grid when removing Apply button */}
              <div className="hidden md:block" />
            </div>

            {/* Quick filter chips */}
            <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveQuickFilter((p) => (p === 'ivy' ? null : 'ivy'))}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeQuickFilter === 'ivy'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
              >
                {isKorean ? '아이비리그 상위' : 'Top Ivy League'}
              </button>
              <button
                type="button"
                onClick={() => setActiveQuickFilter((p) => (p === 'odds' ? null : 'odds'))}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeQuickFilter === 'odds'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
              >
                {isKorean ? '합격 확률 높음' : 'High Acceptance Odds'}
              </button>
              <button
                type="button"
                onClick={() => setActiveQuickFilter((p) => (p === 'aid' ? null : 'aid'))}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeQuickFilter === 'aid'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
              >
                {isKorean ? '재정 지원 우호적' : 'Financial Aid Friendly'}
              </button>

              {/* Sort segmented control */}
              <div className="ml-auto flex gap-1 p-1 rounded-full border border-white/10 bg-white/5">
                {[
                  { key: 'fit', label: isKorean ? '최적 적합' : 'Best Fit' },
                  { key: 'odds', label: isKorean ? '합격 확률' : 'Acceptance Odds' },
                  { key: 'aid', label: isKorean ? '재정 지원' : 'Aid Friendly' }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSortMode(opt.key as 'fit' | 'odds' | 'aid')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      sortMode === opt.key
                        ? 'bg-purple-600 text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* University Pulse Cards + gamification banner */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              {/* Simple gamification copy; in future, compute based on user prefs */}
              {isKorean ? '상위 매칭 10개 중 5개를 검토했습니다 — 계속 진행하세요!' : "You've reviewed 5/10 of your top matches — keep going!"}
            </div>
            {!isAuthenticated && (
              <Link to="/register" className="text-sm font-semibold text-purple-400 hover:text-purple-300">
                {isKorean ? '프리미엄 인사이트 잠금해제' : 'Unlock premium insight'} →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {filteredUniversities.map((university) => {
              const ConditionIcon = university.condition.icon;
              return (
                <div
                  key={university.id}
                  className="bg-white rounded-xl border p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedUniversity(university)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-0.5">
                        {isKorean ? university.nameKo : university.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        {/* Removed CalendarIcon as it's not used */}
                        <span className="flex items-center space-x-1">
                          {/* Removed ChartBarIcon as it's not used */}
                          <span>{university.acceptanceRate}%</span>
                        </span>
                      </div>
                    </div>
                    {(() => {
                      // Stronger color coding for immediate scan
                      const colorMap: Record<string, string> = {
                        favorable: 'bg-green-100 text-green-800 border-green-300',
                        moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                        challenging: 'bg-orange-100 text-orange-800 border-orange-300',
                        difficult: 'bg-red-100 text-red-800 border-red-300',
                        critical: 'bg-purple-100 text-purple-800 border-purple-300',
                      };
                      const cls = colorMap[university.condition.type] || 'bg-gray-100 text-gray-800 border-gray-300';
                      return (
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${cls}`}>
                          <ConditionIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {isKorean ? university.condition.labelKo : university.condition.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {isKorean ? '트렌드' : 'Trend'}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(university.trend)}
                        <span className="text-sm font-medium">
                          {getTrendText(university.trend, university.trendPercentage)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-base font-semibold text-blue-600">{university.culturalFit}%</div>
                        <div className="text-[11px] text-gray-600">
                          {isKorean ? '문화적 적합성' : 'Cultural Fit'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-semibold text-green-600">{university.academicFit}%</div>
                        <div className="text-[11px] text-gray-600">
                          {isKorean ? '학업 적합성' : 'Academic Fit'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-semibold text-purple-600">{university.financialFit}%</div>
                        <div className="text-[11px] text-gray-600">
                          {isKorean ? '재정 적합성' : 'Financial Fit'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call-to-Action Section */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                {isKorean ? '당신의 꿈의 대학에 합격할 준비가 되셨나요?' : 'Ready to Get Into Your Dream University?'}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {isKorean 
                  ? 'AdmitAI Korea와 함께 실시간 입학 동향을 활용하여 최적의 지원 전략을 세우세요. 한국 학생만을 위한 맞춤형 가이드와 AI 피드백을 받아보세요.'
                  : 'Use real-time admissions trends with AdmitAI Korea to create the optimal application strategy. Get personalized guidance and AI feedback designed specifically for Korean students.'
                }
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {/* Removed ChartBarIcon as it's not used */}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isKorean ? '실시간 동향 분석' : 'Real-time Trend Analysis'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {isKorean 
                      ? '최신 입학 정책과 트렌드를 실시간으로 분석'
                      : 'Real-time analysis of latest admission policies and trends'
                    }
                  </p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {/* Removed LightBulbIcon as it's not used */}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isKorean ? '한국 학생 우위' : 'Korean Student Advantages'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {isKorean 
                      ? '한국 학생만의 고유한 강점과 문화적 배경 활용'
                      : 'Leverage unique strengths and cultural background of Korean students'
                    }
                  </p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {/* Removed CheckCircleIcon as it's not used */}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isKorean ? '맞춤형 전략' : 'Personalized Strategy'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {isKorean 
                      ? '개인별 상황에 맞는 최적의 지원 전략 제시'
                      : 'Present optimal application strategies tailored to individual situations'
                    }
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {isKorean ? '무료 체험 시작하기' : 'Start Free Trial'}
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  {isKorean ? '데모 보기' : 'Watch Demo'}
                </button>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {isKorean ? '성공 사례' : 'Success Stories'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* Removed CheckCircleIcon as it's not used */}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">김민수</h4>
                <p className="text-sm text-gray-600 mb-2">Stanford University</p>
                <p className="text-xs text-gray-500">
                  {isKorean 
                    ? 'Admissions Pulse를 통해 Stanford의 최신 트렌드를 파악하고 성공적으로 합격했습니다.'
                    : 'Successfully admitted to Stanford by understanding latest trends through Admissions Pulse.'
                  }
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* Removed CheckCircleIcon as it's not used */}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Sarah Lee</h4>
                <p className="text-sm text-gray-600 mb-2">Harvard University</p>
                <p className="text-xs text-gray-500">
                  {isKorean 
                    ? '한국 학생 우위 분석을 통해 Harvard 지원 전략을 최적화했습니다.'
                    : 'Optimized Harvard application strategy through Korean student advantage analysis.'
                  }
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* Removed CheckCircleIcon as it's not used */}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">박지영</h4>
                <p className="text-sm text-gray-600 mb-2">MIT</p>
                <p className="text-xs text-gray-500">
                  {isKorean 
                    ? '실시간 업데이트를 통해 MIT의 새로운 정책 변화에 대응했습니다.'
                    : 'Responded to MIT\'s new policy changes through real-time updates.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Selected University Details Modal */}
          {selectedUniversity && (() => {
            const ConditionIcon = selectedUniversity.condition.icon;
            return (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {isKorean ? selectedUniversity.nameKo : selectedUniversity.name}
                      </h2>
                      <button
                        onClick={() => setSelectedUniversity(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Admissions Analysis */}
                      <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {isKorean ? '입학 분석' : 'Admissions Analysis'}
                        </h3>
                        <div className="space-y-4">
                          <div className={`p-4 rounded-lg border ${selectedUniversity.condition.color}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              <ConditionIcon className="w-5 h-5" />
                              <span className="font-semibold">
                                {isKorean ? selectedUniversity.condition.labelKo : selectedUniversity.condition.label}
                              </span>
                            </div>
                            <p className="text-sm">
                              {isKorean ? selectedUniversity.condition.descriptionKo : selectedUniversity.condition.description}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {isKorean ? '주요 인사이트' : 'Key Insights'}
                            </h4>
                            <ul className="space-y-2">
                              {(isKorean ? selectedUniversity.insightsKo : selectedUniversity.insights).map((insight, index) => (
                                <li key={index} className="flex items-start space-x-2 text-sm">
                                  {/* Removed LightBulbIcon as it's not used */}
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">
                              {isKorean ? '한국 학생 우위' : 'Korean Student Advantages'}
                            </h4>
                            <ul className="space-y-2">
                              {(isKorean ? selectedUniversity.koreanStudentAdvantageKo : selectedUniversity.koreanStudentAdvantage).map((advantage, index) => (
                                <li key={index} className="flex items-start space-x-2 text-sm text-blue-800">
                                  {/* Removed CheckCircleIcon as it's not used */}
                                  <span>{advantage}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Ask the AI (premium) */}
                          <RequireSubscription>
                            <div className="mt-6">
                              <h4 className="text-lg font-semibold text-gray-900 mb-3">{isKorean ? 'AI에게 질문하기' : 'Ask the AI'}</h4>
                              <RagInsightsPanel schoolId={selectedUniversity.name} topic="policy" />
                            </div>
                          </RequireSubscription>
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-6">
                        {/* Strategic Recommendations */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {isKorean ? '전략적 권장사항' : 'Strategic Recommendations'}
                          </h3>
                          <div className="space-y-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-green-900 mb-2">
                                {isKorean ? '지원 전략' : 'Application Strategy'}
                              </h4>
                              <ul className="space-y-2">
                                {(isKorean ? selectedUniversity.recommendationsKo : selectedUniversity.recommendations).map((rec, index) => (
                                  <li key={index} className="flex items-start space-x-2 text-sm text-green-800">
                                    <ArrowTrendingUpIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Recent Updates */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {isKorean ? '최근 업데이트' : 'Recent Updates'}
                          </h3>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <ul className="space-y-2">
                              {(isKorean ? selectedUniversity.recentUpdatesKo : selectedUniversity.recentUpdates).map((update, index) => (
                                <li key={index} className="flex items-start space-x-2 text-sm text-yellow-800">
                                  {/* Removed ClockIcon as it's not used */}
                                  <span>{update}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Fit Scores */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {isKorean ? '적합성 점수' : 'Fit Scores'}
                          </h3>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm">{isKorean ? '문화적 적합성' : 'Cultural Fit'}</span>
                                <span className="font-semibold text-purple-600">{selectedUniversity.culturalFit}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">{isKorean ? '학업 적합성' : 'Academic Fit'}</span>
                                <span className="font-semibold text-purple-600">{selectedUniversity.academicFit}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">{isKorean ? '재정 적합성' : 'Financial Fit'}</span>
                                <span className="font-semibold text-purple-600">{selectedUniversity.financialFit}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
};

export default AdmissionsPulsePage; 