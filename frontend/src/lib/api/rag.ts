export type RagDoc = {
  id: string;
  school?: string;
  type?: string;
  title?: string;
  url?: string;
  text: string;
  lastUpdated?: string;
};

export type RagInsightReq = {
  query: string;
  schoolId?: string;
  topic?: string; // "policy" | "essay" | "aid" ...
  profile?: Record<string, unknown>; // optional personalization
  topK?: number;
};

export type RagCitation = {
  title?: string;
  url?: string;
  type?: string;
  lastUpdated?: string;
};

export type RagInsightRes = {
  answer: string; // markdown/plain
  citations: RagCitation[];
  lastUpdated?: string; // newest among retrieved chunks
};

type ApiEnvelope<T> = { success: boolean; data?: T; error?: string };

export async function fetchRagInsights(
  body: RagInsightReq,
  signal?: AbortSignal
): Promise<RagInsightRes> {
  const res = await fetch('/api/rag/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with ${res.status}`);
  }
  const json = (await res.json()) as ApiEnvelope<RagInsightRes & { topK?: number }>;
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to fetch RAG insights');
  }
  const d = json.data;
  // Compute lastUpdated if not present
  if (!d.lastUpdated && Array.isArray(d.citations)) {
    const newest = d.citations
      .map((c) => (c.lastUpdated ? Date.parse(c.lastUpdated) : 0))
      .filter((n) => Number.isFinite(n) && n > 0)
      .sort((a, b) => b - a)[0];
    if (newest) {
      d.lastUpdated = new Date(newest).toISOString();
    }
  }
  return d;
}

// Thin wrapper matching simpler client signature
export async function ragInsights(body: {
  query: string; schoolId?: string; topic?: string; topK?: number; profile?: any;
}) {
  return await fetchRagInsights(body);
}

export async function ragSearch(body: { query: string; schoolId?: string; topK?: number; }) {
  const res = await fetch('/api/rag/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  const arr = (json?.data || json?.result || json) as Array<{ score: number; chunk: any }>;
  const hits = Array.isArray(arr) ? arr.map((r) => {
    const c = (r as any).chunk || r;
    return {
      text: c?.text || '',
      title: c?.title,
      url: c?.url,
      type: c?.type,
      lastUpdated: c?.lastUpdated || c?.metadata?.lastUpdated,
    };
  }) : [];
  return { hits } as { hits: { text: string; title?: string; url?: string; type?: string; lastUpdated?: string }[] };
}

