import React, { useEffect, useState } from 'react';
import { useUI } from '../../contexts/UIContext';
import { useWorkspace } from '../../stores/useWorkspace';

// wire this to your /api/rag/insights
async function fetchBriefing(sel: { type: 'school' | 'essay'; id: string }) {
  const query = sel.type === 'school'
    ? 'Summarize latest policy changes and give top 3 next steps.'
    : 'Summarize current essay status and give top 3 improvements.';
  const res = await fetch('/api/rag/insights', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, schoolId: sel.type === 'school' ? sel.id : undefined, topK: 12 })
  });
  const j = await res.json();
  return j.data as { answer: string; citations: { title?: string; url?: string; lastUpdated?: string }[]; lastUpdated?: string };
}

export default function RightDrawer({ open, onClose, selection }: {
  open: boolean; onClose: () => void; selection: { type: 'school' | 'essay'; id: string } | null;
}) {
  const [data, setData] = useState<any>(null);
  const profile = useWorkspace((s) => s.profile);
  const { theme } = useUI();
  useEffect(() => {
    if (!open || !selection) return;
    setData(null);
    fetchBriefing(selection).then(setData).catch(() => setData({ answer: 'Failed to load' }));
  }, [open, selection]);

  return (
    <div className={`fixed right-0 top-0 h-full w-full sm:w-[460px] transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'} z-40`}>
      <div className={theme==='dark' ? 'h-full border-l border-white/10 bg-[#0d0d10] shadow-2xl flex flex-col text-white' : 'h-full border-l bg-white shadow-xl flex flex-col'}>
        <div className={theme==='dark' ? 'h-14 flex items-center justify-between px-4 border-b border-white/10' : 'h-14 flex items-center justify-between px-4 border-b'}>
          <div className="font-semibold">Briefing</div>
          <div className="flex items-center gap-2">
            <button onClick={() => selection && fetchBriefing(selection).then(setData)} className={theme==='dark' ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-900'} title="Refresh">⟳</button>
            <button onClick={onClose} className={theme==='dark' ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-900'}>Close</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {!data ? <div className="animate-pulse text-slate-500">Loading…</div> :
            <>
              <div className={theme==='dark' ? 'prose prose-invert prose-sm max-w-none whitespace-pre-wrap' : 'prose prose-sm max-w-none whitespace-pre-wrap'}>{data.answer}</div>
              <div className={theme==='dark' ? 'mt-4 border-t border-white/10 pt-3' : 'mt-4 border-t pt-3'}>
                <div className={theme==='dark' ? 'text-xs text-white/60' : 'text-xs text-slate-500'}>Last updated: <b>{data.lastUpdated ?? '—'}</b></div>
                <ul className="mt-2 space-y-1 text-xs">
                  {data.citations?.map((c: any, i: number) => (
                    <li key={i}><a className="underline" target="_blank" rel="noreferrer" href={c.url ?? '#'}>{c.title ?? c.url ?? 'Source'}</a>
                      {c.lastUpdated && <span className={theme==='dark' ? 'ml-2 text-white/40' : 'ml-2 text-slate-400'}>({c.lastUpdated})</span>}
                    </li>
                  ))}
                </ul>
              </div>
              {profile && (
                <div className={theme==='dark' ? 'mt-4 rounded-md bg-white/5 border border-white/10 p-2 text-xs text-white/80' : 'mt-4 rounded-md bg-slate-50 p-2 text-xs text-slate-600'}>
                  Profile context: {profile.major ? `Major ${profile.major}` : ''}{profile.intl ? ' • International' : ''}{typeof profile.budget === 'number' ? ` • Budget $${profile.budget}` : ''}
                </div>
              )}
            </>}
        </div>
        <div className={theme==='dark' ? 'border-t border-white/10 p-3 flex gap-2 sticky bottom-0 bg-[#0d0d10]/90 backdrop-blur' : 'border-t p-3 flex gap-2 sticky bottom-0 bg-white/90 backdrop-blur'}>
          <button className={theme==='dark' ? 'rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm' : 'rounded-lg border px-3 py-2 text-sm'}>Add to plan</button>
          <button className={theme==='dark' ? 'rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm' : 'rounded-lg border px-3 py-2 text-sm'}>Open essay</button>
        </div>
      </div>
    </div>
  );
}

