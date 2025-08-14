import axios from 'axios';
import crypto from 'crypto';
import { logger } from '../utils/logger';

export type RAGDocument = {
  id: string;
  school?: string;
  type?: 'policy' | 'prompt' | 'deadline' | 'aid' | 'voice' | 'example' | 'other';
  title?: string;
  url?: string;
  text: string;
  lastUpdated?: string; // ISO
  source?: string; // human label
  metadata?: Record<string, any>;
};

export type RAGChunk = RAGDocument & { idx: number; chunkId: string };

const QDRANT_URL = process.env['QDRANT_URL'] || '';
const QDRANT_API_KEY = process.env['QDRANT_API_KEY'] || '';
const COLLECTION = process.env['QDRANT_COLLECTION'] || 'schools';

const OPENAI_BASE_URL = process.env['OPENAI_BASE_URL'] || 'https://api.openai.com/v1';
const OPENAI_API_KEY = process.env['OPENAI_API_KEY'] || '';
const EMBEDDING_MODEL = process.env['EMBEDDING_MODEL'] || 'nomic-embed-text';

// In-memory fallback vector store if Qdrant not configured
const inMemoryStore: { vector: number[]; chunk: RAGChunk }[] = [];

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export async function embed(text: string): Promise<number[]> {
  try {
    const isOfficialOpenAI = OPENAI_BASE_URL.includes('api.openai.com');
    if (isOfficialOpenAI && !OPENAI_API_KEY) throw new Error('OpenAI key required');
    const res = await axios.post(
      `${OPENAI_BASE_URL}/embeddings`,
      { model: EMBEDDING_MODEL, input: normalizeWhitespace(text).slice(0, 8000) },
      { headers: { 'Content-Type': 'application/json', ...(OPENAI_API_KEY ? { Authorization: `Bearer ${OPENAI_API_KEY}` } : {}) } }
    );
    return res.data.data[0].embedding as number[];
  } catch (err) {
    // Fallback: deterministic pseudo-embedding
    logger.warn('Embedding fallback in use:', err instanceof Error ? err.message : String(err));
    const hash = crypto.createHash('sha256').update(text).digest();
    const vec = new Array(256).fill(0).map((_, i) => {
      const byte = hash[i % hash.length] ?? 0;
      return (byte / 255) * 2 - 1;
    });
    return vec;
  }
}

export function chunkDocument(doc: RAGDocument, chunkSize = 800, overlap = 120): RAGChunk[] {
  const text = normalizeWhitespace(doc.text);
  const out: RAGChunk[] = [];
  let idx = 0;
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunkText = text.slice(i, i + chunkSize);
    out.push({ ...doc, text: chunkText, idx, chunkId: `${doc.id}:${idx}` });
    idx += 1;
    if (i + chunkSize >= text.length) break;
  }
  if (out.length === 0) out.push({ ...doc, idx: 0, chunkId: `${doc.id}:0` });
  return out;
}

async function ensureQdrantCollection(): Promise<void> {
  if (!QDRANT_URL) return;
  try {
    const headers = QDRANT_API_KEY ? { 'api-key': QDRANT_API_KEY } : undefined;
    const config = headers ? { headers } : {};
    await axios.put(
      `${QDRANT_URL}/collections/${COLLECTION}`,
      { vectors: { size: 768, distance: 'Cosine' } },
      config
    );
  } catch (e) {
    // ignore; collection may already exist
  }
}

export async function upsertDocuments(docs: RAGDocument[]): Promise<{ upserted: number }>
{
  const allChunks = docs.flatMap((d) => chunkDocument(d));
  if (QDRANT_URL) {
    try {
      await ensureQdrantCollection();
      const points = await Promise.all(
        allChunks.map(async (c) => ({
          id: c.chunkId,
          vector: await embed(`${c.title || ''} ${c.text}`),
          payload: c,
        }))
      );
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (QDRANT_API_KEY) headers['api-key'] = QDRANT_API_KEY;
      await axios.put(
        `${QDRANT_URL}/collections/${COLLECTION}/points?wait=true`,
        { points },
        { headers }
      );
    } catch (err) {
      logger.warn('Qdrant upsert failed; falling back to in-memory store', err);
      for (const c of allChunks) {
        const vector = await embed(`${c.title || ''} ${c.text}`);
        inMemoryStore.push({ vector, chunk: c });
      }
    }
  } else {
    // in-memory fallback
    for (const c of allChunks) {
      const vector = await embed(`${c.title || ''} ${c.text}`);
      inMemoryStore.push({ vector, chunk: c });
    }
  }
  return { upserted: allChunks.length };
}

export async function search(query: string, topK = 6): Promise<Array<{ score: number; chunk: RAGChunk }>> {
  if (QDRANT_URL) {
    try {
      const v = await embed(query);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (QDRANT_API_KEY) headers['api-key'] = QDRANT_API_KEY;
      const res = await axios.post(
        `${QDRANT_URL}/collections/${COLLECTION}/points/search`,
        { vector: v, limit: topK, with_payload: true },
        { headers }
      );
      return (res.data.result || []).map((r: any) => ({ score: r.score, chunk: r.payload as RAGChunk }));
    } catch (err) {
      logger.warn('Qdrant search failed; falling back to in-memory search', err);
      // continue to in-memory path
    }
  }
  // in-memory cosine similarity
  const qv = await embed(query);
  const dot = (a: number[], b: number[]) => a.reduce((sum, value, i) => sum + value * (b[i] ?? 0), 0);
  const norm = (a?: number[]) => a && a.length > 0 ? Math.sqrt(dot(a, a)) : 1;
  const qn = norm(qv) || 1;
  const scored = inMemoryStore.map((p: { vector: number[]; chunk: RAGChunk }) => ({ score: dot(qv, p.vector ?? []) / (qn * (norm(p.vector) || 1)), chunk: p.chunk }));
  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}

export async function generateInsight(query: string, chunks: RAGChunk[]): Promise<{ answer: string; citations: any[] }>
{
  const sys = `You are a precise admissions assistant. Answer ONLY using provided chunks. Always include citations with title/url/lastUpdated.`;
  const context = chunks.map((c, i) => `[[${i+1}]] title=${c.title || c.source || c.url || 'Doc'} url=${c.url || c.source || ''} lastUpdated=${c.lastUpdated || c.metadata?.['lastUpdated'] || ''}\n${c.text}`).join('\n\n');
  const user = `Question: ${query}\n\nContext:\n${context}\n\nReturn plain text answer followed by a citations list like:\nCitations: [ [1] Title (url, lastUpdated), ... ]`;

  const isOfficialOpenAI = OPENAI_BASE_URL.includes('api.openai.com');
  if (isOfficialOpenAI && !OPENAI_API_KEY) throw new Error('OpenAI key not configured');
  const res = await axios.post(
    `${OPENAI_BASE_URL}/chat/completions`,
    { model: process.env['OPENAI_MODEL'] || 'gpt-4o-mini', temperature: 0.2, messages: [{ role:'system', content: sys }, { role:'user', content: user }] },
    { headers: { 'Content-Type':'application/json', ...(OPENAI_API_KEY ? { Authorization: `Bearer ${OPENAI_API_KEY}` } : {}) } }
  );
  const answer = res.data.choices?.[0]?.message?.content || '';
  const citations = chunks.map((c, i) => ({ idx: i+1, title: c.title || c.source || c.url || 'Doc', url: c.url || '', lastUpdated: c.lastUpdated || (c.metadata ? c.metadata['lastUpdated'] : '') || '' }));
  return { answer, citations };
}

/**
 * Lightweight health check for Qdrant
 */
export async function pingQdrant(): Promise<boolean> {
  // If Qdrant is not configured, treat as healthy (in-memory fallback is available)
  if (!QDRANT_URL) return true;
  try {
    // Prefer collections listing as a cheap call; /healthz is also acceptable
    const headers = QDRANT_API_KEY ? { 'api-key': QDRANT_API_KEY } : undefined;
    const config = headers ? { headers } : {};
    const res = await axios.get(
      `${QDRANT_URL}/collections`,
      config
    );
    return res.status >= 200 && res.status < 300;
  } catch (_err) {
    return false;
  }
}

