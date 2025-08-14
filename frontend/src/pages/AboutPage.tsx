import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  AcademicCapIcon,
  LightBulbIcon,
  GlobeAltIcon,
  HeartIcon,
  ShieldCheckIcon,
  UsersIcon,
  StarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import SEOHead from '../components/seo/SEOHead';

interface TeamMember {
  name: string;
  nameKo: string;
  role: string;
  roleKo: string;
  bio: string;
  bioKo: string;
  image: string;
  linkedin?: string;
}

const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const isKorean = language === 'ko';

  const teamMembers: TeamMember[] = [
    {
      name: 'Dr. Sarah Kim',
      nameKo: '김사라 박사',
      role: 'CEO & Co-Founder',
      roleKo: 'CEO & 공동창립자',
      bio: 'Former Stanford admissions officer with 15+ years of experience in international student admissions.',
      bioKo: '스탠포드 대학 입학 담당관 출신으로 15년 이상의 국제학생 입학 경험을 보유하고 있습니다.',
      image: '/images/team/sarah-kim.jpg',
      linkedin: 'https://linkedin.com/in/sarah-kim'
    },
    {
      name: 'David Park',
      nameKo: '박대현',
      role: 'CTO & Co-Founder',
      roleKo: 'CTO & 공동창립자',
      bio: 'AI researcher and former Google engineer, specializing in natural language processing and educational technology.',
      bioKo: 'AI 연구원이자 구글 엔지니어 출신으로, 자연어 처리와 교육 기술을 전문으로 합니다.',
      image: '/images/team/david-park.jpg',
      linkedin: 'https://linkedin.com/in/david-park'
    },
    {
      name: 'Dr. Jennifer Lee',
      nameKo: '이지은 박사',
      role: 'Head of Education',
      roleKo: '교육 총괄',
      bio: 'Educational psychologist with expertise in cross-cultural communication and student development.',
      bioKo: '교육심리학자로, 문화간 소통과 학생 발달 전문가입니다.',
      image: '/images/team/jennifer-lee.jpg',
      linkedin: 'https://linkedin.com/in/jennifer-lee'
    },
    {
      name: 'Michael Cho',
      nameKo: '조민호',
      role: 'Head of Product',
      roleKo: '제품 총괄',
      bio: 'Product leader with experience at top edtech companies, passionate about user-centered design.',
      bioKo: '최고의 교육 기술 회사에서 경험을 쌓은 제품 리더로, 사용자 중심 디자인에 열정을 가지고 있습니다.',
      image: '/images/team/michael-cho.jpg',
      linkedin: 'https://linkedin.com/in/michael-cho'
    }
  ];

  const stats = [
    {
      number: '95%',
      label: isKorean ? '학생 만족도' : 'Student Satisfaction',
      description: isKorean ? '우리 플랫폼을 사용하는 학생들의 만족도' : 'Satisfaction rate among our students'
    },
    {
      number: '500+',
      label: isKorean ? '성공 사례' : 'Success Stories',
      description: isKorean ? '성공적으로 입학한 학생들의 수' : 'Students successfully admitted to their dream schools'
    },
    {
      number: '50+',
      label: isKorean ? '대학 파트너십' : 'University Partnerships',
      description: isKorean ? '협력하고 있는 미국 대학의 수' : 'U.S. universities we partner with'
    },
    {
      number: '24/7',
      label: isKorean ? '지원 서비스' : 'Support Available',
      description: isKorean ? '언제든지 이용 가능한 고객 지원' : 'Round-the-clock customer support'
    }
  ];

  const values = [
    {
      icon: HeartIcon,
      title: isKorean ? '학생 중심' : 'Student-Centered',
      titleKo: '학생 중심',
      description: isKorean 
        ? '모든 결정과 기능은 한국 학생들의 성공을 위해 설계됩니다.'
        : 'Every decision and feature is designed for Korean students\' success.'
    },
    {
      icon: ShieldCheckIcon,
      title: isKorean ? '신뢰성' : 'Trust & Security',
      titleKo: '신뢰성',
      description: isKorean 
        ? '개인정보 보호와 데이터 보안을 최우선으로 합니다.'
        : 'We prioritize privacy protection and data security above all else.'
    },
    {
      icon: GlobeAltIcon,
      title: isKorean ? '문화적 이해' : 'Cultural Understanding',
      titleKo: '문화적 이해',
      description: isKorean 
        ? '한국 문화와 미국 대학 문화를 깊이 이해합니다.'
        : 'We deeply understand both Korean culture and U.S. university culture.'
    },
    {
      icon: LightBulbIcon,
      title: isKorean ? '혁신' : 'Innovation',
      titleKo: '혁신',
      description: isKorean 
        ? '최신 AI 기술을 활용하여 혁신적인 솔루션을 제공합니다.'
        : 'We leverage cutting-edge AI technology to provide innovative solutions.'
    }
  ];

  return (
    <>
      <SEOHead
        title="회사 소개 | AdmitAI Korea"
        description="AdmitAI Korea는 한국 학생들을 위한 AI 기반 대학 입학 지원 플랫폼입니다. 혁신적인 기술로 입학 성공률을 높입니다."
        keywords="AdmitAI Korea 소개, 회사 정보, 팀 소개, 미션, 비전, 대학 입학 지원 플랫폼"
        canonical="https://admitai.kr/about"
        language="ko"
        ogImage="/og-image.jpg"
      />
      <div className="min-h-screen bg-surface-0">
        {/* Hero Section */}
        <div className="bg-brand-gradient text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">
                {isKorean ? 'AdmitAI Korea에 대해' : 'About AdmitAI Korea'}
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                {isKorean 
                  ? '한국 학생들이 미국 대학에 성공적으로 입학할 수 있도록 돕는 혁신적인 AI 기반 플랫폼입니다. 우리는 단순한 에세이 분석을 넘어서, 문화적 맥락을 이해하는 종합적인 입학 준비 솔루션을 제공합니다.'
                  : 'We are an innovative AI-powered platform helping Korean students successfully gain admission to U.S. universities. We go beyond simple essay analysis to provide comprehensive admission preparation solutions that understand cultural context.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-24 bg-surface-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-textc-primary mb-6">
                  {isKorean ? '우리의 미션' : 'Our Mission'}
                </h2>
                <p className="text-lg text-textc-secondary mb-6 leading-relaxed">
                  {isKorean 
                    ? '한국 학생들이 단순한 지원자가 아닌, 문화적으로 진정성 있고 전략적으로 포지셔닝된 후보자로 변모하도록 돕는 것입니다. 우리는 각 대학의 고유한 맥락과 외부 요인을 이해하고 활용하여 최대한의 입학 성공을 이끌어냅니다.'
                    : 'To transform Korean students from generic applicants into culturally authentic, strategically positioned candidates who understand and leverage each university\'s unique context and external factors for maximum admission success.'
                  }
                </p>
                <p className="text-lg text-textc-secondary leading-relaxed">
                  {isKorean 
                    ? '우리는 "대학 입학 기상학자"로서 작동합니다. 날씨가 외부 요인에 의해 영향을 받듯이, 대학 입학도 입학 정책, 문화적 분위기, 학술적 우선순위, 재정 지원 변화, 기관의 가치관, 시장 상황, 정책 변화 등의 외부 요인에 의해 영향을 받습니다.'
                    : 'We operate as "university admissions meteorologists" - using weather as an analogy to explain that we analyze the broader context and external factors that influence admissions decisions.'
                  }
                </p>
              </div>
              <div className="relative">
                <div className="bg-surface-1 border border-surface-border rounded-2xl p-8">
                  <AcademicCapIcon className="w-16 h-16 text-brand-500 mb-4" />
                  <h3 className="text-2xl font-bold text-textc-primary mb-4">
                    {isKorean ? '혁신적인 접근법' : 'Innovative Approach'}
                  </h3>
                  <ul className="space-y-3 text-textc-secondary">
                    <li className="flex items-start">
                      <StarIcon className="w-5 h-5 text-state-warn mr-3 mt-0.5" />
                      <span>{isKorean ? '문화적 맥락을 이해하는 AI' : 'AI that understands cultural context'}</span>
                    </li>
                    <li className="flex items-start">
                      <ChartBarIcon className="w-5 h-5 text-state-info mr-3 mt-0.5" />
                      <span>{isKorean ? '실시간 대학별 트렌드 분석' : 'Real-time university-specific trend analysis'}</span>
                    </li>
                    <li className="flex items-start">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-state-success mr-3 mt-0.5" />
                      <span>{isKorean ? '개인화된 멘토링 및 가이드' : 'Personalized mentoring and guidance'}</span>
                    </li>
                    <li className="flex items-start">
                      <DocumentTextIcon className="w-5 h-5 text-brand-500 mr-3 mt-0.5" />
                      <span>{isKorean ? '종합적인 지원 로드맵' : 'Comprehensive application roadmap'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-24 bg-surface-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-textc-primary mb-4">
                {isKorean ? '우리의 성과' : 'Our Impact'}
              </h2>
              <p className="text-xl text-textc-secondary">
                {isKorean 
                  ? '한국 학생들의 성공적인 미국 대학 입학을 위한 우리의 노력'
                  : 'Our commitment to Korean students\' successful U.S. university admission'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-surface-1 rounded-xl p-8 shadow-sm border border-surface-border">
                    <div className="text-4xl font-bold text-brand-500 mb-2">{stat.number}</div>
                    <h3 className="text-lg font-semibold text-textc-primary mb-2">{stat.label}</h3>
                    <p className="text-textc-secondary">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-24 bg-surface-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-textc-primary mb-4">
                {isKorean ? '우리의 가치관' : 'Our Values'}
              </h2>
              <p className="text-xl text-textc-secondary">
                {isKorean 
                  ? 'AdmitAI Korea가 추구하는 핵심 가치들'
                  : 'The core values that drive AdmitAI Korea'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-surface-1 border border-surface-border rounded-xl p-8">
                      <Icon className="w-12 h-12 text-brand-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-textc-primary mb-3">{value.title}</h3>
                      <p className="text-textc-secondary">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div id="team" className="py-24 bg-surface-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-textc-primary mb-4">
                {isKorean ? '우리 팀' : 'Our Team'}
              </h2>
              <p className="text-xl text-textc-secondary">
                {isKorean 
                  ? '한국 학생들의 성공을 위해 헌신하는 전문가들'
                  : 'Experts dedicated to Korean students\' success'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-surface-1 rounded-xl p-6 shadow-sm border border-surface-border text-center">
                  <div className="w-24 h-24 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UsersIcon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-textc-primary mb-1">
                    {isKorean ? member.nameKo : member.name}
                  </h3>
                  <p className="text-brand-500 font-medium mb-3">
                    {isKorean ? member.roleKo : member.role}
                  </p>
                  <p className="text-textc-secondary text-sm">
                    {isKorean ? member.bioKo : member.bio}
                  </p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-300 hover:text-white mt-3 text-sm font-medium"
                    >
                      LinkedIn
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-surface-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-textc-primary mb-6">
              {isKorean ? '함께 성공의 여정을 시작하세요' : 'Start Your Success Journey With Us'}
            </h2>
            <p className="text-xl text-textc-secondary mb-8">
              {isKorean 
                ? 'AdmitAI Korea와 함께 미국 대학 입학의 꿈을 현실로 만들어보세요.'
                : 'Make your U.S. university admission dream a reality with AdmitAI Korea.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
              >
                {isKorean ? '무료로 시작하기' : 'Get Started Free'}
              </Link>
              <Link
                to="/contact"
                className="border border-white/20 text-blue-300 hover:text-white hover:border-white/40 px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
              >
                {isKorean ? '문의하기' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage; 