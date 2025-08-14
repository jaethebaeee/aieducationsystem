import React, { useEffect, useMemo, useState } from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore, ApplicationPlan } from '../../services/onboardingStore';
import api, { onboardingAPI, essaysAPI, planAPI } from '../../services/api';
import { toast } from 'react-toastify';
import ChatDock from '../../components/chat/ChatDock';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const StepIndicator: React.FC<{ step: number; total: number; }> = ({ step, total }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="text-gray-600 text-sm">Step {Math.min(step + 1, total)} of {total}</div>
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${i < step ? 'bg-blue-600 w-20' : 'bg-gray-200 w-12'}`}
        />
      ))}
    </div>
  </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode; subtitle?: string; }>
  = ({ title, children, subtitle }) => (
  <Card variant="dark">
    <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight mb-1">{title}</h3>
    {subtitle && <p className="text-text-secondary mb-5">{subtitle}</p>}
    {children}
  </Card>
);

const inputBase = "bg-white/5 border border-white/10 rounded-lg p-3.5 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30";
const selectBase = inputBase;

const AdvisorOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { answers, setAnswer, addTargetCollege, removeTargetCollege, addActivity, removeActivity } = useOnboardingStore();
  const [step, setStep] = useState(0);
  const totalSteps = 5; // 0=Quick Setup, then 1..4 existing
  const [essaysCount, setEssaysCount] = useState<number | null>(null);
  const [checkingEssays, setCheckingEssays] = useState(false);
  // Prefill state flag to avoid overwriting user edits mid-session
  const [prefilled, setPrefilled] = useState(false);

  const next = () => setStep((s) => Math.min(totalSteps, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const isStep1Valid = useMemo(() => {
    return Boolean(answers.fullName && answers.graduationYear && answers.region && answers.intendedMajor);
  }, [answers.fullName, answers.graduationYear, answers.region, answers.intendedMajor]);

  const isStep2Valid = useMemo(() => {
    return answers.targetColleges.length > 0 && Boolean(answers.budget);
  }, [answers.targetColleges, answers.budget]);

  const isStep3Valid = useMemo(() => {
    return answers.activities.length >= 1; // encourage 3–5, but allow proceed with at least 1
  }, [answers.activities]);

  const canContinue = useMemo(() => {
    if (step === 1) return isStep1Valid;
    if (step === 2) return isStep2Valid;
    if (step === 3) return isStep3Valid;
    return true;
  }, [step, isStep1Valid, isStep2Valid, isStep3Valid]);

  const canFinish = useMemo(() => {
    // Allow finishing without essays; we'll nudge drafts on dashboard
    return isStep1Valid && isStep2Valid && isStep3Valid;
  }, [isStep1Valid, isStep2Valid, isStep3Valid]);

  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(!!answers.alertsDeadlines);
  const [sendToParent, setSendToParent] = useState<boolean>(!!answers.parentUpdates?.enabled && !!answers.parentUpdates?.contact);
  const [finishing, setFinishing] = useState(false);

  const complete = async () => {
    try {
      setFinishing(true);
      // Map onboarding store to backend profile shape
      const [firstName, ...restNames] = (answers.fullName || '').trim().split(' ');
      const lastName = restNames.join(' ') || undefined;

      const payload = {
        firstName: firstName || undefined,
        lastName,
        schoolName: answers.currentSchool || undefined,
        graduationYear: answers.graduationYear || undefined,
        gpa: answers.gpa,
        satScore: answers.sat,
        actScore: answers.act,
        targetSchools: answers.targetColleges.map(c => c.name),
        // Minimal extracurricular mapping based on activities
        extracurriculars: answers.activities.map(a => ({
          name: a.title,
          description: a.description || '',
          role: a.role || a.category,
          duration: a.duration || '',
          impact: a.impactLevel || '',
        })),
      };

      const res = await onboardingAPI.saveProfile(payload);
      if (!res.success) {
        throw new Error(res.error || res.message || 'Failed to save profile');
      }
      // Kick off plan bootstrap (202 Accepted expected)
      await planAPI.bootstrap({
        targets: answers.targetColleges.map(c => ({ id: c.id, name: c.name, plan: c.plan })),
        profile: payload,
        generate: { insights: true, essays: true, deadlines: true, resources: true },
        notify: { alerts: alertsEnabled, parent: sendToParent }
      }).catch(() => undefined);

      toast.success('Personalizing your dashboard…');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to complete onboarding';
      toast.error(message);
    }
    finally {
      setFinishing(false);
    }
  };

  // Check essays readiness when entering review step
  useEffect(() => {
    if (step === 4) {
      setCheckingEssays(true);
      essaysAPI.getAll()
        .then((res) => {
          if (res.success && res.data) {
            // essaysAPI returns { data: EssaysResponse }; adapt to shape if needed
            const maybeArray = (res.data as any).essays || (res.data as any).data || res.data;
            const count = Array.isArray(maybeArray) ? maybeArray.length : 0;
            setEssaysCount(count);
          } else {
            setEssaysCount(0);
          }
        })
        .catch(() => setEssaysCount(0))
        .finally(() => setCheckingEssays(false));
    }
  }, [step]);

  // Prefill from existing profile once on mount
  useEffect(() => {
    if (prefilled) return;
    (async () => {
      try {
        const res = await api.get<any>('/users/profile');
        if (!res.success || !res.data) return;
        const u = res.data as any;
        // Basic info
        if (!answers.fullName && (u.firstName || u.lastName)) {
          const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
          setAnswer('fullName', name);
        }
        if (!answers.currentSchool && u.profile?.schoolName) {
          setAnswer('currentSchool', u.profile.schoolName);
        }
        if (!answers.graduationYear && u.profile?.graduationYear) {
          setAnswer('graduationYear', Number(u.profile.graduationYear) as any);
        }
        if (answers.gpa === undefined && typeof u.profile?.gpa === 'number') {
          setAnswer('gpa', u.profile.gpa);
        }
        if (answers.sat === undefined && typeof u.profile?.satScore === 'number') {
          setAnswer('sat', u.profile.satScore);
        }
        if (answers.act === undefined && typeof u.profile?.actScore === 'number') {
          setAnswer('act', u.profile.actScore);
        }
        // Targets
        if (answers.targetColleges.length === 0 && Array.isArray(u.profile?.targetSchools)) {
          const mapped = (u.profile.targetSchools as string[]).map((name: string) => ({
            id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name,
            plan: 'RD' as ApplicationPlan,
          }));
          if (mapped.length > 0) {
            setAnswer('targetColleges', mapped as any);
          }
        }
        // Activities
        if (answers.activities.length === 0 && Array.isArray(u.profile?.extracurriculars)) {
          const mappedActs = (u.profile.extracurriculars as any[]).map((ec) => ({
            id: ec.id || crypto.randomUUID(),
            title: ec.name || '',
            category: 'Other',
            description: ec.description || '',
            role: ec.role || undefined,
            duration: ec.duration || undefined,
            impactLevel: (ec.impact || '') as any,
          }));
          if (mappedActs.length > 0) {
            setAnswer('activities', mappedActs as any);
          }
        }
        setPrefilled(true);
      } catch {
        // ignore prefill errors
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepTitles = ['Quick Setup', 'Basic Information', 'Target Colleges', 'Activities & Achievements', 'Review'];

  return (
    <OnboardingLayout currentStep={stepTitles[step]} completedSteps={stepTitles.slice(0, step)}>
      <PrivateSEO title="Advisor Onboarding" language="en" />
      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-24">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="heading-1 text-english">Tell us about your journey</h1>
          <p className="body-large text-text-secondary">We’ll personalize your dashboard, deadlines, and story strategy in under 5 minutes.</p>
        </div>

        <StepIndicator step={step} total={totalSteps} />

        {/* Step Content */}
        {step === 0 && (
          <div className="grid gap-6">
            <SectionCard title="Quick Setup" subtitle="A few high-signal details to personalize your plan">
              <div className="grid md:grid-cols-3 gap-3">
                <select className={selectBase} value={answers.curriculum ?? ''} onChange={(e)=>setAnswer('curriculum', e.target.value as any)}>
                  <option value="" disabled>Curriculum</option>
                  {['AP','IB','A-level','Korean','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className={selectBase} value={answers.gpaType ?? ''} onChange={(e)=>setAnswer('gpaType', e.target.value as any)}>
                  <option value="" disabled>GPA Type</option>
                  {['Weighted','Unweighted'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="relative group">
                  <input className={inputBase} placeholder="Class rank percentile (optional)" type="number" min={1} max={100} value={answers.classRankPercentile ?? ''} onChange={(e)=>setAnswer('classRankPercentile', e.target.value ? Number(e.target.value) : undefined)} />
                  <div className="pointer-events-none absolute -top-2 right-2 text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">Helps estimate competitiveness</div>
                </div>

                <select className={selectBase} value={answers.citizenship ?? ''} onChange={(e)=>setAnswer('citizenship', e.target.value as any)}>
                  <option value="" disabled>Citizenship</option>
                  {['Korean','US','Dual','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input className={inputBase} placeholder="Visa status (if applicable)" value={answers.visaStatus ?? ''} onChange={(e)=>setAnswer('visaStatus', e.target.value)} />
                <div className="relative group">
                  <select className={selectBase} value={answers.edRiskTolerance ?? ''} onChange={(e)=>setAnswer('edRiskTolerance', e.target.value as any)}>
                    <option value="" disabled>ED/REA risk tolerance</option>
                    {['Low','Medium','High'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="pointer-events-none absolute -top-2 right-2 text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">How comfortable are you with binding Early plans?</div>
                </div>

                <select className={selectBase} value={answers.campusSize ?? ''} onChange={(e)=>setAnswer('campusSize', e.target.value as any)}>
                  <option value="" disabled>Campus size</option>
                  {['Small','Medium','Large'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className={selectBase} value={answers.campusSetting ?? ''} onChange={(e)=>setAnswer('campusSetting', e.target.value as any)}>
                  <option value="" disabled>Campus setting</option>
                  {['Urban','Suburban','Rural'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className={selectBase} value={answers.climatePreference ?? ''} onChange={(e)=>setAnswer('climatePreference', e.target.value as any)}>
                  <option value="" disabled>Climate</option>
                  {['Warm','Mild','Cold'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <div className="md:col-span-3 grid md:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 text-gray-900"><input type="checkbox" className="accent-blue-600" checked={!!answers.hooks?.firstGen} onChange={(e)=>setAnswer('hooks', { ...(answers.hooks||{}), firstGen: e.target.checked })} /> First-gen</label>
                    <label className="flex items-center gap-2 text-gray-900"><input type="checkbox" className="accent-blue-600" checked={!!answers.hooks?.legacy} onChange={(e)=>setAnswer('hooks', { ...(answers.hooks||{}), legacy: e.target.checked })} /> Legacy</label>
                    <label className="flex items-center gap-2 text-gray-900"><input type="checkbox" className="accent-blue-600" checked={!!answers.hooks?.athlete} onChange={(e)=>setAnswer('hooks', { ...(answers.hooks||{}), athlete: e.target.checked })} /> Athlete</label>
                  {answers.hooks?.athlete && (
                     <input className={`md:col-span-2 ${inputBase}`} placeholder="Sport & level (e.g., Tennis, national)" value={answers.hooks?.athleteSport || ''} onChange={(e)=>setAnswer('hooks', { ...(answers.hooks||{}), athleteSport: e.target.value })} />
                  )}
                    <label className="flex items-center gap-2 text-gray-900"><input type="checkbox" className="accent-blue-600" checked={!!answers.hooks?.arts} onChange={(e)=>setAnswer('hooks', { ...(answers.hooks||{}), arts: e.target.checked })} /> Arts</label>
                  {answers.hooks?.arts && (
                     <input className={`md:col-span-2 ${inputBase}`} placeholder="Arts area (e.g., Violin, Painting)" value={answers.hooks?.artsArea || ''} onChange={(e)=>setAnswer('hooks', { ...(answers.hooks||{}), artsArea: e.target.value })} />
                  )}
                </div>

                <div className="md:col-span-3 grid md:grid-cols-3 gap-3">
                    {(answers.identityThemes || []).map((t, i) => (
                    <input key={i} className={inputBase} placeholder={`Identity theme ${i+1}`} value={t || ''} onChange={(e)=>{
                      const next = [...(answers.identityThemes||['','',''])];
                      next[i] = e.target.value;
                      setAnswer('identityThemes', next as any);
                    }} />
                  ))}
                </div>

                <textarea className={`${inputBase} md:col-span-3`} placeholder="Awards & honors (optional)" rows={3} value={answers.awards || ''} onChange={(e)=>setAnswer('awards', e.target.value)} />

                <input className={inputBase} placeholder="Weekly essay hours (optional)" type="number" value={answers.weeklyEssayHours ?? ''} onChange={(e)=>setAnswer('weeklyEssayHours', e.target.value ? Number(e.target.value) : undefined)} />
                <select multiple className={`${selectBase} md:col-span-2`} value={(answers.applicationPlatforms||[]) as any} onChange={(e)=>{
                  const items = Array.from(e.target.selectedOptions).map(o=>o.value);
                  setAnswer('applicationPlatforms', items as any);
                }}>
                  {['Common App','UC','Coalition'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <select className={selectBase} value={answers.languagePreference ?? ''} onChange={(e)=>setAnswer('languagePreference', e.target.value as any)}>
                  <option value="" disabled>Language preference</option>
                  <option value="ko">Korean</option>
                  <option value="en">English</option>
                  <option value="both">Both</option>
                </select>
                <label className="flex items-center gap-2 text-gray-900">
                  <input type="checkbox" className="accent-blue-600" checked={!!answers.parentUpdates?.enabled} onChange={(e)=>setAnswer('parentUpdates', { ...(answers.parentUpdates||{ enabled:false, contact:'' }), enabled: e.target.checked })} /> Parent updates
                </label>
                {answers.parentUpdates?.enabled && (
                  <input className={`md:col-span-2 ${inputBase}`} placeholder="Parent Kakao/phone" value={answers.parentUpdates?.contact || ''} onChange={(e)=>setAnswer('parentUpdates', { ...(answers.parentUpdates||{ enabled:true, contact:'' }), contact: e.target.value })} />
                )}

                <div className="md:col-span-3">
                  <label className="flex items-center gap-2 text-gray-900">
                    <input type="checkbox" className="accent-blue-600" checked={!!answers.consentDataUse} onChange={(e)=>setAnswer('consentDataUse', e.target.checked)} /> I consent to anonymized essay data use for model improvement
                  </label>
                  <button type="button" className="text-xs text-gray-500 mt-1 underline">Why we ask this</button>
                </div>
                <label className="md:col-span-3 flex items-center gap-2 text-gray-900">
                  <input type="checkbox" className="accent-blue-600" checked={!!answers.alertsDeadlines} onChange={(e)=>setAnswer('alertsDeadlines', e.target.checked)} /> Send alerts for deadlines & admissions outlook shifts
                </label>
              </div>
            </SectionCard>
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-6">
            <SectionCard title="Basic Information">
              <div className="grid md:grid-cols-2 gap-4">
                <input className={inputBase} placeholder="Full name" value={answers.fullName} onChange={(e) => setAnswer('fullName', e.target.value)} />
                <input className={inputBase} placeholder="Current school" value={answers.currentSchool} onChange={(e) => setAnswer('currentSchool', e.target.value)} />
                <select className={selectBase} value={answers.graduationYear ?? ''} onChange={(e) => setAnswer('graduationYear', Number(e.target.value) as any)}>
                  <option value="" disabled>Graduation year</option>
                  {[2025, 2026, 2027, 2028].map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <select className={selectBase} value={answers.region ?? ''} onChange={(e) => setAnswer('region', e.target.value as any)}>
                  <option value="" disabled>Region</option>
                  {['US','Canada','UK','EU','APAC','Other'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </SectionCard>

            <SectionCard title="Academic Profile">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <input className={`${inputBase} flex-1`} placeholder="GPA" type="number" value={answers.gpa ?? ''} onChange={(e) => setAnswer('gpa', e.target.value ? Number(e.target.value) : undefined)} />
                  <input className={`${inputBase} w-28`} placeholder="Scale" type="number" value={answers.gpaScale ?? 4} onChange={(e) => setAnswer('gpaScale', Number(e.target.value))} />
                </div>
                <select className={selectBase} value={answers.testPlan ?? 'Undecided'} onChange={(e) => setAnswer('testPlan', e.target.value as any)}>
                  {['SAT','ACT','Both','Test-Optional','Undecided'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input className={inputBase} placeholder="SAT (optional)" type="number" value={answers.sat ?? ''} onChange={(e) => setAnswer('sat', e.target.value ? Number(e.target.value) : undefined)} />
                <input className={inputBase} placeholder="ACT (optional)" type="number" value={answers.act ?? ''} onChange={(e) => setAnswer('act', e.target.value ? Number(e.target.value) : undefined)} />
                <input
                  className={`${inputBase} md:col-span-2`}
                  placeholder="Intended major (free text)"
                  value={answers.intendedMajor ?? ''}
                  onChange={(e) => setAnswer('intendedMajor', (e.target.value || '') as any)}
                />
              </div>
            </SectionCard>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6">
            <SectionCard title="Target Colleges" subtitle="Add your targets and application plan (ED/Early/RD)">
              <div className="grid md:grid-cols-3 gap-3">
                <AddCollege onAdd={(name, plan) => addTargetCollege({ id: name.toLowerCase().replace(/[^a-z0-9]+/g,'-'), name, plan })} />
                <div className="md:col-span-3">
                  {answers.targetColleges.length === 0 ? (
                     <p className="text-gray-600">No targets yet. Add a few you’re considering.</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {answers.targetColleges.map(c => (
                        <li key={c.id} className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-gray-900 font-medium">{c.name}</p>
                            <p className="text-gray-500 text-sm">Plan: {c.plan}</p>
                          </div>
                          <button className="text-red-600 hover:text-red-500" onClick={() => removeTargetCollege(c.id)}>Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Budget & Aid">
              <div className="grid md:grid-cols-3 gap-3">
                <select className={selectBase} value={answers.budget ?? ''} onChange={(e) => setAnswer('budget', e.target.value as any)}>
                  <option value="" disabled>Budget level</option>
                  {['Low','Medium','High'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <label className="flex items-center gap-2 text-white md:col-span-2">
                  <input type="checkbox" className="accent-purple-500" checked={answers.needFinancialAid} onChange={(e) => setAnswer('needFinancialAid', e.target.checked)} />
                  I will apply for financial aid
                </label>
              </div>
            </SectionCard>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-6">
            <SectionCard title="Activities & Achievements" subtitle="Add highlights that shape your story">
              <AddActivity onAdd={(a) => addActivity(a)} />
              <div className="mt-4">
                {answers.activities.length === 0 ? (
                  <p className="text-gray-600">No activities yet. Add at least 3–5.</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {answers.activities.map(a => (
                      <li key={a.id} className="py-3 flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{a.title} <span className="text-gray-500 text-sm">({a.category}{a.role ? ` · ${a.role}` : ''})</span></p>
                          <div className="text-gray-500 text-xs mt-1">
                            {a.impactLevel && <span className="mr-3">Impact: {a.impactLevel}</span>}
                            {a.duration && <span>Duration: {a.duration}</span>}
                          </div>
                          {a.description && <p className="text-gray-600 text-sm mt-1">{a.description}</p>}
                        </div>
                        <button className="text-red-600 hover:text-red-500 text-sm" onClick={() => removeActivity(a.id)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-6">
            <SectionCard title="Review & Personalization" subtitle="We’ll tailor your dashboard, deadlines, and storyline framework">
              <ul className="grid md:grid-cols-2 gap-3 text-sm">
                <li className="text-gray-600"><span className="text-gray-900 font-medium">Name:</span> {answers.fullName || '—'}</li>
                <li className="text-gray-600"><span className="text-gray-900 font-medium">Grad Year:</span> {answers.graduationYear || '—'}</li>
                <li className="text-gray-600"><span className="text-gray-900 font-medium">Region:</span> {answers.region || '—'}</li>
                <li className="text-gray-600"><span className="text-gray-900 font-medium">Major:</span> {answers.intendedMajor || '—'}</li>
                <li className="text-gray-600"><span className="text-gray-900 font-medium">Targets:</span> {answers.targetColleges.map(c=>c.name).join(', ') || '—'}</li>
                <li className="text-gray-600"><span className="text-gray-900 font-medium">Activities:</span> {answers.activities.length}</li>
              </ul>
              {answers.activities.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-900 font-medium text-sm mb-2">Top activities</p>
                  <ul className="space-y-2">
                    {answers.activities.slice(0, 3).map(a => (
                      <li key={a.id} className="text-text-secondary text-sm">
                        <span className="text-gray-900">{a.title}</span>
                        <span className="text-gray-500"> — {a.category}{a.role ? ` · ${a.role}` : ''}{a.impactLevel ? ` · ${a.impactLevel}` : ''}{a.duration ? ` · ${a.duration}` : ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Application Readiness Checklist" subtitle="Make sure you’re ready to start essays and submit on time">
              <ul className="grid md:grid-cols-2 gap-3 text-sm">
                {/* Testing Plan */}
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 accent-blue-600" readOnly checked={!!answers.testPlan && (!!answers.sat || !!answers.act || answers.testPlan !== 'Undecided') && !!answers.nextTestDate} />
                  <div className="text-gray-600">
                    <span className="text-gray-900 font-medium">Testing plan</span>: {answers.testPlan || '—'}{answers.sat ? ` · SAT ${answers.sat}` : ''}{answers.act ? ` · ACT ${answers.act}` : ''}{answers.nextTestDate ? ` · Next: ${answers.nextTestDate}` : ''}
                    {!answers.nextTestDate && (
                      <div className="mt-2 flex gap-2">
                        <input type="date" className={`${inputBase} px-3 py-2 text-sm`} value={answers.nextTestDate || ''} onChange={(e)=>setAnswer('nextTestDate', e.target.value)} />
                        <Button size="sm" variant="outline" onClick={() => setStep(1)}>Fix</Button>
                      </div>
                    )}
                  </div>
                </li>
                {/* Targets */}
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 accent-blue-600" readOnly checked={answers.targetColleges.length > 0} />
                  <div className="text-gray-600">
                    <span className="text-gray-900 font-medium">Targets with plan</span>: {answers.targetColleges.length}
                    {answers.targetColleges.length === 0 ? (
                      <div>
                        <Button size="sm" variant="outline" onClick={() => setStep(2)}>Fix</Button>
                      </div>
                    ) : null}
                  </div>
                </li>
                {/* Draft */}
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 accent-blue-600" readOnly checked={(essaysCount ?? 0) > 0} />
                  <div className="text-gray-600">
                    <span className="text-gray-900 font-medium">Draft started</span>: {checkingEssays ? 'Checking…' : `${essaysCount ?? 0}`}
                    {(essaysCount ?? 0) === 0 ? (
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate('/essays/new')}>Create draft</Button>
                      </div>
                    ) : null}
                  </div>
                </li>
                {/* Recommenders */}
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 accent-blue-600" readOnly checked={(answers.recommenders?.length ?? 0) >= 2} />
                  <div className="text-gray-600">
                    <span className="text-gray-900 font-medium">Recommenders</span>: {(answers.recommenders?.length ?? 0)} / 2
                    {(answers.recommenders?.length ?? 0) < 2 && (
                      <div className="mt-2 flex gap-2">
                        <input className={`${inputBase} px-3 py-2 text-sm`} placeholder="Teacher name" onKeyDown={(e)=>{
                          if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                            const name = (e.target as HTMLInputElement).value.trim();
                            setAnswer('recommenders', [ ...(answers.recommenders||[]), { id: crypto.randomUUID(), name } ] as any);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }} />
                        <Button size="sm" variant="outline" onClick={() => setStep(2)}>Fix</Button>
                      </div>
                    )}
                  </div>
                </li>
              </ul>

              {/* Toggles */}
              <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
                <label className="flex items-center gap-2 text-gray-900">
                  <input type="checkbox" className="accent-blue-600" checked={alertsEnabled} onChange={(e)=>setAlertsEnabled(e.target.checked)} /> Enable alerts (policy changes & deadlines)
                </label>
                <label className="flex items-center gap-2 text-gray-900">
                  <input type="checkbox" className="accent-blue-600" checked={sendToParent} onChange={(e)=>setSendToParent(e.target.checked)} disabled={!answers.parentUpdates?.contact} /> Send summary to parent (KR)
                </label>
              </div>

              {/* Privacy line */}
              <p className="text-xs text-gray-500 mt-3">We only use this info to personalize your plan. You can edit anytime.</p>
            </SectionCard>
          </div>
        )}

        {/* Controls */}
        <div className="mt-10 flex items-center justify-between">
          <Button variant="outline" onClick={step === 0 ? () => navigate('/') : prev}>Back</Button>
          {step < totalSteps - 1 ? (
            <div className="flex flex-col items-end">
              <Button variant="primary" onClick={next} disabled={!canContinue}>Continue →</Button>
              <div className="text-xs text-gray-500 mt-1">Your personalized plan will be ready in under 30 seconds.</div>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <Button variant="primary" onClick={complete} disabled={!canFinish || finishing}>
                {finishing ? 'Generating your plan…' : 'Finish & Generate My Plan →'}
              </Button>
              <div className="text-xs text-gray-500 mt-1">Creates deadlines, essay projects, and first insights in ~10s.</div>
            </div>
          )}
        </div>
      </div>
      <ChatDock />
    </OnboardingLayout>
  );
};

const AddCollege: React.FC<{ onAdd: (name: string, plan: ApplicationPlan) => void; }> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<ApplicationPlan>('RD');
  return (
    <div className="md:col-span-3 flex gap-3">
      <input className={`flex-1 ${inputBase}`} placeholder="College name (e.g., Stanford University)" value={name} onChange={(e)=>setName(e.target.value)} />
      <select className={`w-40 ${selectBase}`} value={plan} onChange={(e)=>setPlan(e.target.value as ApplicationPlan)}>
        {['ED','EA','REA','RD','Rolling'].map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <Button onClick={() => { if(name.trim()) { onAdd(name.trim(), plan); setName(''); } }}>Add</Button>
    </div>
  );
};

const AddActivity: React.FC<{ onAdd: (a: any) => void; }> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Leadership');
  const [desc, setDesc] = useState('');
  const [role, setRole] = useState('');
  const [duration, setDuration] = useState('');
  const [impact, setImpact] = useState<'Local' | 'Regional' | 'National' | 'International' | ''>('');
  return (
    <div className="grid md:grid-cols-3 gap-3">
      <input className={`md:col-span-1 ${inputBase}`} placeholder="Activity title" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <select className={`md:col-span-1 ${selectBase}`} value={category} onChange={(e)=>setCategory(e.target.value)}>
        {['Leadership','STEM','Community','Arts','Athletics','Research','Entrepreneurship','Other'].map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input className={`md:col-span-1 ${inputBase}`} placeholder="Role/Position (e.g., Team Captain)" value={role} onChange={(e)=>setRole(e.target.value)} />
      <input className={`md:col-span-1 ${inputBase}`} placeholder="Duration (e.g., 2022-2024, 10 hrs/wk)" value={duration} onChange={(e)=>setDuration(e.target.value)} />
      <select className={`md:col-span-1 ${selectBase}`} value={impact} onChange={(e)=>setImpact(e.target.value as any)}>
        <option value="">Impact Level</option>
        {['Local','Regional','National','International'].map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <div className="md:col-span-3">
        <textarea className={`w-full ${inputBase}`} placeholder="Brief description (optional)" rows={3} value={desc} onChange={(e)=>setDesc(e.target.value)} />
      </div>
      <div className="md:col-span-3">
        <Button
          onClick={() => {
            if(title.trim()) {
              onAdd({
                id: crypto.randomUUID(),
                title: title.trim(),
                category,
                description: desc.trim() || undefined,
                role: role.trim() || undefined,
                duration: duration.trim() || undefined,
                impactLevel: (impact || undefined) as any,
              });
              setTitle('');
              setDesc('');
              setRole('');
              setDuration('');
              setImpact('');
            }
          }}
        >Add Activity</Button>
      </div>
    </div>
  );
};

export default AdvisorOnboarding;