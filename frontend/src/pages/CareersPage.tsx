import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/seo/SEOHead';

type Role = {
  title: string;
  team: string;
  location: string;
  type: string;
  link?: string;
  summary?: string;
  responsibilities?: string[];
  requirements?: string[];
  applicationWindow?: string;
};

const ROLES: Role[] = [
  {
    title: 'Frontend Engineer (React)',
    team: 'Engineering',
    location: 'Seoul · Remote OK',
    type: 'Full-time',
    summary: 'Build student/parent experiences: dashboards, editor, and chat UI. Simple, fast, accessible.',
    responsibilities: [
      'Ship React features weekly (TS + Tailwind)',
      'Own small scopes end‑to‑end with good UX',
      'Keep the UI simple and measurable',
    ],
    requirements: [
      'Strong React + TypeScript fundamentals',
      'Taste for clean UI and accessibility',
      'Comfortable with async collaboration',
    ],
  },
  {
    title: 'Backend Engineer (Node/TS)',
    team: 'Engineering',
    location: 'Seoul · Remote OK',
    type: 'Full-time',
    summary: 'Own small APIs that are reliable and observable. Keep logic clear and testable.',
    responsibilities: [
      'Design minimal REST endpoints in Express',
      'Add metrics/logs and handle errors well',
      'Iterate quickly with product and research',
    ],
    requirements: [
      'Node.js, TypeScript, basic SQL familiarity',
      'Pragmatic approach to testing and logging',
      'Bias to ship and simplify',
    ],
  },
  {
    title: 'AI Prompt Engineer (KR/EN)',
    team: 'AI/Content',
    location: 'Remote',
    type: 'Contract/Part-time',
    summary: 'Craft KR/EN prompts for essays, fit, and timeline. Validate outputs with rubrics.',
    responsibilities: [
      'Design concise, consistent prompt templates',
      'Evaluate outputs against rubric (0–5)',
      'Document guidance in KR/EN for students/parents',
    ],
    requirements: [
      'Bilingual KR/EN; clear writing',
      'Admissions or education experience is a plus',
      'Structured thinking and measurement mindset',
    ],
  },
  {
    title: 'University Research Associate',
    team: 'Research',
    location: 'Seoul · Remote OK',
    type: 'Part-time',
    summary: 'Track university signals: tone, policies, aid trends; keep briefs fresh and useful.',
    responsibilities: [
      'Maintain concise university briefs',
      'Summarize changes in policies/aid',
      'Collaborate with product for feature updates',
    ],
    requirements: [
      'Strong reading/research habits',
      'Clear summaries; sources cited',
      'Care about practical usefulness',
    ],
  },
  {
    title: 'Software Engineer Intern (Frontend)',
    team: 'Engineering',
    location: 'Seoul · Remote OK',
    type: 'Internship',
    summary: 'Build delightful UI for student dashboards, editor, and internal tools. Learn fast, ship fast.',
    applicationWindow: 'Summer 2026 (12 weeks)',
    responsibilities: [
      'Implement features in React + TypeScript',
      'Write accessible, responsive UI with Tailwind',
      'Collaborate with product and research for quick iterations',
    ],
    requirements: [
      'Pursuing BS/MS in CS or related (or equivalent experience)',
      'Basic React/TS knowledge; portfolio or GitHub preferred',
      'Ownership mindset and curiosity',
    ],
  },
  {
    title: 'Software Engineer Intern (Backend)',
    team: 'Engineering',
    location: 'Seoul · Remote OK',
    type: 'Internship',
    summary: 'Own small API endpoints and data tasks. Focus on clarity, reliability, and observability.',
    applicationWindow: 'Summer 2026 (12 weeks)',
    responsibilities: [
      'Build REST endpoints in Node/Express (TS)',
      'Add basic metrics/logging; handle errors correctly',
      'Write concise tests for critical logic',
    ],
    requirements: [
      'Pursuing BS/MS in CS or related (or equivalent experience)',
      'Comfort with Node/TypeScript; SQL basics a plus',
      'Bias to learn and ship',
    ],
  },
  {
    title: 'Product Design Intern',
    team: 'Design',
    location: 'Seoul · Remote OK',
    type: 'Internship',
    summary: 'Design clear, measurable flows for essays, recommendations, and onboarding.',
    applicationWindow: 'Summer 2026 (12 weeks)',
    responsibilities: [
      'Create wireframes and hi‑fi mocks (Figma)',
      'Partner with engineers to deliver pixel‑aware components',
      'Run lightweight usability tests',
    ],
    requirements: [
      'Portfolio showing clarity and systems thinking',
      'Basic understanding of accessibility and metrics',
      'Collaborative mindset',
    ],
  },
  {
    title: 'University Research Intern',
    team: 'Research',
    location: 'Seoul · Remote OK',
    type: 'Internship',
    summary: 'Track policy signals, deadlines, and program priorities. Keep briefs timely and accurate.',
    applicationWindow: 'Summer 2026 (8–12 weeks)',
    responsibilities: [
      'Maintain up‑to‑date university briefs',
      'Summarize policy/aid changes with sources',
      'Work with product to inform recommendations',
    ],
    requirements: [
      'Strong research/writing; KR/EN reading comprehension',
      'Attention to detail; bias to useful summaries',
      'Curiosity about higher‑ed trends',
    ],
  },
];

const BENEFITS = [
  'Remote‑first, async‑friendly',
  'Flexible hours around KR time zone',
  'Work from anywhere in KR/US time zones',
  'Career development stipend',
  'Annual offsite in Seoul',
  'Learning stipend for AI tools/courses',
  'Hardware budget on joining',
  'Impact: ship features students and parents use weekly',
];

const VALUES = [
  'Student‑first: real outcomes over vanity metrics',
  'Context‑aware: culture and university fit matter',
  'Bias to ship: simple, reliable, measurable',
  'Kind candor: direct feedback, respectful tone',
];

const STEPS = [
  { step: '01', title: 'Apply', desc: 'Send your CV/LinkedIn + 3 bullets on why AdmitAI Korea.' },
  { step: '02', title: 'Portfolio/Task', desc: 'Short take‑home or repo walkthrough (keep it simple).' },
  { step: '03', title: 'Team Chat', desc: 'Meet 2–3 teammates. Culture and impact focus.' },
  { step: '04', title: 'Offer', desc: 'Fast decision. We value your time.' },
];

const CareersPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [team, setTeam] = useState<string>('All');
  const [location, setLocation] = useState<string>('All');
  const [roleType, setRoleType] = useState<string>('All');

  const teams = useMemo(() => ['All', ...Array.from(new Set(ROLES.map(r => r.team)))], []);
  const locations = useMemo(() => ['All', ...Array.from(new Set(ROLES.map(r => r.location)))], []);
  const types = useMemo(() => ['All', ...Array.from(new Set(ROLES.map(r => r.type)))], []);

  const filtered = useMemo(() => {
    return ROLES.filter(r => {
      if (team !== 'All' && r.team !== team) return false;
      if (location !== 'All' && r.location !== location) return false;
      if (roleType !== 'All' && r.type !== roleType) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const blob = `${r.title} ${r.team} ${r.location} ${r.type} ${r.summary || ''}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [query, team, location, roleType]);

  function slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const TEAM_ACCENTS: Record<string, { bar: string; badge: string; chipDot: string; chipText: string }>= {
    Engineering: { bar: 'bg-blue-500', badge: 'bg-blue-500/15 text-blue-300', chipDot: 'bg-blue-400', chipText: 'text-blue-200' },
    Research: { bar: 'bg-emerald-500', badge: 'bg-emerald-500/15 text-emerald-300', chipDot: 'bg-emerald-400', chipText: 'text-emerald-200' },
    'AI/Content': { bar: 'bg-purple-500', badge: 'bg-purple-500/15 text-purple-300', chipDot: 'bg-purple-400', chipText: 'text-purple-200' },
    Design: { bar: 'bg-pink-500', badge: 'bg-pink-500/15 text-pink-300', chipDot: 'bg-pink-400', chipText: 'text-pink-200' },
    default: { bar: 'bg-indigo-500', badge: 'bg-indigo-500/15 text-indigo-300', chipDot: 'bg-indigo-400', chipText: 'text-indigo-200' },
  };

  return (
    <div className="text-white bg-[#0f1115]">
      <SEOHead
        title="채용 | AdmitAI Korea"
        description="AdmitAI Korea 채용 — 한국 학생과 부모를 돕는 입시 AI 제품을 함께 만드실 분을 찾습니다."
        canonical="https://admitai.kr/careers"
        ogImage="/og-image.jpg"
        language="ko"
      />
      {/* Sticky mobile Apply button */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 px-4 z-40">
        <a href="#open-roles" className="block text-center w-full px-5 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium shadow-lg">
          Apply Now
        </a>
      </div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 px-6 bg-gradient-to-b from-[#151826] via-[#121420] to-[#0f1115]">
        {/* subtle animated acceptances in background */}
        <style>{`
          @keyframes verticalMarquee { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        `}</style>
        <div className="pointer-events-none absolute right-4 top-10 hidden lg:block h-[220px] w-64 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div
            className="absolute inset-0 p-4 space-y-3 text-sm text-white/80"
            style={{ animation: 'verticalMarquee 18s linear infinite' as any }}
          >
            {['Stanford — CS','Harvard — Economics','MIT — EECS','Yale — History','Princeton — Math','Columbia — Engineering','Cornell — ORIE','Brown — Public Health','UPenn — Finance','Dartmouth — Biology','Duke — Statistics','UCLA — Data Sci'].concat(['Stanford — CS','Harvard — Economics','MIT — EECS','Yale — History','Princeton — Math','Columbia — Engineering']).map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400/80" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1115]/60 via-transparent to-[#0f1115]/60" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Help thousands of students achieve their dream schools — one AI breakthrough at a time.</h1>
          <p className="mt-4 text-text-secondary max-w-3xl">
            We build context‑aware AI for essays, strategy, and fit — tailored for Korean students and parents. Simple product, measurable impact.
          </p>
          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
            <a href="#open-roles" className="px-5 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium">See open roles</a>
            <a href="mailto:hiring@admitai.kr" className="px-5 py-3 border border-white/20 hover:border-white/40 rounded-lg font-medium text-text-secondary hover:text-white">Email hiring@admitai.kr</a>
            {/* testimonial bubble */}
            <div className="md:ml-4 mt-2 md:mt-0 max-w-md bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-sm text-white/90">“I shipped student‑impact features in my first 2 weeks. Clear scope, fast feedback, real users.”</p>
              <div className="mt-2 text-xs text-white/60">— Product Engineer, Seoul</div>
            </div>
          </div>
        </div>
      </section>

      {/* Press & Awards */}
      <section className="py-14 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Press & awards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#14161f] border border-white/10">
              <div className="text-sm text-white/80">EdTech Korea</div>
              <div className="text-white font-semibold mt-1">Top Emerging Startup 2025</div>
            </div>
            <div className="p-5 rounded-xl bg-[#14161f] border border-white/10">
              <div className="text-sm text-white/80">Startup Seoul</div>
              <div className="text-white font-semibold mt-1">AI for Education Finalist</div>
            </div>
            <div className="p-5 rounded-xl bg-[#14161f] border border-white/10">
              <div className="text-sm text-white/80">Global Admissions Expo</div>
              <div className="text-white font-semibold mt-1">Innovation Showcase</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work Here */}
      <section className="py-14 px-6 border-t border-white/10 bg-[#101219]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: copy, values, stats */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Why work here</h2>
            <p className="text-text-secondary mb-4">
              Build tools that meaningfully improve Korean students’ chances at U.S. universities. Ship fast, measure outcomes, learn together.
            </p>
            {/* Core values chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {VALUES.map((v) => (
                <span key={v} className="text-xs px-2.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/80">
                  {v}
                </span>
              ))}
            </div>
            {/* Impact stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#14161f] border border-white/10 text-center">
                <div className="text-2xl font-bold text-white">3,200+</div>
                <div className="text-xs text-text-secondary mt-1">Students helped</div>
              </div>
              <div className="p-4 rounded-xl bg-[#14161f] border border-white/10 text-center">
                <div className="text-2xl font-bold text-white">Top 50</div>
                <div className="text-xs text-text-secondary mt-1">U.S. universities</div>
              </div>
              <div className="p-4 rounded-xl bg-[#14161f] border border-white/10 text-center">
                <div className="text-2xl font-bold text-white">94%</div>
                <div className="text-xs text-text-secondary mt-1">Satisfaction rate</div>
              </div>
            </div>
          </div>
          {/* Right: collage (placeholder photos) */}
          <div className="relative h-64 md:h-72">
            <div className="absolute left-0 top-4 w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-purple-500/40 to-blue-500/40 rounded-2xl border border-white/10 backdrop-blur-sm" />
            <div className="absolute right-0 top-0 w-44 h-28 md:w-56 md:h-36 bg-gradient-to-br from-emerald-400/40 to-teal-500/40 rounded-2xl border border-white/10 backdrop-blur-sm" />
            <div className="absolute left-12 bottom-0 w-56 h-32 md:w-64 md:h-40 bg-gradient-to-br from-pink-500/40 to-indigo-500/40 rounded-2xl border border-white/10 backdrop-blur-sm" />
            <div className="absolute inset-0 pointer-events-none rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Open roles</h2>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="bg-[#14161f] border border-white/10 rounded-lg p-3 text-white placeholder-white/40"
              placeholder="Search roles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="bg-[#14161f] border border-white/10 rounded-lg p-3 text-white" value={team} onChange={(e)=>setTeam(e.target.value)}>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="bg-[#14161f] border border-white/10 rounded-lg p-3 text-white" value={location} onChange={(e)=>setLocation(e.target.value)}>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="bg-[#14161f] border border-white/10 rounded-lg p-3 text-white" value={roleType} onChange={(e)=>setRoleType(e.target.value)}>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((r) => (
              <div
                key={`${r.title}-${r.team}`}
                className="group p-6 rounded-2xl border border-white/10 hover:border-white/25 bg-[#14161f] transition space-y-3 relative overflow-hidden"
              >
                {/* team accent bar */}
                <div className={`absolute inset-x-0 top-0 h-1 ${(TEAM_ACCENTS[r.team]?.bar) || TEAM_ACCENTS.default.bar}`} />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-white flex items-center gap-2">
                      {r.title}
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${(TEAM_ACCENTS[r.team]?.badge) || TEAM_ACCENTS.default.badge}`}>{r.team}</span>
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">{r.type}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80 whitespace-nowrap border border-white/10">{r.location}</span>
                </div>
                {r.summary && (
                  <p className="text-sm text-white/80">{r.summary}</p>
                )}
                {r.applicationWindow && (
                  <p className="text-xs text-text-muted">Application window: {r.applicationWindow}</p>
                )}
                {/* perk chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {r.location.toLowerCase().includes('remote') && (
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border border-white/10 bg-white/5 ${(TEAM_ACCENTS[r.team]?.chipText) || TEAM_ACCENTS.default.chipText}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${(TEAM_ACCENTS[r.team]?.chipDot) || TEAM_ACCENTS.default.chipDot}`} /> Remote OK
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border border-white/10 bg-white/5 ${(TEAM_ACCENTS[r.team]?.chipText) || TEAM_ACCENTS.default.chipText}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${(TEAM_ACCENTS[r.team]?.chipDot) || TEAM_ACCENTS.default.chipDot}`} /> Flexible Hours
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border border-white/10 bg-white/5 ${(TEAM_ACCENTS[r.team]?.chipText) || TEAM_ACCENTS.default.chipText}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${(TEAM_ACCENTS[r.team]?.chipDot) || TEAM_ACCENTS.default.chipDot}`} /> Equity
                  </span>
                </div>
                <details className="rounded-xl bg-black/20 border border-white/10 open:border-white/20">
                  <summary className="cursor-pointer select-none list-none px-3 py-2 text-sm text-white/90">View details</summary>
                  <div className="px-4 pb-4 pt-2 space-y-4">
                    {r.responsibilities && r.responsibilities.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold mb-1">You will</div>
                        <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                          {r.responsibilities.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {r.requirements && r.requirements.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold mb-1">Requirements</div>
                        <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                          {r.requirements.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="pt-1">
                      <Link
                        to={`/careers/apply/${slugify(r.title)}?team=${encodeURIComponent(r.team)}&title=${encodeURIComponent(r.title)}`}
                        className="inline-flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium"
                      >
                        Apply
                      </Link>
                    </div>
                  </div>
                </details>
                {/* micro-CTA always visible */}
                <div className="pt-2">
                  <Link
                    to={`/careers/apply/${slugify(r.title)}?team=${encodeURIComponent(r.team)}&title=${encodeURIComponent(r.title)}`}
                    className="inline-flex items-center px-3 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-text-secondary">Don’t see a fit? Send a general application to <a className="underline" href="mailto:hiring@admitai.kr">hiring@admitai.kr</a>.</p>
        </div>
      </section>

      {/* Internship Program */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Internship program (Google‑level rigor, startup speed)</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
            <div className="p-4 rounded-xl bg-[#14161f] border border-white/10"><div className="text-purple-300 font-mono">Jan–Feb</div><div className="text-white/90 mt-1">Applications open</div><div className="text-text-secondary">Resume + portfolio (optional)</div></div>
            <div className="p-4 rounded-xl bg-[#14161f] border border-white/10"><div className="text-purple-300 font-mono">Feb–Mar</div><div className="text-white/90 mt-1">Online assessment</div><div className="text-text-secondary">Short task or code screen</div></div>
            <div className="p-4 rounded-xl bg-[#14161f] border border-white/10"><div className="text-purple-300 font-mono">Mar</div><div className="text-white/90 mt-1">Interviews</div><div className="text-text-secondary">Behavioral + role fit</div></div>
            <div className="p-4 rounded-xl bg-[#14161f] border border-white/10"><div className="text-purple-300 font-mono">Apr</div><div className="text-white/90 mt-1">Offers</div><div className="text-text-secondary">Fast decisions</div></div>
            <div className="p-4 rounded-xl bg-[#14161f] border border-white/10"><div className="text-purple-300 font-mono">Jun–Aug</div><div className="text-white/90 mt-1">Internship</div><div className="text-text-secondary">12 weeks · Seoul/Remote</div></div>
          </div>
          <div className="mt-4 text-text-secondary text-sm">Conversion opportunities based on performance and business need.</div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-disc list-inside text-text-secondary">
            {BENEFITS.map((b) => (
              <li key={b} className="bg-[#14161f] border border-white/10 rounded-xl p-4 text-white/80">{b}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Culture & Values */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Culture & values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VALUES.map((v) => (
              <div key={v} className="p-5 rounded-xl border border-white/10 bg-[#14161f] text-white/80">{v}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Hiring process</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STEPS.map((s) => (
              <li key={s.step} className="p-5 rounded-xl border border-white/10 bg-[#14161f]">
                <div className="text-purple-400 text-sm font-mono">{s.step}</div>
                <div className="text-lg font-semibold mt-1">{s.title}</div>
                <div className="text-text-secondary mt-1">{s.desc}</div>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <a href="mailto:hiring@admitai.kr" className="px-5 py-3 bg-white/10 hover:bg-white/15 rounded-lg font-medium">Apply via email</a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-semibold">Build admissions tools that actually help families</h3>
          <p className="text-text-secondary mt-2">Short cycles. Real users. Measurable outcomes.</p>
          <div className="mt-5 flex justify-center gap-3">
            <a href="#open-roles" className="px-5 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium">See open roles</a>
            <a href="mailto:hiring@admitai.kr" className="px-5 py-3 border border-white/20 hover:border-white/40 rounded-lg font-medium text-text-secondary hover:text-white">Email us</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;

