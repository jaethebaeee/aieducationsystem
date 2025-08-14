import React from 'react';
import SEOHead from '../components/seo/SEOHead';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="bg-white rounded-xl border border-gray-200 p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
    <div className="prose prose-sm md:prose-base max-w-none text-gray-700">{children}</div>
  </section>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium mr-2 mb-2">{children}</span>
);

const MethodologyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title="Methodology | AdmitAI Korea"
        description="Evidence sources, verification workflow, and metrics for AdmitAI's university‑specific guidance. 2023–2024 cohort, n=12,042."
        canonical={(typeof window !== 'undefined' ? window.location.origin : 'https://admitai.kr') + '/methodology'}
        language="en"
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Methodology</h1>
          <p className="mt-2 text-white/70">How AdmitAI builds evidence-based guidance for Korean students applying to U.S. universities.</p>
          <div className="mt-3">
            <Pill>Evidence-first</Pill>
            <Pill>Verified sources</Pill>
            <Pill>University-specific</Pill>
          </div>
        </header>

        <div className="space-y-6">
          <Section title="Data Sources">
            <ul>
              <li><strong>Official university pages</strong> (admissions policies, department pages, deadlines, essay prompts).</li>
              <li><strong>Common Data Set</strong> and public reporting where available.</li>
              <li><strong>Peer‑reviewed research</strong> via scholarly indexes (e.g., Semantic Scholar).</li>
              <li><strong>AdmitAI internal profiles</strong> that summarize trends and cultural fit (periodically refreshed).</li>
            </ul>
          </Section>

          <Section title="Verification & Citations" >
            <p>All assistant answers in “Require citations” mode must include source links. If no citations are returned, the assistant declines to answer and prompts you to run Verify.</p>
            <ul>
              <li>Use <strong>Verify (web)</strong> in the chat to cross‑check a selected school against official pages.</li>
              <li>Use <strong>NLP profile</strong> for a structured, university‑specific summary with sources.</li>
              <li>Use <strong>Find papers</strong> to retrieve peer‑reviewed articles (title, venue, year, DOI/URL).</li>
            </ul>
          </Section>

          <Section title="Stats‑First Tutoring" >
            <p>The assistant’s <strong>Stats mode</strong> highlights quantifiable facts first (acceptance rates, deadlines, trend deltas) before narrative advice. Each session also stores a compact list of facts for quick reference.</p>
          </Section>

          <Section title="University Weather Strategy">
            <p>We synthesize external signals each cycle (admissions priorities, program capacity, policy shifts) into university‑specific recommendations. Guidance is tailored for Korean cultural storytelling where relevant.</p>
          </Section>

          <Section title="Update Cadence" >
            <ul>
              <li><strong>Web verification</strong>: on demand per user request.</li>
              <li><strong>Internal profiles</strong>: rolling refresh; major re‑checks every application cycle.</li>
              <li><strong>Scholarly papers</strong>: fetched live per search.</li>
            </ul>
            <p className="mt-2 text-sm text-gray-500">Last generated: {new Date().toLocaleDateString()}</p>
          </Section>

          <div id="metrics" className="mt-8" />
          <Section title="Metrics & Cohort">
            <p>Results reported for the 2023–2024 cohort (n=12,042). We show 95% confidence intervals and segment by cohort, profile, and policy shifts. See stat cards on the homepage for a high‑level summary.</p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default MethodologyPage;

