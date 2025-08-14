import { useEffect, useRef, useState } from 'react';
import { useWorkspace } from '../../stores/useWorkspace';
import { analysisAPI, essaysAPI } from '../../services/api';
import { useAssistantSettings, PersonaKey } from '../../stores/useAssistantSettings';
import PromptSuggestions from '../chat/PromptSuggestions';
import { PromptSuggestion } from '../../services/promptSuggestions';

const PERSONAS: { key: PersonaKey; label: string }[] = [
  { key: 'policy', label: 'Policy Expert' },
  { key: 'essay', label: 'Essay Coach' },
  { key: 'aid', label: 'Scholarships' },
  { key: 'general', label: 'General' },
];

const PERSONA_META: Record<PersonaKey, { name: string; tagline: string; emoji: string; color: string }> = {
  policy: { name: 'Policy Mentor', tagline: 'Up-to-date policy and admissions context', emoji: '📜', color: 'bg-indigo-600' },
  essay: { name: 'Essay Coach', tagline: 'Structure, storytelling, and polish', emoji: '📝', color: 'bg-purple-600' },
  aid: { name: 'Aid Advisor', tagline: 'Scholarships and financial aid clarity', emoji: '💰', color: 'bg-emerald-600' },
  general: { name: 'AdmitAI Mentor', tagline: 'Admissions strategy and guidance', emoji: '✨', color: 'bg-blue-600' },
};

type Citation = { title?: string; url?: string };
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  nextSteps?: string[];
  facts?: string[];
  scores?: unknown;
  ts: number;
};

type Thread = {
  id: string;
  name: string;
  messages: ChatMessage[];
  updatedAt: number;
};

export default function ChatbotDock() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! Ask about policies, essays, or scholarships. I’ll cite sources.', ts: Date.now() }
  ]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [threads, setThreads] = useState<Thread[]>(() => {
    try {
      const raw = localStorage.getItem('chat:threads_v1');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [threadId, setThreadId] = useState<string>(() => localStorage.getItem('chat:threadId') || '');
  const [renaming, setRenaming] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const selection = useWorkspace((s) => s.selection);
  const profile = useWorkspace((s) => s.profile);
  const [persona, setPersona] = useState<PersonaKey>('general');
  const [receiptsOnly, setReceiptsOnly] = useState(false);
  const [requireCitations, setRequireCitations] = useState(true);
  const [statsOnly, setStatsOnly] = useState(true);
  const personaSetting = useAssistantSettings((s) => s.getPersonaSetting(persona));
  const setPersonaSetting = useAssistantSettings((s) => s.setPersonaSetting);
  const [side, setSide] = useState<'left' | 'right'>(() => (localStorage.getItem('chat:side') as 'left' | 'right') || 'right');
  const [size, setSize] = useState<{ w: number; h: number}>(() => {
    const raw = localStorage.getItem('chat:size');
    if (!raw) return { w: 420, h: 520 };
    try { const parsed = JSON.parse(raw); return { w: parsed.w || 420, h: parsed.h || 520 }; } catch { return { w: 420, h: 520 }; }
  });
  const resizingRef = useRef<{ active: boolean; startX: number; startY: number; startW: number; startH: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onToggle = () => setOpen((v) => !v);
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent).detail as { prompt?: string } | undefined;
      setOpen(true);
      if (detail?.prompt && inputRef.current) {
        inputRef.current.value = detail.prompt;
        inputRef.current.focus();
      }
    };
    document.addEventListener('chat:toggle', onToggle);
    document.addEventListener('chat:prefill', onPrefill as any);
    return () => document.removeEventListener('chat:toggle', onToggle);
  }, []);

  // Persist side/size
  useEffect(() => { try { localStorage.setItem('chat:side', side); } catch {} }, [side]);
  useEffect(() => { try { localStorage.setItem('chat:size', JSON.stringify(size)); } catch {} }, [size]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);
  // Persist threads and selection
  useEffect(() => { try { localStorage.setItem('chat:threads_v1', JSON.stringify(threads)); } catch {} }, [threads]);
  useEffect(() => { try { localStorage.setItem('chat:threadId', threadId); } catch {} }, [threadId]);
  // Initialize a default thread if none exists
  useEffect(() => {
    if (threads.length === 0) {
      const id = crypto.randomUUID();
      const base = msgs;
      setThreads([{ id, name: 'Untitled', messages: base, updatedAt: Date.now() }]);
      setThreadId(id);
    } else if (!threadId) {
      setThreadId(threads[0].id);
      setMsgs(threads[0].messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Sync current thread with messages
  useEffect(() => {
    if (!threadId) return;
    setThreads((prev) => prev.map((t) => t.id === threadId ? { ...t, messages: msgs, updatedAt: Date.now() } : t));
  }, [msgs, threadId]);

  function handleSlashCommands(text: string): boolean {
    if (!text.startsWith('/')) return false;
    const cmd = text.split(' ')[0];
    switch (cmd) {
      case '/add-deadline':
        document.dispatchEvent(new CustomEvent('planner:add-deadline', { detail: { selection } }));
        setMsgs((m) => [...m, { role: 'assistant', content: 'Deadline added to your plan.', ts: Date.now() }]);
        return true;
      case '/open-essay':
        if (selection?.type === 'essay') {
          window.location.href = `/essays/${selection.id}`;
        } else {
          setMsgs((m) => [...m, { role: 'assistant', content: 'Select an essay first.', ts: Date.now() }]);
        }
        return true;
      case '/compare-mit-vs-caltech':
        setMsgs((m) => [...m, { role: 'assistant', content: 'Opening comparison view (placeholder)…', ts: Date.now() }]);
        document.dispatchEvent(new CustomEvent('universities:compare', { detail: { a: 'mit', b: 'caltech' } }));
        return true;
      default:
        return false;
    }
  }

  

  function tLabel(en: string, ko: string) {
    return personaSetting.language === 'ko' ? ko : en;
  }

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as any).isContentEditable === true);
      if ((e.key === 'c' || e.key === 'C') && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping) {
        setOpen((v) => !v);
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        if (document.activeElement === inputRef.current) {
          e.preventDefault();
          send();
        }
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        (document.activeElement as HTMLElement)?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Minimal markdown renderer (bold, code, lists, fenced code)
  function renderMarkdown(md: string): JSX.Element {
    const out: JSX.Element[] = [];
    const lines = md.split(/\n/);
    let i = 0;
    let inCode = false;
    const code: string[] = [];
    let inList = false;
    let listItems: string[] = [];

    const renderInline = (text: string, key: string): JSX.Element[] => {
      const codeSplit = text.split(/(`[^`]+`)/g);
      const nodes: JSX.Element[] = [];
      codeSplit.forEach((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          nodes.push(<code key={`${key}-c-${idx}`} className="bg-white/10 px-1.5 py-0.5 rounded">{part.slice(1, -1)}</code>);
        } else {
          const boldSplit = part.split(/(\*\*[^*]+\*\*)/g);
          boldSplit.forEach((seg, j) => {
            if (seg.startsWith('**') && seg.endsWith('**')) {
              nodes.push(<strong key={`${key}-b-${idx}-${j}`}>{seg.slice(2, -2)}</strong>);
            } else {
              nodes.push(<span key={`${key}-t-${idx}-${j}`}>{seg}</span>);
            }
          });
        }
      });
      return nodes;
    };

    const flushList = () => {
      if (inList) {
        out.push(
          <ul key={`ul-${out.length}`} className="list-disc pl-5 my-2 space-y-1">
            {listItems.map((li, idx) => <li key={`li-${idx}`}>{renderInline(li, `li-${idx}`)}</li>)}
          </ul>
        );
        inList = false;
        listItems = [];
      }
    };

    while (i < lines.length) {
      const line = lines[i];
      if (line.trim().startsWith('```')) {
        if (!inCode) {
          inCode = true;
        } else {
          out.push(
            <pre key={`pre-${out.length}`} className="bg-black/40 border border-white/10 rounded p-3 whitespace-pre-wrap overflow-auto"><code>{code.join('\n')}</code></pre>
          );
          code.length = 0;
          inCode = false;
        }
        i++;
        continue;
      }
      if (inCode) { code.push(line); i++; continue; }
      const lm = /^[-*]\s+(.+)/.exec(line.trim());
      if (lm) { inList = true; listItems.push(lm[1]); i++; continue; } else { flushList(); }
      if (line.trim().length === 0) { out.push(<div key={`sp-${out.length}`} className="h-2" />); i++; continue; }
      out.push(<p key={`p-${out.length}`} className="leading-relaxed">{renderInline(line, `p-${out.length}`)}</p>);
      i++;
    }
    flushList();
    if (inCode) {
      out.push(<pre key={`pre-tail`} className="bg-black/40 border border-white/10 rounded p-3 whitespace-pre-wrap overflow-auto"><code>{code.join('\n')}</code></pre>);
    }
    return <>{out}</>;
  }

  function extractFacts(text: string): string[] {
    const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const facty: string[] = [];
    const numberLike = /(\d{1,3}(,\d{3})+|\d+\.\d+|\d+)%|\b\d{4}\b|\btop\s?\d+\b|\baccept|admit|rate|GPA|SAT|ACT|TOEFL|IELTS|deadline|increase|decrease|trend/i;
    for (const l of lines) {
      if (numberLike.test(l)) {
        facty.push(l);
      }
    }
    return facty.slice(0, 10);
  }

  async function send(q?: string) {
    const qtext = (q ?? inputRef.current?.value ?? '').trim(); if (!qtext) return;
    setMsgs((m) => [...m, { role: 'user', content: qtext, ts: Date.now() }]);
    // Auto-name current thread from first user message
    setThreads((t) => {
      if (!threadId) return t;
      const now = Date.now();
      return t.map((th) => th.id === threadId ? { ...th, name: th.name && th.name !== 'Untitled' ? th.name : qtext.slice(0, 40) || 'Untitled', updatedAt: now } : th);
    });
    if (inputRef.current) inputRef.current.value = '';
    if (handleSlashCommands(qtext)) return;
    setLoading(true);
    const meta = { persona, receiptsOnly, personaSetting, statsOnly } as const;
    const res = await fetch('/api/rag/insights', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: qtext, topK: 12, topic: persona, schoolId: selection?.type==='school'? selection.id : undefined, profile, meta })
    }).then((r) => r.json()).catch(() => null);
    const answer = res?.data?.answer ?? 'Sorry, I could not find that.';
    const citations = res?.data?.citations as Array<{ title?: string; url?: string }> | undefined;
    const scores = res?.data?.scores as any;
    const nextSteps = res?.data?.next_steps as string[] | undefined;
    if (requireCitations && (!citations || citations.length === 0)) {
      setMsgs((m) => [...m, { role: 'assistant', content: tLabel('I can only answer with sources. Please click Verify or ask for specific stats so I can cite.', '출처가 있는 내용만 답변할 수 있습니다. 학교 검증을 누르거나 구체적인 통계를 요청해주세요.'), ts: Date.now() }]);
      setLoading(false);
      return;
    }
    const renderedBase = receiptsOnly && citations?.length ? `Cited sentences only:\n${answer}` : answer;
    const facts = statsOnly ? extractFacts(answer) : [];
    const rendered = statsOnly && facts.length
      ? `${tLabel('Stats-backed summary', '통계 중심 요약')}:\n- ${facts.join('\n- ')}`
      : renderedBase;
    let suffix = '';
    if (scores && typeof scores === 'object') { try { suffix += `\n\nScores: ${JSON.stringify(scores)}`; } catch {} }
    const unverifiedNote = requireCitations && (!citations || citations.length === 0)
      ? `\n\n[${tLabel('Unverified: no citations provided. Use Verify to cross-check sources.', '검증되지 않음: 인용이 없습니다. 검증 버튼으로 확인하세요.')}]`
      : '';
    setMsgs((m) => [...m, { role: 'assistant', content: rendered + suffix + unverifiedNote, citations, nextSteps, facts, scores, ts: Date.now() }]);
    setLoading(false);
  }

  async function verifySelectedUniversity() {
    const uni = selection?.type === 'school' ? String(selection.id) : '';
    if (!uni) {
      setMsgs((m) => [...m, { role: 'assistant', content: tLabel('Select a university to verify.', '검증하려면 대학을 선택하세요.'), ts: Date.now() }]);
      return;
    }
    setLoading(true);
    try {
      const resp = await analysisAPI.getUniversityInsights(uni);
      if (resp?.success) {
        const d = resp.data as any;
        const lines: string[] = [];
        if (Array.isArray(d?.trends) && d.trends.length) {
          lines.push(`${tLabel('Trends', '동향')}:`);
          d.trends.forEach((x: string) => lines.push(`- ${x}`));
        }
        if (Array.isArray(d?.opportunities) && d.opportunities.length) {
          lines.push(`\n${tLabel('Opportunities', '기회')}:`);
          d.opportunities.forEach((x: string) => lines.push(`- ${x}`));
        }
        if (Array.isArray(d?.risks) && d.risks.length) {
          lines.push(`\n${tLabel('Risks', '리스크')}:`);
          d.risks.forEach((x: string) => lines.push(`- ${x}`));
        }
        if (Array.isArray(d?.recommendations) && d.recommendations.length) {
          lines.push(`\n${tLabel('Recommendations', '권장 사항')}:`);
          d.recommendations.forEach((x: string) => lines.push(`- ${x}`));
        }
        const header = `${tLabel('Verified insights for', '검증된 인사이트:')} ${uni}`;
        setMsgs((m) => [...m, { role: 'assistant', content: `${header}\n\n${lines.join('\n')}`, ts: Date.now() }]);
      } else {
        setMsgs((m) => [...m, { role: 'assistant', content: tLabel('Could not verify this university right now.', '지금은 이 대학을 검증할 수 없습니다.'), ts: Date.now() }]);
      }
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: tLabel('Network error while verifying university.', '대학 검증 중 네트워크 오류가 발생했습니다.'), ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }

  async function researchUniversityWeb() {
    const uni = selection?.type === 'school' ? String(selection.id) : '';
    if (!uni) {
      setMsgs((m) => [...m, { role: 'assistant', content: tLabel('Select a university to analyze.', '분석하려면 대학을 선택하세요.'), ts: Date.now() }]);
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch('/api/agentic-seek/research-university', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ universityName: uni })
      }).then(r => r.json()).catch(() => null);
      const research = resp?.data;
      const sources: Array<{ title?: string; url?: string }> = Array.isArray(research?.sources)
        ? research.sources.map((s: any) => ({ title: s.title || s.name || s.url, url: s.url }))
        : [];
      let body = '';
      if (typeof research?.summary === 'string' && research.summary.trim()) {
        body += research.summary.trim();
      }
      if (Array.isArray(research?.highlights) && research.highlights.length) {
        body += (body ? '\n\n' : '') + 'Highlights:\n- ' + research.highlights.map((h: any) => (typeof h === 'string' ? h : JSON.stringify(h))).join('\n- ');
      }
      if (!body) {
        body = tLabel('No structured summary returned. Showing raw.', '구조화된 요약이 없습니다. 원시 데이터를 표시합니다.') + '\n\n' + (() => { try { return JSON.stringify(research, null, 2); } catch { return String(research); } })();
      }
      const facts = extractFacts(body);
      setMsgs((m) => [
        ...m,
        {
          role: 'assistant',
          content: `${tLabel('NLP profile for', 'NLP 프로필')}: ${uni}\n\n${statsOnly && facts.length ? `${tLabel('Stats-backed summary', '통계 중심 요약')}:\n- ${facts.join('\n- ')}\n\n` : ''}${body}`,
          citations: sources,
          facts,
          ts: Date.now()
        }
      ]);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: tLabel('Web research failed. Try again later.', '웹 조사에 실패했습니다. 나중에 다시 시도하세요.'), ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }

  async function findPapers() {
    const uni = selection?.type === 'school' ? String(selection.id) : '';
    const q = uni || (profile as any)?.targetSchools?.[0] || '';
    if (!q) {
      setMsgs((m) => [...m, { role: 'assistant', content: tLabel('Select a university or specify a topic to find papers.', '논문을 찾으려면 대학 또는 주제를 지정하세요.'), ts: Date.now() }]);
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch('/api/papers/search', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ universityName: uni, topic: '', limit: 5 }) }).then(r=>r.json()).catch(()=>null);
      const items: Array<{ title: string; year?: number; venue?: string; url?: string; doi?: string; authors?: string[] }> = resp?.data?.items || [];
      if (!items.length) {
        setMsgs((m)=>[...m, { role:'assistant', content: tLabel('No papers found. Try another topic.', '논문을 찾지 못했습니다. 다른 주제를 시도하세요.'), ts: Date.now() }]);
        return;
      }
      const lines: string[] = [];
      items.forEach((it, idx) => {
        const meta = [it.venue, it.year ? String(it.year) : null].filter(Boolean).join(' • ');
        const link = it.doi ? `https://doi.org/${it.doi}` : (it.url || '');
        lines.push(`${idx+1}. ${it.title}${meta?` — ${meta}`:''}${link?`\n   ${link}`:''}`);
      });
      setMsgs((m)=>[...m, { role:'assistant', content: `${tLabel('Peer‑reviewed papers', '실제 논문 목록')}\n\n${lines.join('\n')}`, citations: items.map(it=>({ title: it.title, url: it.doi?`https://doi.org/${it.doi}`:it.url })), ts: Date.now() }]);
    } catch {
      setMsgs((m)=>[...m, { role:'assistant', content: tLabel('Paper search failed. Try again later.', '논문 검색에 실패했습니다. 나중에 다시 시도하세요.'), ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }

  function handlePickSuggestion(s: PromptSuggestion) {
    // Put suggestion prompt into the textarea; don't auto-send to allow quick edits
    if (inputRef.current) {
      inputRef.current.value = s.prompt;
      inputRef.current.focus();
    }
  }

  return (
    <div className={`fixed bottom-4 ${side === 'right' ? 'right-4' : 'left-4'} z-30`}>
      {!open && (
        <button onClick={() => setOpen(true)}
          className="rounded-full px-4 py-3 text-white shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500">{tLabel('Chat', '채팅')}</button>
      )}
      {open && (
        <div
          className="rounded-2xl border border-white/10 bg-[#0b0b0e] text-white shadow-2xl flex flex-col"
          style={{ width: `${size.w}px`, height: `${size.h}px` }}
        >
          <div className="h-12 flex items-center justify-between px-3 border-b border-white/10 bg-black/40 backdrop-blur rounded-t-2xl">
            <div className="font-medium flex items-center gap-2">
              <span>AdmitAI Assistant</span>
              <span className="text-xs text-white/60">• {PERSONAS.find(p => p.key === persona)?.label}</span>
              <select
                value={threadId}
                onChange={(e) => {
                  const id = e.target.value;
                  setThreadId(id);
                  const th = threads.find((t) => t.id === id);
                  if (th) setMsgs(th.messages);
                }}
                className="ml-2 text-xs bg-black/30 border border-white/10 rounded px-2 py-1"
              >
                {threads.map((t) => (
                  <option key={t.id} value={t.id}>{t.name || 'Untitled'}</option>
                ))}
              </select>
              <button
                className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/10"
                onClick={() => {
                  const id = crypto.randomUUID();
                  const base: ChatMessage[] = [
                    { role: 'assistant', content: tLabel('New chat started. How can I help?', '새 대화를 시작합니다. 무엇을 도와드릴까요?'), ts: Date.now() }
                  ];
                  setThreads((prev) => [
                    { id, name: 'Untitled', messages: base, updatedAt: Date.now() },
                    ...prev
                  ]);
                  setThreadId(id);
                  setMsgs(base);
                }}
                title={tLabel('New thread', '새 스레드')}
              >{tLabel('New', '새로 만들기')}</button>
              <button
                className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/10"
                onClick={() => { setRenaming(true); setTimeout(() => nameInputRef.current?.focus(), 0); }}
                title={tLabel('Rename thread', '스레드 이름 변경')}
              >{tLabel('Rename', '이름 변경')}</button>
              <button
                className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/10"
                onClick={() => {
                  if (!threadId) return;
                  const next = threads.filter(t => t.id !== threadId);
                  setThreads(next);
                  const fallback = next[0];
                  setThreadId(fallback ? fallback.id : '');
                  setMsgs(fallback ? fallback.messages : [{ role: 'assistant', content: tLabel('New chat started. How can I help?', '새 대화를 시작합니다. 무엇을 도와드릴까요?'), ts: Date.now() }]);
                }}
                title={tLabel('Delete thread', '스레드 삭제')}
              >{tLabel('Delete', '삭제')}</button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSize((s) => ({ w: s.w < 550 ? 560 : 420, h: s.h < 700 ? 720 : 520 }))}
                className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/10"
                title={tLabel('Toggle compact/large', '작게/크게 전환')}
              >{tLabel(size.w < 550 ? 'Large' : 'Compact', size.w < 550 ? '크게' : '작게')}</button>
              <button
                onClick={() => setSide((s) => (s === 'right' ? 'left' : 'right'))}
                className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/10"
                title={tLabel('Dock left/right', '왼쪽/오른쪽 고정')}
              >{side === 'right' ? '⮜ Left' : 'Right ⮞'}</button>
              <button
                onClick={() => setMsgs([{ role: 'assistant', content: tLabel('New chat started. How can I help?', '새 대화를 시작합니다. 무엇을 도와드릴까요?'), ts: Date.now() }])}
                className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/10"
                title={tLabel('Clear conversation', '대화 지우기')}
              >{tLabel('Clear', '지우기')}</button>
              <label className="flex items-center gap-1 text-xs text-white/70">
                <input type="checkbox" checked={receiptsOnly} onChange={(e)=>setReceiptsOnly(e.target.checked)} /> {tLabel('Citations-only', '인용만')}
              </label>
              <label className="flex items-center gap-1 text-xs text-white/70">
                <input type="checkbox" checked={requireCitations} onChange={(e)=>setRequireCitations(e.target.checked)} /> {tLabel('Require citations', '인용 필수')}
              </label>
              <label className="flex items-center gap-1 text-xs text-white/70">
                <input type="checkbox" checked={statsOnly} onChange={(e)=>setStatsOnly(e.target.checked)} /> {tLabel('Stats mode', '통계 모드')}
              </label>
              {selection?.type === 'school' && (
                <button
                  onClick={verifySelectedUniversity}
                  disabled={loading}
                  className={`text-xs px-2 py-1 rounded border border-white/10 ${loading ? 'text-white/40' : 'hover:bg-white/10'}`}
                  title={tLabel('Cross-check insights for selected university', '선택한 대학의 인사이트 교차 검증')}
                >
                  {tLabel('Verify (web)', '검증(웹)')}
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">×</button>
            </div>
          </div>
          {/* Personas */}
          <div className="flex gap-2 px-3 py-2 border-b border-white/10 bg-white/5">
            {PERSONAS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPersona(p.key)}
                className={`rounded-full px-3 py-1 text-xs border ${persona === p.key ? 'bg-indigo-600 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >{p.label}</button>
            ))}
          </div>
          {/* Persona settings */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 text-xs">
            <select value={personaSetting.tone} onChange={(e)=> setPersonaSetting(persona, { ...personaSetting, tone: e.target.value as any })} className="bg-black/40 border border-white/10 rounded px-2 py-1">
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
            <select value={personaSetting.detail} onChange={(e)=> setPersonaSetting(persona, { ...personaSetting, detail: e.target.value as any })} className="bg-black/40 border border-white/10 rounded px-2 py-1">
              <option value="brief">Brief</option>
              <option value="normal">Normal</option>
              <option value="thorough">Thorough</option>
            </select>
            <select value={personaSetting.language} onChange={(e)=> setPersonaSetting(persona, { ...personaSetting, language: e.target.value as any })} className="bg-black/40 border border-white/10 rounded px-2 py-1">
              <option value="en">EN</option>
              <option value="ko">KR</option>
            </select>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {renaming && (
              <div className="px-3">
                <input
                  ref={nameInputRef}
                  defaultValue={(threads.find(t=>t.id===threadId)?.name)||''}
                  onBlur={(e)=>{ setThreads(prev=>prev.map(t=>t.id===threadId?{...t,name:e.target.value||'Untitled'}:t)); setRenaming(false);} }
                  onKeyDown={(e)=>{ if(e.key==='Enter'){ (e.target as HTMLInputElement).blur(); }}}
                  className="w-full text-xs bg-black/30 border border-white/10 rounded px-2 py-1"
                  placeholder={tLabel('Thread name', '스레드 이름')}
                />
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed border ${m.role === 'assistant' ? 'bg-white/5 border-white/10 text-white' : 'bg-purple-600 border-purple-500 text-white'} ${m.role === 'assistant' ? '' : 'ml-auto'}`}>
                {(() => {
                  const text = m.content || '';
                  const shouldClamp = text.length > 1200;
                  const clamped = shouldClamp ? text.slice(0, 1200) + '…' : text;
                  return (
                    <>
                      <div className="whitespace-pre-wrap break-words">{renderMarkdown(clamped)}</div>
                      {shouldClamp && (
                        <button
                          className="mt-2 text-[11px] text-white/70 hover:text-white underline"
                          onClick={(e) => {
                            e.preventDefault();
                            setMsgs((msgsNow) => msgsNow.map((msg, idx) => idx === i ? { ...msg, content: text } : msg));
                          }}
                        >
                          {tLabel('Show more', '더 보기')}
                        </button>
                      )}
                    </>
                  );
                })()}
                {(() => {
                  const next = i < msgs.length-1 ? msgs[i+1] : null;
                  const isGroupEnd = !next || next.role !== m.role;
                  return isGroupEnd ? (
                    <div className={`mt-2 text-[10px] ${m.role === 'assistant' ? 'text-white/50' : 'text-white/80'} italic`}>
                      {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  ) : null;
                })()}
                {m.facts && m.facts.length > 0 && (
                  <div className="mt-2 text-xs text-white/80">
                    <div className="font-semibold mb-1">{tLabel('Evidence', '근거')}</div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {m.facts.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.nextSteps && m.nextSteps.length > 0 && (
                  <div className="mt-2 text-xs text-white/80">
                    <div className="font-semibold mb-1">{tLabel('Next steps', '다음 단계')}</div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {m.nextSteps.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.citations.slice(0, 6).map((c, idx) => (
                      <a
                        key={idx}
                        href={c.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] px-2 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10"
                        title={c.url}
                      >
                        {c.title ? (c.title.length > 40 ? c.title.slice(0, 37) + '…' : c.title) : tLabel('Source', '출처')}
                      </a>
                    ))}
                  </div>
                )}
                {m.role === 'assistant' && (
                  <div className="mt-2">
                    <button
                      className="text-[11px] text-white/70 hover:text-white"
                      title={tLabel('Copy', '복사')}
                      onClick={() => {
                        const cite = m.citations && m.citations.length
                          ? `\n\nSources:\n${m.citations.map((c) => `- ${c.title || c.url || ''} ${c.url ? `(${c.url})` : ''}`).join('\n')}`
                          : '';
                        navigator.clipboard.writeText(m.content + cite).catch(() => {});
                      }}
                    >
                      {tLabel('Copy', '복사')}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed border bg-white/5 border-white/10 text-white`}>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/20" />
                  <div className="flex items-center gap-1 text-white/70">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce" />
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:120ms]" />
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:240ms]" />
                    <span className="ml-2">{tLabel('Assistant is typing…', '어시스턴트가 작성 중…')}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          {/* Suggestions */}
          <div className="border-t border-white/10 p-2">
            {/* Quick actions */}
            <div className="mb-2 flex flex-wrap gap-2">
              {selection?.type==='school' && (
                <>
                  <button onClick={verifySelectedUniversity} className="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10">{tLabel('Verify school', '학교 검증')}</button>
                  <button onClick={researchUniversityWeb} className="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10">{tLabel('NLP profile', 'NLP 프로필')}</button>
                </>
              )}
              <button onClick={findPapers} className="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10">{tLabel('Find papers', '논문 찾기')}</button>
              <button onClick={()=>send('Summarize the key takeaways in 5 bullets with citations.')} className="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10">{tLabel('Summarize', '요약')}</button>
            </div>
            <PromptSuggestions
              context={{ university: selection?.type === 'school' ? selection.id : undefined }}
              onPick={handlePickSuggestion}
            />
          </div>
          <div className="border-t border-white/10 p-2 flex gap-2 items-center relative">
            <textarea
              ref={inputRef}
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/40 resize-none"
              placeholder={tLabel('Ask anything… Press Enter to send, Shift+Enter for new line', '무엇이든 질문하세요… Enter로 보내기, Shift+Enter로 줄바꿈')}
            />
            <button onClick={()=>send()} disabled={loading} className={`rounded-lg px-3 py-2 text-white ${loading ? 'bg-white/20 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'}`}>{loading ? tLabel('Thinking…', '생각 중…') : tLabel('Send', '보내기')}</button>
            <button
              onClick={async ()=>{
                const last = [...msgs].reverse().find(m=>m.role==='assistant');
                const outline = last?.content || '';
                if (!outline.trim()) { setMsgs(m=>[...m,{ role:'assistant', content: tLabel('No outline found in the conversation.', '대화에서 개요를 찾지 못했습니다.'), ts: Date.now()}]); return; }
                try {
                  const title = outline.split('\n').find(l=>l.trim().length>0)?.slice(0,60) || 'New Outline Draft';
                  const res = await essaysAPI.create({ title, content: outline, type: 'personal-statement' });
                  const id = (res.data as any)?.data?.id || (res.data as any)?.essay?.id;
                  if (id) { window.location.href = `/essays/${id}`; }
                } catch {
                  setMsgs(m=>[...m,{ role:'assistant', content: tLabel('Failed to create draft from outline.', '개요에서 초안을 생성하지 못했습니다.'), ts: Date.now()}]);
                }
              }}
              className="rounded-lg px-3 py-2 text-white bg-emerald-600 hover:bg-emerald-500"
              title={tLabel('Create Draft from Outline', '개요로부터 초안 만들기')}
            >
              {tLabel('Create Draft', '초안 만들기')}
            </button>
            {/* Resize handle */}
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                resizingRef.current = { active: true, startX: e.clientX, startY: e.clientY, startW: size.w, startH: size.h };
                const onMove = (ev: MouseEvent) => {
                  if (!resizingRef.current?.active) return;
                  const dx = ev.clientX - (resizingRef.current.startX);
                  const dy = ev.clientY - (resizingRef.current.startY);
                  const newW = Math.max(320, Math.min(560, side === 'right' ? resizingRef.current.startW + dx : resizingRef.current.startW - dx));
                  const newH = Math.max(420, Math.min(720, resizingRef.current.startH + dy));
                  setSize({ w: newW, h: newH });
                };
                const onUp = () => {
                  resizingRef.current = null;
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
              className={`absolute -bottom-2 ${side === 'right' ? '-right-2' : '-left-2'} w-3 h-3 cursor-nwse-resize bg-white/20 rounded-sm`}
              title="Resize"
            />
          </div>
        </div>
      )}
    </div>
  );
}

