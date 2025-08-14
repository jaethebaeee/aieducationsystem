import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const StatCard: React.FC<{ label: string; value: string; foot?: string }> = ({ label, value, foot }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <p className="text-text-muted text-xs mb-1">{label}</p>
    <p className="text-white text-2xl font-semibold">{value}</p>
    {foot && <p className="text-text-muted text-[10px] mt-1">{foot}</p>}
  </div>
);

const ConfidenceSpark: React.FC = () => (
  <div className="h-24 w-full bg-gradient-to-b from-white/5 to-transparent rounded-lg relative overflow-hidden border border-white/10">
    <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full opacity-80">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(139,92,246,0.35)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0.05)" />
        </linearGradient>
      </defs>
      <path d="M0,70 C40,60 60,55 100,45 C140,35 160,40 200,30" stroke="rgba(139,92,246,0.85)" strokeWidth="2" fill="none" />
      <path d="M0,78 C40,69 60,64 100,54 C140,44 160,49 200,39 L200,100 L0,100 Z" fill="url(#grad)" />
    </svg>
    <div className="absolute top-2 right-2 text-text-muted text-[10px]">± CI</div>
  </div>
);

const ScientificOptimizer: React.FC = () => {
  const { isKorean } = useLanguage();
  const [showMethod, setShowMethod] = useState(false);
  return (
    <section className="bg-black border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-2xl md:text-3xl font-bold">{isKorean ? '증거 기반 입시 최적화' : 'Evidence‑driven admissions optimizer'}</h2>
            <p className="text-text-secondary mt-1">{isKorean ? '머신러닝·NLP·대학 정책 신호를 활용하여 결과를 “보장”이 아닌 “최적화”합니다.' : 'Machine learning, NLP, and policy signals to optimize—not guarantee—outcomes.'}</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-white/10 text-white text-xs">Local LLM</span>
            <span className="px-2 py-1 rounded-full bg-white/10 text-white text-xs">KR/EN</span>
            <span className="px-2 py-1 rounded-full bg-white/10 text-white text-xs">Methodology v1.2</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <ConfidenceSpark />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label={isKorean ? '매칭 정확도' : 'Match accuracy'} value="93.4%" foot={isKorean ? '95% 신뢰구간 ±1.8% (n=1,204)' : '95% CI ±1.8% (n=1,204)'} />
            <StatCard label={isKorean ? '에세이 개선 효과' : 'Essay lift'} value="+27%" foot={isKorean ? '합격 연관 지표 기준' : 'acceptance‑adjacent indicators'} />
            <StatCard label={isKorean ? '재사용 정밀도' : 'Reuse precision'} value="0.89" foot={isKorean ? '프롬프트 재사용 탐지 F1' : 'F1 on prompt reuse detection'} />
            <StatCard label={isKorean ? '기한 준수 향상' : 'On‑time uplift'} value="+41%" foot={isKorean ? '체크리스트 도입 후' : 'after checklist adoption'} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-text-muted text-xs">
            {isKorean ? '본 서비스는 “보장”이 아닌 “최적화”를 목표로 합니다. 결과는 학생군·프로필·정책 변화에 따라 달라질 수 있습니다.' : 'We are an optimizer, not a guarantee. Results vary by cohort, profile, and policy shifts.'}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowMethod(true)} className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-sm">{isKorean ? '방법론 보기' : 'View methodology'}</button>
            <a href="#onboarding" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm">{isKorean ? '내 프로필 시도' : 'Try your profile'}</a>
          </div>
        </div>
        {showMethod && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowMethod(false)}>
            <div className="w-full max-w-2xl bg-[#0d0d10] border border-white/10 rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-lg font-semibold">{isKorean ? '검증 방법론' : 'Validation methodology'}</h3>
                <button className="text-text-secondary hover:text-white" onClick={() => setShowMethod(false)}>{isKorean ? '닫기' : 'Close'}</button>
              </div>
              <div className="text-text-secondary text-sm space-y-2">
                <p>{isKorean ? '매칭 정확도는 2023–2024 지원 데이터를 기반으로 한 보정 샘플(n=1,204)에서 교차검증으로 산출하였습니다.' : 'Match accuracy computed via cross‑validation on a calibrated 2023–2024 cohort (n=1,204).'}
                </p>
                <p>{isKorean ? '에세이 개선 효과는 전·후 비교(동일 학생군)에서 합격 연관 지표의 평균 변화율로 측정했습니다.' : 'Essay lift measured as average change in acceptance‑adjacent indicators in pre/post within‑student comparisons.'}
                </p>
                <p>{isKorean ? '재사용 정밀도는 서플리먼트 프롬프트 재사용 탐지에서 F1 점수로 보고합니다.' : 'Reuse precision reported as F1 in supplemental prompt reuse detection.'}
                </p>
                <p>{isKorean ? '체크리스트 도입에 따른 기한 준수 향상은 전/후 가중 평균 기반입니다.' : 'On‑time uplift from checklist adoption computed via weighted pre/post averages.'}
                </p>
                <p className="text-[11px]">{isKorean ? '본 수치는 지속적으로 업데이트되며 결과는 보장되지 않습니다.' : 'Metrics update over time and do not guarantee outcomes.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScientificOptimizer;

