import React, { useEffect, useState } from 'react';
import { ragSearch } from '../lib/api/rag';

export function RelatedRagSources({ schoolId, query }: { schoolId?: string; query: string }) {
  const [hits, setHits] = useState<any[]>([]);
  useEffect(() => {
    if (!query) return;
    ragSearch({ query, schoolId, topK: 6 }).then((r) => setHits(r.hits)).catch(() => setHits([]));
  }, [query, schoolId]);

  if (!hits.length) return null;
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-sm font-medium">Related sources</div>
      <ul className="mt-2 space-y-1 text-xs">
        {hits.map((h, i) => (
          <li key={i}>
            <a href={h.url ?? '#'} target="_blank" className="underline" rel="noreferrer">
              {h.title ?? h.url ?? 'Source'}
            </a>
            {h.lastUpdated && <span className="ml-2 text-slate-400">({h.lastUpdated})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RelatedRagSources;

