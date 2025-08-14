import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRagInsights } from '../hooks/useRagInsights';

function mdToHtml(md: string): string {
  // Minimal markdown to HTML (bold/italics/links/line breaks). Replace with a proper renderer if needed.
  let html = md
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\n/g, '<br/>');
  return html;
}

function newestDate(citations: { lastUpdated?: string }[] | undefined): string | null {
  if (!citations || citations.length === 0) return null;
  const newest = citations
    .map((c) => (c.lastUpdated ? Date.parse(c.lastUpdated) : 0))
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => b - a)[0];
  return newest ? new Date(newest).toISOString() : null;
}

export function RagInsightsPanel({
  schoolId,
  defaultQuery = 'What are this school’s ED/EA policies?',
  topic = 'policy'
}: { schoolId?: string; defaultQuery?: string; topic?: string }) {
  const { data, loading, error, run } = useRagInsights();
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastChanged, setLastChanged] = useState(false);
  const changeKey = schoolId ? `rag_last_update_${schoolId}_${topic}` : null;

  useEffect(() => {
    if (!changeKey) return;
    if (!data?.lastUpdated) return;
    try {
      const prev = localStorage.getItem(changeKey);
      const now = data.lastUpdated;
      if (prev) {
        const prevWeek = new Date(prev).getTime();
        const nowTs = new Date(now).getTime();
        // mark changed if timestamp differs and within a week window
        if (nowTs !== prevWeek) {
          const msInWeek = 7 * 24 * 3600 * 1000;
          setLastChanged(nowTs - prevWeek <= msInWeek);
        }
      }
      localStorage.setItem(changeKey, now);
    } catch {
      // ignore storage errors
    }
  }, [data?.lastUpdated, changeKey]);

  const lastUpdated = useMemo(() => data?.lastUpdated || newestDate(data?.citations) || undefined, [data]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          className="flex-1 rounded-lg border px-3 py-2"
          defaultValue={defaultQuery}
          placeholder="Ask about policies, essays, or aid…"
          onChange={(e) => run({ query: e.target.value, schoolId, topic, topK: 12 })}
        />
        <button
          className="rounded-lg bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
          onClick={() => run({ query: inputRef.current?.value || defaultQuery, schoolId, topic })}
        >
          Ask
        </button>
      </div>

      <div className="mt-4 min-h-[140px]">
        {loading && <div className="animate-pulse text-slate-500">Thinking…</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && data && (
          <>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: mdToHtml(data.answer) }} />
            <div className="mt-4 border-t pt-3">
              <div className="text-xs text-slate-500 flex items-center">
                <span>
                  Last updated: <strong>{lastUpdated ?? '—'}</strong>
                </span>
                {lastChanged && (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    Policy change this week
                  </span>
                )}
              </div>
              <ul className="mt-2 space-y-1 text-xs">
                {data.citations.map((c: { url?: string; title?: string; lastUpdated?: string }, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <a href={c.url} target="_blank" className="text-slate-700 underline hover:text-slate-900" rel="noreferrer">{c.title || c.url || 'Source'}</a>
                    {c.lastUpdated && <span className="ml-2 text-slate-400">({c.lastUpdated})</span>}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RagInsightsPanel;

