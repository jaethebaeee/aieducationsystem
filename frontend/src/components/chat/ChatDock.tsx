import React, { useState } from 'react';
import { useOnboardingStore } from '../../services/onboardingStore';
import { useCoachPersona, CoachPersonaThemes } from '../../stores/useCoachPersona';
import PromptSuggestions from './PromptSuggestions';
import { PromptSuggestion } from '../../services/promptSuggestions';
import { useSubscription } from '../../hooks/useSubscription';
import {
  MagnifyingGlassIcon,
  GlobeAltIcon,
  SparklesIcon,
  ClockIcon,
  RectangleGroupIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

type ChatMessage = { role: 'user' | 'assistant'; content: string; ts: number };

const chipBtn = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs border border-white/10';

const ChatDock: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [intent, setIntent] = useState<null | 'research' | 'cultural' | 'ideation' | 'timeline' | 'prompt' | 'reuse' | 'gap'>(null);
  const [university, setUniversity] = useState('');
  const [essayText, setEssayText] = useState('');
  const [background, setBackground] = useState('');
  const [experience, setExperience] = useState('');
  const [ideationMode, setIdeationMode] = useState<null | 'authentic_topics' | 'hardship_growth' | 'cliche_diagnosis'>(null);
  const [timelineDeadline, setTimelineDeadline] = useState('');
  const [timelineConstraints, setTimelineConstraints] = useState('');
  const { addTargetCollege } = useOnboardingStore();
  const [cards, setCards] = useState<Array<{ id: string; type: 'prompt' | 'reuse' | 'gap'; data: any }>>([]);
  const { persona, setPersona, getTheme } = useCoachPersona();
  const theme = getTheme();
  const { active, loading: subLoading, plan } = useSubscription();

  const pushMsg = (m: Omit<ChatMessage, 'ts'> & { ts?: number }) => setMessages((prev) => [...prev, { ...m, ts: m.ts ?? Date.now() }]);

  const pushUpgradeNotice = () => {
    pushMsg({
      role: 'assistant',
      content: 'Upgrade required to use this premium feature. Visit Pricing to activate your plan.',
    });
  };

  const handlePickSuggestion = (s: PromptSuggestion) => {
    pushMsg({ role: 'user', content: s.prompt });
    switch (s.category) {
      case 'Research':
        setIntent('research');
        break;
      case 'Cultural Fit':
        setIntent('cultural');
        break;
      case 'Ideation':
        setIntent('ideation');
        if (s.id.includes('ideation-1')) setIdeationMode('authentic_topics');
        if (s.id.includes('ideation-2')) setIdeationMode('hardship_growth');
        break;
      case 'Timeline':
        setIntent('timeline');
        break;
      case 'Prompt Pack':
        setIntent('prompt');
        break;
      case 'Reuse Map':
        setIntent('reuse');
        break;
      case 'Gap Scan':
        setIntent('gap');
        break;
      default:
        break;
    }
  };

  const evaluateAndAppend = async (text: string) => {
    try {
      const res = await fetch('/api/agentic-seek/evaluate-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ inputText: text, targetUniversity: university, intent, persona })
      });
      if (res.status === 403) { pushUpgradeNotice(); return; }
      const data = await res.json();
      if (data?.success) {
        const score = typeof data.data?.total === 'number' ? data.data.total : null;
        const subs = data.data?.subscores || {};
        const recs: Array<{ label: string; actionKey: string }> = data.data?.recommendations || [];
        if (score !== null) {
          let line = `Score: ${score}/5`;
          const parts = [subs.specificity, subs.authenticity, subs.contextFit, subs.actionability, subs.clarity]
            .filter((v: number | undefined) => typeof v === 'number')
            .map((v: number) => v.toFixed(1));
          if (parts.length === 5) line += ` (spec ${parts[0]}, auth ${parts[1]}, fit ${parts[2]}, act ${parts[3]}, clr ${parts[4]})`;
          pushMsg({ role: 'assistant', content: line });
          if (recs.length > 0) {
            const labels = recs.map(r => r.label).join(' | ');
            pushMsg({ role: 'assistant', content: `Improve: ${labels}` });
          }
        }
      }
    } catch {}
  };

  const runResearch = async () => {
    const uni = university.trim();
    if (!uni) return;
    setLoading(true);
    pushMsg({ role: 'user', content: `Research: ${uni}` });
    try {
      const res = await fetch('/api/agentic-seek/research-university', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ universityName: uni, persona })
      });
      if (res.status === 403) { pushUpgradeNotice(); return; }
      const data = await res.json();
      if (data?.success) {
        const text = typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2);
        pushMsg({ role: 'assistant', content: text });
      } else {
        pushMsg({ role: 'assistant', content: data?.error || 'Failed to research university' });
      }
    } catch (e) {
      pushMsg({ role: 'assistant', content: 'Network error while researching university' });
    } finally {
      setLoading(false);
      setIntent(null);
    }
  };

  const runCultural = async () => {
    const txt = essayText.trim();
    if (!txt) return;
    setLoading(true);
    pushMsg({ role: 'user', content: `Cultural fit for${university ? ` ${university}` : ''}: ${txt.slice(0, 80)}...` });
    try {
      const res = await fetch('/api/agentic-seek/cultural-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ essayText: txt, targetUniversity: university || undefined, persona })
      });
      if (res.status === 403) { pushUpgradeNotice(); return; }
      const data = await res.json();
      if (data?.success) {
        const text = data.data?.culturalAnalysis || (typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2));
        pushMsg({ role: 'assistant', content: text });
        await evaluateAndAppend(text);
      } else {
        pushMsg({ role: 'assistant', content: data?.error || 'Failed to analyze cultural fit' });
      }
    } catch (e) {
      pushMsg({ role: 'assistant', content: 'Network error while analyzing cultural fit' });
    } finally {
      setLoading(false);
      setIntent(null);
    }
  };

  const runPromptPack = async () => {
    const txt = essayText.trim();
    if (!txt) return;
    setLoading(true);
    pushMsg({ role: 'user', content: `Prompt Pack from story: ${txt.slice(0, 80)}...` });
    try {
      const res = await fetch('/api/agentic-seek/prompt-pack', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ essayText: txt, targets: undefined, persona })
      });
      if (res.status === 403) { pushUpgradeNotice(); return; }
      const data = await res.json();
      if (data?.success) {
        const list: any[] = data.data?.suggestions || [];
        const newCards = list.map((s) => ({ id: crypto.randomUUID(), type: 'prompt' as const, data: s }));
        setCards((prev) => [...newCards, ...prev]);
      } else {
        pushMsg({ role: 'assistant', content: data?.error || 'Failed to generate prompt pack' });
      }
    } catch {
      pushMsg({ role: 'assistant', content: 'Network error while generating prompt pack' });
    } finally {
      setLoading(false);
      setIntent(null);
    }
  };

  const runReuseMap = async () => {
    const txt = essayText.trim();
    if (!txt) return;
    setLoading(true);
    pushMsg({ role: 'user', content: `Reuse Map for draft: ${txt.slice(0, 80)}...` });
    try {
      const res = await fetch('/api/agentic-seek/reuse-map', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ essayText: txt, persona })
      });
      if (res.status === 403) { pushUpgradeNotice(); return; }
      const data = await res.json();
      if (data?.success) {
        const list: any[] = data.data?.reuseMap || [];
        const newCards = list.map((s) => ({ id: crypto.randomUUID(), type: 'reuse' as const, data: s }));
        setCards((prev) => [...newCards, ...prev]);
      } else {
        pushMsg({ role: 'assistant', content: data?.error || 'Failed to generate reuse map' });
      }
    } catch {
      pushMsg({ role: 'assistant', content: 'Network error while generating reuse map' });
    } finally {
      setLoading(false);
      setIntent(null);
    }
  };

  const runGapScan = async () => {
    setLoading(true);
    pushMsg({ role: 'user', content: `Gap scan${university ? ` for ${university}` : ''}` });
    try {
      const res = await fetch('/api/agentic-seek/gap-scan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ targetSchool: university || undefined, persona })
      });
      if (res.status === 403) { pushUpgradeNotice(); return; }
      const data = await res.json();
      if (data?.success) {
        const list: any[] = data.data?.gaps || [];
        const newCards = list.map((g) => ({ id: crypto.randomUUID(), type: 'gap' as const, data: g }));
        setCards((prev) => [...newCards, ...prev]);
      } else {
        pushMsg({ role: 'assistant', content: data?.error || 'Failed to perform gap scan' });
      }
    } catch {
      pushMsg({ role: 'assistant', content: 'Network error while performing gap scan' });
    } finally {
      setLoading(false);
      setIntent(null);
    }
  };

  const runIdeation = async () => {
    if (!ideationMode) return;
    setLoading(true);
    const preview = ideationMode === 'authentic_topics' ? background : ideationMode === 'hardship_growth' ? experience : essayText;
    pushMsg({ role: 'user', content: `Ideation (${ideationMode}): ${preview.slice(0, 80)}...` });
    try {
      const res = await fetch('/api/agentic-seek/topic-ideation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ideationType: ideationMode,
          background: ideationMode === 'authentic_topics' ? background : undefined,
          experience: ideationMode === 'hardship_growth' ? experience : undefined,
          essayText: ideationMode === 'cliche_diagnosis' ? essayText : undefined,
          persona,
        })
      });
      if (res.status === 403) { pushUpgradeNotice(); return; }
      const data = await res.json();
      if (data?.success) {
        const text = data.data?.result || JSON.stringify(data.data, null, 2);
        pushMsg({ role: 'assistant', content: text });
        await evaluateAndAppend(text);
      } else {
        pushMsg({ role: 'assistant', content: data?.error || 'Failed to run ideation' });
      }
    } catch (_e) {
      pushMsg({ role: 'assistant', content: 'Network error while running ideation' });
    } finally {
      setLoading(false);
      setIntent(null);
      setIdeationMode(null);
    }
  };

  // Simple local 8-week plan generator (no backend dependency)
  const runTimeline = () => {
    const dl = timelineDeadline.trim();
    if (!dl) return;
    setLoading(true);
    pushMsg({ role: 'user', content: `8-week plan before ${dl}${timelineConstraints ? ` (constraints: ${timelineConstraints})` : ''}` });

    const focuses = [
      'Topic ideation + pick 2',
      'PS outline + scene seeds',
      'PS scene drafts (2–3)',
      'PS full draft v1',
      'Feedback + revise PS v2',
      'Polish PS v3 + grammar pass',
      'Supplements drafts (1–2)',
      'Supplements drafts (3) + final polish'
    ];
    const tasks = [
      ['Brainstorm 10 topics', 'Shortlist top 2', 'Write 3 scene seeds'],
      ['Build outline (hook/arc/reflection)', 'List admissions values', 'Collect evidence'],
      ['Write 2–3 scenes (500–700w each)', 'Add specific details'],
      ['Merge scenes → full draft', 'Cut redundancies', 'Set aside 12–24h cool-off'],
      ['Request teacher/parent feedback', 'Integrate top 3 changes'],
      ['Clarity rewrite (grade 11–12)', 'Grammar check', 'Finalize PS v3'],
      ['Draft 1–2 supplements (150–250w)', 'Reuse PS motifs where fits'],
      ['Draft last supplement', 'Proofread all', 'Final formatting and file checks']
    ];
    const planLines: string[] = [];
    for (let i = 0; i < 8; i++) {
      planLines.push(`Week ${i + 1}: ${focuses[i]}`);
      tasks[i].forEach(t => planLines.push(`  - ${t}`));
      if (i === 3 || i === 7) planLines.push('  - Milestone: PS v1 (W4) / All finals ready (W8)');
      if (i === 4) planLines.push('  - Checkpoint: Parent/teacher review scheduled');
    }
    if (timelineConstraints) planLines.push(`Constraints noted: ${timelineConstraints}`);
    const out = planLines.join('\n');

    // Simulate quick processing
    setTimeout(async () => {
      pushMsg({ role: 'assistant', content: out });
      await evaluateAndAppend(out);
      setLoading(false);
      setIntent(null);
    }, 200);
  };

  return (
    <div className="fixed right-6 bottom-6 z-40">
      {!open && (
        <div className="flex flex-col items-end gap-2">
          <button onClick={() => setOpen(true)} className={`relative w-14 h-14 rounded-full text-white shadow-lg ${persona==='dean'?'bg-blue-600 hover:bg-blue-700':persona==='alumni'?'bg-purple-600 hover:bg-purple-700':'bg-emerald-600 hover:bg-emerald-700'}`} aria-label="Open chat">
            <ChatBubbleLeftRightIcon className="w-6 h-6 m-auto" />
            {messages.length > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 ring-2 ring-[#0d0d10]" />}
          </button>
        </div>
      )}
      {open && (
        <div className="w-[420px] max-h-[72vh] bg-[#0d0d10] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <p className={`${theme.accentClass} font-semibold`}>{CoachPersonaThemes[persona].label}</p>
                <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-0.5">
                  {(['dean','alumni','ta'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setPersona(key)}
                      className={`px-2.5 py-1 text-xs rounded-full ${persona===key?'bg-white/20 text-white':'text-white/70 hover:text-white'}`}
                    >{CoachPersonaThemes[key].label}</button>
                  ))}
                </div>
                <span className={`ml-2 px-2 py-0.5 rounded text-[11px] border ${subLoading ? 'text-white/60 border-white/10' : active ? 'text-green-300 border-green-700/50 bg-green-600/10' : 'text-yellow-300 border-yellow-700/50 bg-yellow-600/10'}`}>{subLoading ? '…' : active ? (plan||'PAID').toUpperCase() : 'FREE'}</span>
              </div>
              <button className="text-text-secondary hover:text-white" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
            </div>
          </div>
          <div className="p-3 border-b border-white/10">
            <PromptSuggestions
              context={{ university, backgroundSnippet: background }}
              onPick={handlePickSuggestion}
              className="mb-3"
            />
            <div className="flex items-center flex-wrap gap-2">
              <button className={chipBtn} onClick={() => { setIntent('research'); }}><MagnifyingGlassIcon className="w-4 h-4" /> Research</button>
              <button className={chipBtn} onClick={() => { setIntent('cultural'); }}><GlobeAltIcon className="w-4 h-4" /> Cultural</button>
              <button className={chipBtn} onClick={() => { setIntent('ideation'); setIdeationMode('authentic_topics'); }}><SparklesIcon className="w-4 h-4" /> Ideation</button>
              <button className={chipBtn} onClick={() => { setIntent('timeline'); }}><ClockIcon className="w-4 h-4" /> Timeline</button>
              <button className={chipBtn} onClick={() => { setIntent('prompt'); }}><RectangleGroupIcon className="w-4 h-4" /> Prompt</button>
              <button className={chipBtn} onClick={() => { setIntent('reuse'); }}><ArrowPathIcon className="w-4 h-4" /> Reuse</button>
              <button className={chipBtn} onClick={() => { setIntent('gap'); }}><ChartBarIcon className="w-4 h-4" /> Gap</button>
            </div>
          </div>
          {intent && (
            <div className="p-3 border-b border-white/10 space-y-2">
              <input
                className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                placeholder="Target university (optional)"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
              {intent === 'timeline' && (
                <>
                  <input
                    className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                    placeholder="Deadline (YYYY-MM-DD)"
                    value={timelineDeadline}
                    onChange={(e) => setTimelineDeadline(e.target.value)}
                  />
                  <textarea
                    className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                    rows={3}
                    placeholder="Constraints (exams, clubs) — optional"
                    value={timelineConstraints}
                    onChange={(e) => setTimelineConstraints(e.target.value)}
                  />
                </>
              )}
              {intent === 'cultural' && (
                <textarea
                  className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                  rows={4}
                  placeholder="Paste your essay or paragraph"
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                />
              )}
              {intent === 'ideation' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white rounded text-xs" onClick={() => setIdeationMode('authentic_topics')}>5 Topics</button>
                    <button className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white rounded text-xs" onClick={() => setIdeationMode('hardship_growth')}>Hardship → Growth</button>
                    <button className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white rounded text-xs" onClick={() => setIdeationMode('cliche_diagnosis')}>Avoid Cliché</button>
                  </div>
                  {ideationMode === 'authentic_topics' && (
                    <textarea
                      className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                      rows={4}
                      placeholder="Your background: bio, activities, interests"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                    />
                  )}
                  {ideationMode === 'hardship_growth' && (
                    <textarea
                      className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                      rows={4}
                      placeholder="Describe the hardship experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  )}
                  {ideationMode === 'cliche_diagnosis' && (
                    <textarea
                      className="w-full bg-[#0b0b0e] border border-white/10 rounded-lg p-2.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                      rows={4}
                      placeholder="Paste your draft to check for clichés"
                      value={essayText}
                      onChange={(e) => setEssayText(e.target.value)}
                    />
                  )}
                </div>
              )}
              <div className="flex items-center justify-end gap-2">
                <button className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-sm" onClick={() => setIntent(null)}>Cancel</button>
                <button
                  className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm disabled:opacity-50"
                  disabled={loading}
                  onClick={() => intent === 'research' ? runResearch() : intent === 'cultural' ? runCultural() : intent === 'ideation' ? runIdeation() : intent === 'timeline' ? runTimeline() : intent === 'prompt' ? runPromptPack() : intent === 'reuse' ? runReuseMap() : runGapScan()}
                >
                  {loading ? 'Working…' : 'Run'}
                </button>
              </div>
            </div>
          )}
          <div className="p-3 max-h-[44vh] overflow-y-auto space-y-2">
            {messages.length === 0 ? (
              <p className="text-text-secondary text-sm">Use the chips above to run advisor prompts. Try Research or Cultural Analysis.</p>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`p-2 rounded-2xl ${m.role === 'user' ? 'bg-white/10 text-white self-end' : 'bg-white/5 text-text-secondary'} max-w-full`}> 
                  <pre className="whitespace-pre-wrap break-words text-sm leading-6">{m.content}</pre>
                  <div className="mt-1 text-[10px] text-white/40 text-right">{new Date(m.ts).toLocaleTimeString()}</div>
                </div>
              ))
            )}
            {cards.length > 0 && (
              <div className="space-y-2 mt-2">
                {cards.map((c) => (
                  <div key={c.id} className="relative p-3 rounded-lg border border-white/10 bg-white/5 text-sm">
                    <button className="absolute top-2 right-2 text-white/50 hover:text-white" aria-label="Dismiss" onClick={() => setCards((prev)=>prev.filter(x=>x.id!==c.id))}>✕</button>
                    {c.type === 'prompt' && (
                      <>
                        <p className="text-white font-medium">{c.data.school}</p>
                        <p className="text-text-secondary">Prompt: {c.data.prompt}</p>
                        <p className="text-text-muted text-xs">Angle: {c.data.angle} · Reuse: {Math.round((c.data.reuse || 0)*100)}%</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded" onClick={() => { window.location.href = '/essays/new'; }}>Sure</button>
                          <button className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white rounded" onClick={() => setCards((prev)=>prev.filter(x=>x.id!==c.id))}>Later</button>
                        </div>
                      </>
                    )}
                    {c.type === 'reuse' && (
                      <>
                        <p className="text-white font-medium">{c.data.school} <span className="text-text-muted text-xs">({c.data.platform})</span></p>
                        <p className="text-text-secondary">Minimal edits: {Array.isArray(c.data.minimalEdits) ? c.data.minimalEdits.join(', ') : ''}</p>
                        <p className="text-text-muted text-xs">Reuse: {Math.round((c.data.reuse || 0)*100)}%</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded" onClick={() => { addTargetCollege({ id: c.data.school.toLowerCase().replace(/[^a-z0-9]+/g,'-'), name: c.data.school, plan: 'RD' as any }); setCards((prev)=>prev.filter(x=>x.id!==c.id)); }}>Add</button>
                          <button className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white rounded" onClick={() => setCards((prev)=>prev.filter(x=>x.id!==c.id))}>Later</button>
                        </div>
                      </>
                    )}
                    {c.type === 'gap' && (
                      <>
                        <p className="text-white font-medium">{c.data.label}</p>
                        <p className="text-text-secondary">{c.data.action}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded" onClick={() => { pushMsg({ role:'assistant', content: `Added to actions: ${c.data.label}`}); setCards((prev)=>prev.filter(x=>x.id!==c.id)); }}>Sure</button>
                          <button className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white rounded" onClick={() => setCards((prev)=>prev.filter(x=>x.id!==c.id))}>Later</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDock;

