import React, { useMemo, useState } from 'react';
import SEOHead from '../../components/seo/SEOHead';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

type Step = 1 | 2 | 3 | 4;

const inputBase = 'w-full bg-[#14161f] border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30';
const btnPrimary = 'px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium';
const btnGhost = 'px-4 py-2 border border-white/20 text-text-secondary hover:text-white hover:border-white/40 rounded-lg text-sm';

const JobApplyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);

  const roleTitle = useMemo(() => search.get('title') || (slug || '').split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '), [slug, search]);
  const roleTeam = useMemo(() => search.get('team') || 'General', [search]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    resumeText: '',
    linkedin: '',
    portfolio: '',
    qMotivation: '',
    qImpact: '',
    qTimeline: '',
  });

  const next = () => setStep((s) => (s === 4 ? 4 : ((s + 1) as Step)));
  const prev = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as Step)));

  const canNext = useMemo(() => {
    if (step === 1) return !!(form.firstName && form.lastName && form.email);
    if (step === 2) return !!(form.resumeText);
    if (step === 3) return !!(form.qMotivation && form.qImpact);
    return true;
  }, [step, form]);

  const submit = async () => {
    setSubmitting(true);
    try {
      // send to backend
      await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: roleTitle,
          roleTeam: roleTeam,
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          link: form.linkedin || form.portfolio,
          message: [form.resumeText, form.qMotivation, form.qImpact, form.qTimeline].filter(Boolean).join('\n\n'),
        }),
      });
      navigate('/careers?applied=1');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      <SEOHead title={`${roleTitle || 'Apply'} | AdmitAI Korea`} noIndex language="en" />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-6">
          <p className="text-text-muted text-sm">Apply to</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{roleTitle || 'Role'}</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {[1,2,3,4].map((i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-indigo-500 w-24' : 'bg-white/10 w-14'}`} />
          ))}
        </div>

        <div className="bg-[#0e1016] border border-white/10 rounded-2xl p-6">
          {step === 1 && (
            <div className="grid gap-3">
              <div className="grid md:grid-cols-2 gap-3">
                <input className={inputBase} placeholder="First name" value={form.firstName} onChange={(e)=>setForm({...form, firstName: e.target.value})} />
                <input className={inputBase} placeholder="Last name" value={form.lastName} onChange={(e)=>setForm({...form, lastName: e.target.value})} />
              </div>
              <input className={inputBase} placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
              <div className="grid md:grid-cols-2 gap-3">
                <input className={inputBase} placeholder="Phone (optional)" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} />
                <input className={inputBase} placeholder="Location (City, Country)" value={form.location} onChange={(e)=>setForm({...form, location: e.target.value})} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input className={inputBase} placeholder="LinkedIn (optional)" value={form.linkedin} onChange={(e)=>setForm({...form, linkedin: e.target.value})} />
                <input className={inputBase} placeholder="Portfolio/GitHub (optional)" value={form.portfolio} onChange={(e)=>setForm({...form, portfolio: e.target.value})} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3">
              <p className="text-text-secondary text-sm">Paste resume or key experience (we’ll ask for a PDF later).</p>
              <textarea className={`${inputBase} min-h-[220px]`} placeholder="Summary of experience, skills, projects…" value={form.resumeText} onChange={(e)=>setForm({...form, resumeText: e.target.value})} />
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-3">
              <textarea className={inputBase} placeholder="Why AdmitAI Korea? (2–4 sentences)" value={form.qMotivation} onChange={(e)=>setForm({...form, qMotivation: e.target.value})} />
              <textarea className={inputBase} placeholder="Impact you’re proud of (3–6 lines)" value={form.qImpact} onChange={(e)=>setForm({...form, qImpact: e.target.value})} />
              <textarea className={inputBase} placeholder="Earliest start date / timeline (optional)" value={form.qTimeline} onChange={(e)=>setForm({...form, qTimeline: e.target.value})} />
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-2 text-sm">
              <p className="text-text-secondary">Review</p>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white font-medium">{form.firstName} {form.lastName}</p>
                <p className="text-text-muted">{form.email}{form.phone ? ` · ${form.phone}` : ''}</p>
                <p className="text-text-muted">{form.location}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white font-medium">Experience</p>
                <p className="text-text-secondary whitespace-pre-wrap">{form.resumeText || '—'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white font-medium">Motivation & impact</p>
                <p className="text-text-secondary whitespace-pre-wrap">{form.qMotivation || '—'}</p>
                <p className="text-text-secondary whitespace-pre-wrap">{form.qImpact || '—'}</p>
                <p className="text-text-secondary whitespace-pre-wrap">{form.qTimeline || ''}</p>
              </div>
              <div className="bg-indigo-600/10 border border-indigo-700/30 rounded-lg p-3 text-indigo-200">
                Once you submit, we’ll review your application. If it’s a strong fit, we will email you next steps.
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between">
          <button onClick={step === 1 ? () => navigate('/careers') : prev} className={btnGhost}>Back</button>
          {step < 4 ? (
            <button onClick={next} className={`${btnPrimary} ${!canNext ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!canNext}>Continue →</button>
          ) : (
            <button onClick={submit} className={`${btnPrimary} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={submitting}>{submitting ? 'Submitting…' : 'Submit application'}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplyPage;

