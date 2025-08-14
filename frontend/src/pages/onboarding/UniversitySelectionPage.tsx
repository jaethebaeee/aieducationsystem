import React, { useState, useEffect } from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  AcademicCapIcon, 
  MapPinIcon,
  StarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const translations = {
  en: {
    title: 'Choose Your Universities',
    subtitle: 'Select universities that match your goals and preferences',
    description: 'We\'ve curated a list of universities based on your goals. You can select up to 10 universities to focus on.',
    
    // Filters
    filters: {
      title: 'Filter Universities',
      search: 'Search universities...',
      categories: {
        all: 'All Universities',
        ivy: 'Ivy League',
        top20: 'Top 20',
        liberalArts: 'Liberal Arts',
        research: 'Research',
        state: 'State Universities',
        koreanFriendly: 'Korean Friendly'
      },
      regions: {
        all: 'All Regions',
        northeast: 'Northeast',
        westCoast: 'West Coast',
        midwest: 'Midwest',
        south: 'South',
        mountainWest: 'Mountain West'
      }
    },

    // University Info
    universityInfo: {
      acceptanceRate: 'Acceptance Rate',
      koreanStudents: 'Korean Students',
      financialAid: 'Financial Aid',
      weather: 'Weather',
      addToList: 'Add to List',
      removeFromList: 'Remove from List',
      viewDetails: 'View Details'
    },

    // Navigation
    navigation: {
      back: 'Back to Goals',
      next: 'Continue to Profile',
      progress: 'Step 2 of 4',
      selected: 'Selected',
      maxReached: 'Maximum 10 universities'
    }
  },
  ko: {
    title: '대학 선택',
    subtitle: '목표와 선호도에 맞는 대학을 선택하세요',
    description: '목표를 바탕으로 대학 목록을 선별했습니다. 집중할 대학을 최대 10개까지 선택할 수 있습니다.',
    
    filters: {
      title: '대학 필터',
      search: '대학 검색...',
      categories: {
        all: '모든 대학',
        ivy: '아이비 리그',
        top20: '상위 20개',
        liberalArts: '리버럴 아츠',
        research: '연구 대학',
        state: '주립 대학',
        koreanFriendly: '한국 친화적'
      },
      regions: {
        all: '모든 지역',
        northeast: '북동부',
        westCoast: '서부 해안',
        midwest: '중서부',
        south: '남부',
        mountainWest: '산악 서부'
      }
    },

    universityInfo: {
      acceptanceRate: '합격률',
      koreanStudents: '한국 학생',
      financialAid: '재정 지원',
      weather: '날씨',
      addToList: '목록에 추가',
      removeFromList: '목록에서 제거',
      viewDetails: '상세 보기'
    },

    navigation: {
      back: '목표로 돌아가기',
      next: '프로필로 계속',
      progress: '4단계 중 2단계',
      selected: '선택됨',
      maxReached: '최대 10개 대학'
    }
  }
};

type Lang = keyof typeof translations;

interface University {
  id: string;
  name: string;
  nameKo: string;
  location: string;
  locationKo: string;
  category: string[];
  region: string;
  acceptanceRate: number;
  koreanStudents: number;
  financialAid: string;
  weather: string;
  weatherKo: string;
  description: string;
  descriptionKo: string;
  strengths: string[];
  strengthsKo: string[];
  koreanFriendly: boolean;
  ranking: number;
  image: string;
}

const universities: University[] = [
  {
    id: 'harvard',
    name: 'Harvard University',
    nameKo: '하버드 대학교',
    location: 'Cambridge, MA',
    locationKo: '캠브리지, 매사추세츠',
    category: ['ivy', 'top20', 'research'],
    region: 'northeast',
    acceptanceRate: 4.6,
    koreanStudents: 120,
    financialAid: 'Need-blind',
    weather: 'Cold winters, mild summers',
    weatherKo: '추운 겨울, 온화한 여름',
    description: 'World-renowned university with exceptional academic programs and resources.',
    descriptionKo: '뛰어난 학업 프로그램과 자원을 가진 세계적으로 유명한 대학입니다.',
    strengths: ['Liberal Arts', 'Research', 'Global Network'],
    strengthsKo: ['리버럴 아츠', '연구', '글로벌 네트워크'],
    koreanFriendly: true,
    ranking: 1,
    image: '/images/universities/harvard.jpg'
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    nameKo: '스탠포드 대학교',
    location: 'Stanford, CA',
    locationKo: '스탠포드, 캘리포니아',
    category: ['top20', 'research'],
    region: 'westCoast',
    acceptanceRate: 4.3,
    koreanStudents: 180,
    financialAid: 'Need-blind',
    weather: 'Mediterranean climate',
    weatherKo: '지중해성 기후',
    description: 'Leading research university with strong focus on innovation and entrepreneurship.',
    descriptionKo: '혁신과 창업에 강한 초점을 맞춘 선도적인 연구 대학입니다.',
    strengths: ['Technology', 'Innovation', 'Entrepreneurship'],
    strengthsKo: ['기술', '혁신', '창업'],
    koreanFriendly: true,
    ranking: 2,
    image: '/images/universities/stanford.jpg'
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    nameKo: '매사추세츠 공과대학',
    location: 'Cambridge, MA',
    locationKo: '캠브리지, 매사추세츠',
    category: ['top20', 'research'],
    region: 'northeast',
    acceptanceRate: 6.7,
    koreanStudents: 150,
    financialAid: 'Need-blind',
    weather: 'Cold winters, mild summers',
    weatherKo: '추운 겨울, 온화한 여름',
    description: 'Premier institution for science, technology, and engineering education.',
    descriptionKo: '과학, 기술, 공학 교육을 위한 최고의 기관입니다.',
    strengths: ['STEM', 'Research', 'Innovation'],
    strengthsKo: ['STEM', '연구', '혁신'],
    koreanFriendly: true,
    ranking: 3,
    image: '/images/universities/mit.jpg'
  },
  {
    id: 'yale',
    name: 'Yale University',
    nameKo: '예일 대학교',
    location: 'New Haven, CT',
    locationKo: '뉴헤이븐, 코네티컷',
    category: ['ivy', 'top20', 'research'],
    region: 'northeast',
    acceptanceRate: 6.2,
    koreanStudents: 95,
    financialAid: 'Need-blind',
    weather: 'Four seasons',
    weatherKo: '사계절',
    description: 'Historic university known for its strong liberal arts education and research.',
    descriptionKo: '강력한 리버럴 아츠 교육과 연구로 유명한 역사적인 대학입니다.',
    strengths: ['Liberal Arts', 'Humanities', 'Research'],
    strengthsKo: ['리버럴 아츠', '인문학', '연구'],
    koreanFriendly: true,
    ranking: 4,
    image: '/images/universities/yale.jpg'
  },
  {
    id: 'ucla',
    name: 'University of California, Los Angeles',
    nameKo: '캘리포니아 대학교 로스앤젤레스',
    location: 'Los Angeles, CA',
    locationKo: '로스앤젤레스, 캘리포니아',
    category: ['top20', 'research', 'state'],
    region: 'westCoast',
    acceptanceRate: 10.8,
    koreanStudents: 450,
    financialAid: 'Need-based',
    weather: 'Mediterranean climate',
    weatherKo: '지중해성 기후',
    description: 'Large public research university with diverse programs and strong Korean community.',
    descriptionKo: '다양한 프로그램과 강한 한국 커뮤니티를 가진 대규모 공립 연구 대학입니다.',
    strengths: ['Diversity', 'Research', 'Arts'],
    strengthsKo: ['다양성', '연구', '예술'],
    koreanFriendly: true,
    ranking: 15,
    image: '/images/universities/ucla.jpg'
  },
  {
    id: 'berkeley',
    name: 'University of California, Berkeley',
    nameKo: '캘리포니아 대학교 버클리',
    location: 'Berkeley, CA',
    locationKo: '버클리, 캘리포니아',
    category: ['top20', 'research', 'state'],
    region: 'westCoast',
    acceptanceRate: 11.4,
    koreanStudents: 380,
    financialAid: 'Need-based',
    weather: 'Mediterranean climate',
    weatherKo: '지중해성 기후',
    description: 'Top public university known for academic excellence and social activism.',
    descriptionKo: '학업 우수성과 사회 활동으로 유명한 최고의 공립 대학입니다.',
    strengths: ['Research', 'Activism', 'Innovation'],
    strengthsKo: ['연구', '활동주의', '혁신'],
    koreanFriendly: true,
    ranking: 13,
    image: '/images/universities/berkeley.jpg'
  },
  {
    id: 'nyu',
    name: 'New York University',
    nameKo: '뉴욕 대학교',
    location: 'New York, NY',
    locationKo: '뉴욕, 뉴욕',
    category: ['research'],
    region: 'northeast',
    acceptanceRate: 12.8,
    koreanStudents: 520,
    financialAid: 'Need-based',
    weather: 'Four seasons',
    weatherKo: '사계절',
    description: 'Urban university in the heart of New York City with global perspective.',
    descriptionKo: '뉴욕시 중심부에 위치한 글로벌 관점을 가진 도시 대학입니다.',
    strengths: ['Global', 'Arts', 'Business'],
    strengthsKo: ['글로벌', '예술', '경영'],
    koreanFriendly: true,
    ranking: 25,
    image: '/images/universities/nyu.jpg'
  },
  {
    id: 'usc',
    name: 'University of Southern California',
    nameKo: '남캘리포니아 대학교',
    location: 'Los Angeles, CA',
    locationKo: '로스앤젤레스, 캘리포니아',
    category: ['research'],
    region: 'westCoast',
    acceptanceRate: 11.4,
    koreanStudents: 680,
    financialAid: 'Merit-based',
    weather: 'Mediterranean climate',
    weatherKo: '지중해성 기후',
    description: 'Private research university with strong programs in arts, business, and engineering.',
    descriptionKo: '예술, 경영, 공학 분야에서 강한 프로그램을 가진 사립 연구 대학입니다.',
    strengths: ['Arts', 'Business', 'Engineering'],
    strengthsKo: ['예술', '경영', '공학'],
    koreanFriendly: true,
    ranking: 27,
    image: '/images/universities/usc.jpg'
  }
];

const UniversitySelectionPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[(language as Lang)] || translations.en;

  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('onboarding-goals');
    if (savedGoals) {
      const goals = JSON.parse(savedGoals);
      // Pre-select universities based on goals
      const recommended = universities.filter(uni => {
        if (goals.universityPreferences.includes('korean-friendly') && !uni.koreanFriendly) return false;
        if (goals.locationPreferences.includes('northeast') && uni.region !== 'northeast') return false;
        if (goals.locationPreferences.includes('west-coast') && uni.region !== 'westCoast') return false;
        return true;
      }).slice(0, 5);
      setSelectedUniversities(recommended.map(uni => uni.id));
    }
  }, []);

  const handleUniversityToggle = (universityId: string) => {
    setSelectedUniversities(prev => {
      if (prev.includes(universityId)) {
        return prev.filter(id => id !== universityId);
      } else {
        if (prev.length >= 10) return prev;
        return [...prev, universityId];
      }
    });
  };

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         uni.nameKo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || uni.category.includes(selectedCategory);
    const matchesRegion = selectedRegion === 'all' || uni.region === selectedRegion;
    
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const handleNext = () => {
    localStorage.setItem('onboarding-universities', JSON.stringify(selectedUniversities));
    navigate('/onboarding/profile');
  };

  const canProceed = selectedUniversities.length > 0;

  return (
    <OnboardingLayout currentStep={t.title} completedSteps={[translations.en.navigation.back] as any}>
      <PrivateSEO title={t.title} language={language as 'ko' | 'en'} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
          <p className="text-gray-500 mt-2">{t.description}</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.filters.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.filters.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(t.filters.categories).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(t.filters.regions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>

            {/* Selected Count */}
            <div className="flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <span className="font-medium">{selectedUniversities.length}/10</span>
              <span className="ml-2 text-sm">{t.navigation.selected}</span>
            </div>
          </div>
        </Card>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map(university => (
            <div
              key={university.id}
              className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all ${
                selectedUniversities.includes(university.id)
                  ? 'ring-2 ring-blue-500 border-blue-500'
                  : 'hover:shadow-md'
              }`}
            >
              {/* University Image */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <AcademicCapIcon className="w-16 h-16 text-blue-600" />
              </div>

              {/* University Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {language === 'ko' ? university.nameKo : university.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {language === 'ko' ? university.locationKo : university.location}
                    </div>
                  </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <Badge size="sm" variant="warning">#{university.ranking}</Badge>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {language === 'ko' ? university.descriptionKo : university.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500">{t.universityInfo.acceptanceRate}</div>
                    <div className="font-medium">{university.acceptanceRate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">{t.universityInfo.koreanStudents}</div>
                    <div className="font-medium">{university.koreanStudents}+</div>
                  </div>
                </div>

                {/* Strengths */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {(language === 'ko' ? university.strengthsKo : university.strengths).slice(0, 2).map((strength, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {selectedUniversities.includes(university.id) ? (
                  <Button fullWidth variant="danger" onClick={() => handleUniversityToggle(university.id)}>
                    {t.universityInfo.removeFromList}
                  </Button>
                ) : (
                  <Button fullWidth variant="primary" onClick={() => handleUniversityToggle(university.id)} disabled={selectedUniversities.length >= 10}>
                    {t.universityInfo.addToList}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate('/onboarding/goals')}>
            {t.navigation.back}
          </Button>
          <Button variant="primary" onClick={handleNext} disabled={!canProceed}>
            {t.navigation.next}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default UniversitySelectionPage; 