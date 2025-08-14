import React from 'react';

const EvidencePanel: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/80">Local LLM</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/80">Cited Sources</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/80">Methodology v1.2</span>
      </div>

      {/* Chart + Metrics Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Mini chart placeholder spanning 1 col on mobile, 1 col on md, but we want it larger: use col-span-1 md:col-span-1 lg:col-span-1? We'll span 1, metrics take 2 each */}
        <div className="md:col-span-1">
          <div className="relative h-40 rounded-xl bg-gradient-to-b from-white/10 to-black/20 border border-white/10 overflow-hidden">
            <div className="absolute right-2 top-2 px-2 py-1 rounded bg-black/40 border border-white/10 text-[10px] text-white/70">± CI</div>
            <div className="absolute inset-x-4 bottom-4 h-24 bg-gradient-to-t from-purple-500/20 via-purple-500/10 to-transparent rounded-t-xl">
              <div className="absolute bottom-0 left-0 right-0 h-24">
                <svg viewBox="0 0 200 100" className="w-full h-full opacity-90">
                  <path d="M0 80 C 40 70, 80 60, 120 55 S 180 45, 200 40" fill="none" stroke="#a78bfa" strokeWidth="3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="md:col-span-1">
          <div className="h-40 rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs text-white/60">Match accuracy</p>
              <p className="text-2xl font-bold text-white">93.4%</p>
            </div>
            <p className="text-[10px] text-white/50">95% CI ±1.8% (n=1,204)</p>
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="h-40 rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs text-white/60">Essay lift</p>
              <p className="text-2xl font-bold text-white">+27%</p>
            </div>
            <p className="text-[10px] text-white/50">acceptance-adjacent indicators</p>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="h-40 rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs text-white/60">Reuse precision</p>
              <p className="text-2xl font-bold text-white">0.89</p>
            </div>
            <p className="text-[10px] text-white/50">F1 on prompt reuse detection</p>
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="h-40 rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs text-white/60">On-time uplift</p>
              <p className="text-2xl font-bold text-white">+41%</p>
            </div>
            <p className="text-[10px] text-white/50">after checklist adoption</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-[11px] text-white/40">We are an optimizer, not a guarantee. Results vary by cohort, profile, and policy shifts.</p>
    </div>
  );
};

export default EvidencePanel;

