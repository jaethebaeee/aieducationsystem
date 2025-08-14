import React, { useState } from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const translations = {
  en: {
    title: 'Complete Your Profile',
    subtitle: 'Tell us about your academic background and achievements',
    description: 'This helps us personalize your roadmap and recommendations.',
    fields: {
      name: 'Full Name',
      school: 'Current School',
      gpa: 'GPA (unweighted, 4.0 scale)',
      testScores: 'Test Scores (SAT/ACT/TOEFL)',
      extracurriculars: 'Extracurricular Activities',
      awards: 'Awards & Honors',
      languages: 'Languages Spoken',
      submit: 'Continue to My Roadmap',
      back: 'Back to University Selection',
      progress: 'Step 3 of 4',
      placeholder: {
        name: 'Enter your full name',
        school: 'Enter your school name',
        gpa: 'e.g. 3.85',
        testScores: 'e.g. SAT 1500, TOEFL 110',
        extracurriculars: 'e.g. Debate Club, Soccer Team',
        awards: 'e.g. Math Olympiad Gold',
        languages: 'e.g. Korean, English'
      }
    },
    required: '* Required',
    success: 'Profile saved!'
  },
  ko: {
    title: '프로필 완성',
    subtitle: '학업 배경과 성과를 입력해주세요',
    description: '이를 통해 맞춤형 로드맵과 추천을 제공합니다.',
    fields: {
      name: '이름',
      school: '재학 중인 학교',
      gpa: 'GPA (4.0 만점 기준)',
      testScores: '시험 점수 (SAT/ACT/TOEFL 등)',
      extracurriculars: '교내외 활동',
      awards: '수상 경력',
      languages: '구사 가능한 언어',
      submit: '내 로드맵으로 계속',
      back: '대학 선택으로 돌아가기',
      progress: '4단계 중 3단계',
      placeholder: {
        name: '이름을 입력하세요',
        school: '학교명을 입력하세요',
        gpa: '예: 3.85',
        testScores: '예: SAT 1500, TOEFL 110',
        extracurriculars: '예: 토론 동아리, 축구부',
        awards: '예: 수학 올림피아드 금상',
        languages: '예: 한국어, 영어'
      }
    },
    required: '* 필수',
    success: '프로필이 저장되었습니다!'
  }
};

type Lang = keyof typeof translations;

interface ProfileData {
  name: string;
  school: string;
  gpa: string;
  testScores: string;
  extracurriculars: string;
  awards: string;
  languages: string;
}

const ProfileCompletionPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[(language as Lang)] || translations.en;

  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    school: '',
    gpa: '',
    testScores: '',
    extracurriculars: '',
    awards: '',
    languages: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('onboarding-profile', JSON.stringify(profile));
    setSubmitted(true);
    setTimeout(() => navigate('/dashboard'), 1200);
  };

  const canProceed = profile.name && profile.school && profile.gpa;

  return (
    <OnboardingLayout currentStep={t.title} completedSteps={[t.fields.back] as any}>
      <PrivateSEO title={t.title} language={language as 'ko' | 'en'} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
          <p className="text-gray-500 mt-2">{t.description}</p>
        </div>

        <Card>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.fields.name} <span className="text-red-500">{t.required}</span>
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder={t.fields.placeholder.name}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.fields.school} <span className="text-red-500">{t.required}</span>
            </label>
            <input
              type="text"
              name="school"
              value={profile.school}
              onChange={handleChange}
              placeholder={t.fields.placeholder.school}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.fields.gpa} <span className="text-red-500">{t.required}</span>
            </label>
            <input
              type="text"
              name="gpa"
              value={profile.gpa}
              onChange={handleChange}
              placeholder={t.fields.placeholder.gpa}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.fields.testScores}
            </label>
            <input
              type="text"
              name="testScores"
              value={profile.testScores}
              onChange={handleChange}
              placeholder={t.fields.placeholder.testScores}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.fields.extracurriculars}
            </label>
            <input
              type="text"
              name="extracurriculars"
              value={profile.extracurriculars}
              onChange={handleChange}
              placeholder={t.fields.placeholder.extracurriculars}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.fields.awards}
            </label>
            <input
              type="text"
              name="awards"
              value={profile.awards}
              onChange={handleChange}
              placeholder={t.fields.placeholder.awards}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t.fields.languages}
            </label>
            <input
              type="text"
              name="languages"
              value={profile.languages}
              onChange={handleChange}
              placeholder={t.fields.placeholder.languages}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-between items-center mt-8">
            <Button variant="outline" type="button" onClick={() => navigate('/onboarding/universities')}>
              {t.fields.back}
            </Button>
            <Button variant="primary" type="submit" disabled={!canProceed}>
              {t.fields.submit}
            </Button>
          </div>
        </form>
        </Card>

        {submitted && (
          <div className="flex items-center justify-center mt-8">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <span className="text-green-600 font-medium">{t.success}</span>
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
};

export default ProfileCompletionPage; 