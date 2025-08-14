import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SparklesIcon, ChartBarIcon, ServerStackIcon, AcademicCapIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const TeamSection: React.FC = () => {
  const { language } = useLanguage();
  const isKorean = language === 'ko';

  const pillars = [
    {
      icon: SparklesIcon,
      title: isKorean ? 'NLP 전문가' : 'NLP Expert',
      desc: isKorean
        ? '이중언어 톤 전환과 문화 스토리텔링으로 진정성을 유지합니다.'
        : 'Bilingual tone transfer and cultural storytelling that keeps your authentic voice.',
    },
    {
      icon: ChartBarIcon,
      title: isKorean ? 'ML 예측' : 'ML Forecasting',
      desc: isKorean
        ? '재정·수요·전공 수용력 신호를 연결한 대학 “날씨” 모델.'
        : 'University “weather” models linking finances, demand, and major capacity.',
    },
    {
      icon: ServerStackIcon,
      title: isKorean ? '데이터 엔지니어링' : 'Data Engineering',
      desc: isKorean
        ? '검증된 소스 기반 RAG 파이프라인과 지식 그래프.'
        : 'Verified-source RAG pipelines and a maintained knowledge graph.',
    },
    {
      icon: AcademicCapIcon,
      title: isKorean ? '입학 리서치' : 'Admissions Research',
      desc: isKorean
        ? '연도별 정책·AO 신호를 한국 학생 맥락에 맞게 해석.'
        : 'Year-specific policy and AO signals tailored for Korean applicants.',
    },
  ];

  const bullets = [
    isKorean ? '근거 연결 인사이트(CDS, IPEDS, AO 포스트, 정책 문서, 캠퍼스 분위기)' : 'Evidence-linked insights (CDS, IPEDS, AO posts, policy memos, campus vibe)',
    isKorean ? '대학별 예보 주간 업데이트' : 'University-specific forecasts updated weekly',
    isKorean ? '이중언어 스토리텔링 + ESL 개선' : 'Bilingual cultural storytelling with ESL optimization',
    isKorean ? '전공 수용력·수요 역학 기반 지원 타이밍 전략' : 'Timing strategy based on capacity and yield dynamics',
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {isKorean ? '우리가 다르게 분석하는 이유' : 'How we analyze differently'}
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            {isKorean
              ? '연구자 중심 팀이 만든 대학별·연도별 인사이트'
              : 'Researcher-built, year- and university-specific insights'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-semibold">{title}</div>
              </div>
              <p className="text-sm text-white/80">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold mb-3">{isKorean ? '우리는 이렇게 증명합니다' : 'How we prove it'}</h3>
            <ul className="space-y-2">
              {bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-white/80">
                  <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-emerald-400" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-blue-600/10 p-6">
            <h3 className="font-semibold mb-2">{isKorean ? '팀 합류' : 'Join the team'}</h3>
            <p className="text-sm text-white/80 mb-3">
              {isKorean ? '연구·엔지니어링·리서치 채용 중입니다.' : 'We’re hiring across research, engineering, and admissions.'}
            </p>
            <a href="/careers" className="inline-block text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md px-3 py-2">
              {isKorean ? '채용 보기' : 'See roles'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

