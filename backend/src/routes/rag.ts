import express from 'express';
import { logger } from '../utils/logger';
import { upsertDocuments, search, generateInsight, RAGDocument } from '../services/ragService';

const router = express.Router();

router.post('/ingest', async (req, res) => {
  try {
    const docs = (req.body?.docs || []) as RAGDocument[];
    if (!Array.isArray(docs) || docs.length === 0) {
      return res.status(400).json({ success: false, error: 'docs array required' });
    }
    const result = await upsertDocuments(docs.map(d => ({ ...d, id: d.id || `${Date.now()}-${Math.random().toString(36).slice(2)}` })));
    return res.json({ success: true, data: result });
  } catch (err) {
    logger.error('RAG ingest failed', err);
    return res.status(500).json({ success: false, error: 'ingest_failed' });
  }
});

router.post('/search', async (req, res) => {
  try {
    const { query, topK = 6 } = req.body || {};
    if (!query) return res.status(400).json({ success: false, error: 'query required' });
    const result = await search(String(query), Number(topK));
    return res.json({ success: true, data: result });
  } catch (err) {
    logger.error('RAG search failed', err);
    return res.status(500).json({ success: false, error: 'search_failed' });
  }
});

router.post('/insights', async (req, res) => {
  try {
    const { query, topK = 6 } = req.body || {};
    if (!query) return res.status(400).json({ success: false, error: 'query required' });
    const result = await search(String(query), Number(topK));
    const chunks = result.map(r => r.chunk);
    const insight = await generateInsight(String(query), chunks);
    return res.json({ success: true, data: { ...insight, topK: chunks.length } });
  } catch (err) {
    logger.error('RAG insight failed', err);
    return res.status(500).json({ success: false, error: 'insight_failed' });
  }
});

export default router;

