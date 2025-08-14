import React, { useState } from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
// Icons not used on this page currently
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const translations = {
  en: {
    title: 'Set Your Goals',
    subtitle: 'Tell us about your academic and career aspirations',
    description: 'This helps us create a personalized roadmap for your US university application journey.',
    
    // Academic Level
    academicLevel: {
      title: 'What is your current academic level?',
      options: [
        { id: 'high-school-junior', label: 'High School Junior (11th Grade)', description: 'Starting early preparation' },
        { id: 'high-school-senior', label: 'High School Senior (12th Grade)', description: 'Applying this year' },
        { id: 'gap-year', label: 'Gap Year Student', description: 'Taking time before university' },
        { id: 'transfer', label: 'Transfer Student', description: 'Currently at another university' },
        { id: 'graduate', label: 'Graduate Student', description: 'Pursuing advanced degree' }
      ]
    },

    // Target Year
    targetYear: {
      title: 'When do you plan to start university?',
      options: [
        { id: '2025-fall', label: 'Fall 2025', description: 'Starting this year' },
        { id: '2026-fall', label: 'Fall 2026', description: 'Next year' },
        { id: '2026-spring', label: 'Spring 2026', description: 'Spring semester' },
        { id: '2027-fall', label: 'Fall 2027', description: 'Two years from now' },
        { id: 'undecided', label: 'Not sure yet', description: 'Still exploring options' }
      ]
    },

    // Academic Interests
    academicInterests: {
      title: 'What are your primary academic interests?',
      subtitle: 'Select up to 3 areas that interest you most',
      options: [
        { id: 'stem', label: 'STEM (Science, Technology, Engineering, Math)', icon: '🔬' },
        { id: 'business', label: 'Business & Economics', icon: '💼' },
        { id: 'arts', label: 'Arts & Humanities', icon: '🎨' },
        { id: 'social-sciences', label: 'Social Sciences', icon: '🌍' },
        { id: 'health', label: 'Health & Medicine', icon: '🏥' },
        { id: 'education', label: 'Education', icon: '📚' },
        { id: 'law', label: 'Law & Public Policy', icon: '⚖️' },
        { id: 'communications', label: 'Communications & Media', icon: '📺' },
        { id: 'environmental', label: 'Environmental Studies', icon: '🌱' },
        { id: 'psychology', label: 'Psychology', icon: '🧠' },
        { id: 'computer-science', label: 'Computer Science', icon: '💻' },
        { id: 'engineering', label: 'Engineering', icon: '⚙️' }
      ]
    },

    // Career Goals
    careerGoals: {
      title: 'What are your career goals?',
      subtitle: 'Select all that apply',
      options: [
        { id: 'research', label: 'Research & Academia', description: 'Pursuing advanced research or teaching' },
        { id: 'corporate', label: 'Corporate Career', description: 'Working in business or industry' },
        { id: 'entrepreneurship', label: 'Entrepreneurship', description: 'Starting my own business' },
        { id: 'public-service', label: 'Public Service', description: 'Government or non-profit work' },
        { id: 'healthcare', label: 'Healthcare', description: 'Medical or healthcare professions' },
        { id: 'technology', label: 'Technology', description: 'Tech industry or software development' },
        { id: 'creative', label: 'Creative Arts', description: 'Arts, design, or creative industries' },
        { id: 'international', label: 'International Work', description: 'Working globally or internationally' },
        { id: 'undecided', label: 'Still exploring', description: 'Not sure about career path yet' }
      ]
    },

    // University Preferences
    universityPreferences: {
      title: 'What type of university are you looking for?',
      subtitle: 'Select your preferences',
      options: [
        { id: 'ivy-league', label: 'Ivy League', description: 'Harvard, Yale, Princeton, etc.' },
        { id: 'top-20', label: 'Top 20 Universities', description: 'Highly selective institutions' },
        { id: 'liberal-arts', label: 'Liberal Arts Colleges', description: 'Small, focused undergraduate education' },
        { id: 'research', label: 'Research Universities', description: 'Large universities with research focus' },
        { id: 'state', label: 'State Universities', description: 'Public universities with diverse programs' },
        { id: 'specialized', label: 'Specialized Institutions', description: 'Art schools, tech institutes, etc.' },
        { id: 'korean-friendly', label: 'Korean Student Friendly', description: 'Universities with strong Korean communities' },
        { id: 'financial-aid', label: 'Good Financial Aid', description: 'Generous scholarships and aid packages' }
      ]
    },

    // Location Preferences
    locationPreferences: {
      title: 'Where would you like to study?',
      subtitle: 'Select your preferred regions',
      options: [
        { id: 'northeast', label: 'Northeast', description: 'New York, Boston, Philadelphia area' },
        { id: 'west-coast', label: 'West Coast', description: 'California, Washington, Oregon' },
        { id: 'midwest', label: 'Midwest', description: 'Chicago, Michigan, Illinois area' },
        { id: 'south', label: 'South', description: 'Texas, Florida, Georgia area' },
        { id: 'mountain-west', label: 'Mountain West', description: 'Colorado, Utah, Arizona area' },
        { id: 'anywhere', label: 'Anywhere in US', description: 'Open to all locations' }
      ]
    },

    // Navigation
    navigation: {
      back: 'Back',
      next: 'Continue to University Selection',
      progress: 'Step 1 of 4'
    }
  },
  ko: {
    title: '목표 설정',
    subtitle: '학업 및 진로 포부에 대해 알려주세요',
    description: '이를 통해 미국 대학 지원 여정을 위한 개인화된 로드맵을 만들어드립니다.',
    
    academicLevel: {
      title: '현재 학업 수준은 어떻게 되나요?',
      options: [
        { id: 'high-school-junior', label: '고등학교 2학년', description: '조기 준비 시작' },
        { id: 'high-school-senior', label: '고등학교 3학년', description: '올해 지원 예정' },
        { id: 'gap-year', label: '갭이어 학생', description: '대학 진학 전 시간 활용' },
        { id: 'transfer', label: '편입생', description: '현재 다른 대학 재학 중' },
        { id: 'graduate', label: '대학원생', description: '고급 학위 추구' }
      ]
    },

    targetYear: {
      title: '언제 대학에 진학하고 싶으신가요?',
      options: [
        { id: '2025-fall', label: '2025년 가을', description: '올해 시작' },
        { id: '2026-fall', label: '2026년 가을', description: '내년' },
        { id: '2026-spring', label: '2026년 봄', description: '봄학기' },
        { id: '2027-fall', label: '2027년 가을', description: '2년 후' },
        { id: 'undecided', label: '아직 모르겠어요', description: '여전히 탐색 중' }
      ]
    },

    academicInterests: {
      title: '주요 학업 관심 분야는 무엇인가요?',
      subtitle: '가장 관심 있는 분야를 최대 3개까지 선택해주세요',
      options: [
        { id: 'stem', label: 'STEM (과학, 기술, 공학, 수학)', icon: '🔬' },
        { id: 'business', label: '경영학 및 경제학', icon: '💼' },
        { id: 'arts', label: '예술 및 인문학', icon: '🎨' },
        { id: 'social-sciences', label: '사회과학', icon: '🌍' },
        { id: 'health', label: '의료 및 보건', icon: '🏥' },
        { id: 'education', label: '교육학', icon: '📚' },
        { id: 'law', label: '법학 및 공공정책', icon: '⚖️' },
        { id: 'communications', label: '커뮤니케이션 및 미디어', icon: '📺' },
        { id: 'environmental', label: '환경학', icon: '🌱' },
        { id: 'psychology', label: '심리학', icon: '🧠' },
        { id: 'computer-science', label: '컴퓨터 과학', icon: '💻' },
        { id: 'engineering', label: '공학', icon: '⚙️' }
      ]
    },

    careerGoals: {
      title: '진로 목표는 무엇인가요?',
      subtitle: '해당하는 모든 항목을 선택해주세요',
      options: [
        { id: 'research', label: '연구 및 학계', description: '고급 연구 또는 교육 추구' },
        { id: 'corporate', label: '기업 경력', description: '비즈니스 또는 산업계에서 근무' },
        { id: 'entrepreneurship', label: '창업', description: '자신만의 사업 시작' },
        { id: 'public-service', label: '공공 서비스', description: '정부 또는 비영리 단체에서 근무' },
        { id: 'healthcare', label: '의료', description: '의료 또는 보건 전문직' },
        { id: 'technology', label: '기술', description: '기술 산업 또는 소프트웨어 개발' },
        { id: 'creative', label: '창작 예술', description: '예술, 디자인 또는 창작 산업' },
        { id: 'international', label: '국제 업무', description: '글로벌 또는 국제적으로 근무' },
        { id: 'undecided', label: '아직 탐색 중', description: '진로 경로를 아직 모르겠어요' }
      ]
    },

    universityPreferences: {
      title: '어떤 종류의 대학을 찾고 계신가요?',
      subtitle: '선호도를 선택해주세요',
      options: [
        { id: 'ivy-league', label: '아이비 리그', description: '하버드, 예일, 프린스턴 등' },
        { id: 'top-20', label: '상위 20개 대학', description: '매우 선별적인 기관' },
        { id: 'liberal-arts', label: '리버럴 아츠 컬리지', description: '소규모, 집중된 학부 교육' },
        { id: 'research', label: '연구 대학', description: '연구 중심의 대규모 대학' },
        { id: 'state', label: '주립 대학', description: '다양한 프로그램을 가진 공립 대학' },
        { id: 'specialized', label: '전문 기관', description: '예술 학교, 기술 대학 등' },
        { id: 'korean-friendly', label: '한국 학생 친화적', description: '강한 한국 커뮤니티가 있는 대학' },
        { id: 'financial-aid', label: '좋은 재정 지원', description: '관대한 장학금 및 지원 패키지' }
      ]
    },

    locationPreferences: {
      title: '어디서 공부하고 싶으신가요?',
      subtitle: '선호하는 지역을 선택해주세요',
      options: [
        { id: 'northeast', label: '북동부', description: '뉴욕, 보스턴, 필라델피아 지역' },
        { id: 'west-coast', label: '서부 해안', description: '캘리포니아, 워싱턴, 오레곤' },
        { id: 'midwest', label: '중서부', description: '시카고, 미시간, 일리노이 지역' },
        { id: 'south', label: '남부', description: '텍사스, 플로리다, 조지아 지역' },
        { id: 'mountain-west', label: '산악 서부', description: '콜로라도, 유타, 애리조나 지역' },
        { id: 'anywhere', label: '미국 어디든', description: '모든 지역에 개방적' }
      ]
    },

    navigation: {
      back: '뒤로',
      next: '대학 선택으로 계속',
      progress: '4단계 중 1단계'
    }
  }
};

type Lang = keyof typeof translations;

interface GoalData {
  academicLevel: string;
  targetYear: string;
  academicInterests: string[];
  careerGoals: string[];
  universityPreferences: string[];
  locationPreferences: string[];
}

const GoalSettingPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[(language as Lang)] || translations.en;

  const [goals, setGoals] = useState<GoalData>({
    academicLevel: '',
    targetYear: '',
    academicInterests: [],
    careerGoals: [],
    universityPreferences: [],
    locationPreferences: []
  });

  const handleSelection = (category: keyof GoalData, value: string) => {
    setGoals(prev => {
      if (category === 'academicLevel' || category === 'targetYear') {
        return { ...prev, [category]: value };
      } else {
        const currentArray = prev[category] as string[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        
        // Limit academic interests to 3
        if (category === 'academicInterests' && newArray.length > 3) {
          return prev;
        }
        
        return { ...prev, [category]: newArray };
      }
    });
  };

  const handleNext = () => {
    // Save goals to localStorage or context
    localStorage.setItem('onboarding-goals', JSON.stringify(goals));
    navigate('/onboarding/universities');
  };

  const canProceed = goals.academicLevel && goals.targetYear && goals.academicInterests.length > 0;

  return (
    <OnboardingLayout currentStep={t.title} completedSteps={[t.navigation.back] as any}>
      <PrivateSEO title={t.title} language={language as 'ko' | 'en'} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
          <p className="text-gray-500 mt-2">{t.description}</p>
        </div>

        <div className="space-y-8">
          {/* Academic Level */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.academicLevel.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.academicLevel.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSelection('academicLevel', option.id)}
                  className={`p-4 text-left rounded-lg border transition-all ${
                    goals.academicLevel === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Target Year */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.targetYear.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.targetYear.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSelection('targetYear', option.id)}
                  className={`p-4 text-left rounded-lg border transition-all ${
                    goals.targetYear === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Academic Interests */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.academicInterests.title}</h2>
            <p className="text-gray-600 mb-4">{t.academicInterests.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {t.academicInterests.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSelection('academicInterests', option.id)}
                  disabled={!goals.academicInterests.includes(option.id) && goals.academicInterests.length >= 3}
                  className={`p-4 text-left rounded-lg border transition-all ${
                    goals.academicInterests.includes(option.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Career Goals */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.careerGoals.title}</h2>
            <p className="text-gray-600 mb-4">{t.careerGoals.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.careerGoals.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSelection('careerGoals', option.id)}
                  className={`p-4 text-left rounded-lg border transition-all ${
                    goals.careerGoals.includes(option.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* University Preferences */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.universityPreferences.title}</h2>
            <p className="text-gray-600 mb-4">{t.universityPreferences.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.universityPreferences.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSelection('universityPreferences', option.id)}
                  className={`p-4 text-left rounded-lg border transition-all ${
                    goals.universityPreferences.includes(option.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Location Preferences */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.locationPreferences.title}</h2>
            <p className="text-gray-600 mb-4">{t.locationPreferences.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.locationPreferences.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSelection('locationPreferences', option.id)}
                  className={`p-4 text-left rounded-lg border transition-all ${
                    goals.locationPreferences.includes(option.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate('/onboarding')}>
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

export default GoalSettingPage; 