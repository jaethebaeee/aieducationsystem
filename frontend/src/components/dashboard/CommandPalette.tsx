import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../stores/useWorkspace';

type Command = {
  id: string;
  label: string;
  hint?: string;
  action: () => void | Promise<void>;
  group?: string;
};

export default function CommandPalette({ resources = [], universities = [], essays = [], onClose }: {
  resources?: Array<{ id: string; title: string; schoolId?: string }>;
  universities?: Array<{ id: string; name: string }>;
  essays?: Array<{ id: string; title: string }>;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { selection } = useWorkspace();

  const base: Command[] = useMemo(() => [
    { id: 'new-essay', label: 'New essay…', hint: 'Create a new essay', action: () => navigate('/essays/new'), group: 'Global' },
    { id: 'open-dashboard', label: 'Open dashboard', action: () => navigate('/dashboard'), group: 'Global' },
    { id: 'open-resources', label: 'Browse resources', action: () => navigate('/resources'), group: 'Global' },
    selection?.type === 'essay' ? { id: 'open-essay', label: 'Open selected essay', action: () => navigate(`/essays/${selection.id}`), group: 'Context' } : null,
    selection?.type === 'school' ? { id: 'ask-policy', label: `Ask AI: ${selection.id} policy`, action: () => document.dispatchEvent(new CustomEvent('chat:toggle')), group: 'AI' } : null,
  ].filter(Boolean) as Command[], [navigate, selection]);

  const fromData: Command[] = useMemo(() => [
    ...universities.slice(0, 50).map(u => ({ id: `uni:${u.id}`, label: `University: ${u.name}`, action: () => navigate('/universities'), group: 'Universities' })),
    ...essays.slice(0, 50).map(e => ({ id: `essay:${e.id}`, label: `Essay: ${e.title}`, action: () => navigate(`/essays/${e.id}`), group: 'Essays' })),
    ...resources.slice(0, 50).map(r => ({ id: `res:${r.id}`, label: `Resource: ${r.title}`, action: () => navigate('/resources'), group: 'Resources' })),
  ], [essays, resources, universities, navigate]);

  const items = useMemo(() => {
    const q = query.toLowerCase().trim();
    const all = [...base, ...fromData];
    if (!q) return all.slice(0, 30);
    return all.filter(c => c.label.toLowerCase().includes(q)).slice(0, 30);
  }, [base, fromData, query]);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setIdx(i => Math.min(i + 1, items.length - 1));
      if (e.key === 'ArrowUp') setIdx(i => Math.max(i - 1, 0));
      if (e.key === 'Enter') { items[idx]?.action(); onClose(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, items, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6" onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl" onClick={(e)=>e.stopPropagation()}>
        <div className="border-b p-3">
          <input ref={inputRef} value={query} onChange={(e)=>{ setQuery(e.target.value); setIdx(0); }} placeholder="Search commands, schools, essays…" className="w-full rounded-lg border px-3 py-2 outline-none" />
        </div>
        <div className="max-h-[60vh] overflow-auto">
          {items.length === 0 ? (
            <div className="p-3 text-sm text-slate-500">No results</div>
          ) : (
            items.map((c, i) => (
              <button key={c.id} onClick={()=>{ c.action(); onClose(); }} className={`w-full flex items-center justify-between px-3 py-2 text-left ${i===idx?'bg-slate-100':''}`}>
                <div>
                  <div className="text-sm">{c.label}</div>
                  {c.hint && <div className="text-xs text-slate-500">{c.hint}</div>}
                </div>
                {c.group && <span className="text-[10px] rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{c.group}</span>}
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between border-t p-2 text-[11px] text-slate-500">
          <div>Enter to run • Esc to close</div>
          <div className="flex items-center gap-2"><kbd className="rounded border px-1.5">⌘</kbd><span>K</span></div>
        </div>
      </div>
    </div>
  );
}

