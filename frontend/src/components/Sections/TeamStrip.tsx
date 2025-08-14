import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { SparklesIcon, ChartBarIcon, ServerStackIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const TeamStrip: React.FC = () => {
  const { language } = useLanguage();
  const isKorean = language === 'ko';

  const items = [
    {
      icon: SparklesIcon,
      title: isKorean ? 'NLP 전문가' : 'NLP Expert',
      desc: isKorean
        ? '이중언어 톤 전환과 문화 스토리텔링'
        : 'Bilingual tone transfer and cultural storytelling',
    },
    {
      icon: ChartBarIcon,
      title: isKorean ? 'ML 예측' : 'ML Forecasting',
      desc: isKorean
        ? '대학 “날씨” 모델과 수요·수용력 신호'
        : 'University “weather” models and capacity signals',
    },
    {
      icon: ServerStackIcon,
      title: isKorean ? '데이터 엔지니어링' : 'Data Engineering',
      desc: isKorean ? '검증 소스 기반 RAG·지식 그래프' : 'Verified-source RAG and knowledge graph',
    },
    {
      icon: AcademicCapIcon,
      title: isKorean ? '입학 리서치' : 'Admissions Research',
      desc: isKorean ? '연도별 정책·AO 신호 해석' : 'Year-specific policy and AO signals',
    },
  ];

  return (
    <div className="bg-black/40 backdrop-blur border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="text-white/80 text-sm">
            {isKorean
              ? '연구 기반 팀이 만든 대학별·연도별 인사이트'
              : 'Research-driven, university- and cycle-specific insights'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {items.map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white/90">
                <div className="p-2 rounded-lg bg-white/10">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">{title}</div>
                  <div className="text-white/70 text-xs">{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right">
            <Link
              to="/about#team"
              className="text-xs font-semibold text-blue-300 hover:text-white border border-white/20 hover:border-white/40 rounded-md px-3 py-2 inline-block bg-transparent"
            >
              {isKorean ? '팀 보기' : 'Meet the team'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStrip;

