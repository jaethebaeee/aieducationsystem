import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * POST /api/papers/search
 * body: { universityName?: string; topic?: string; limit?: number }
 * Returns top papers from Semantic Scholar (or similar) with title, year, venue, authors, url, doi
 */
router.post('/search', authenticateToken, async (req, res) => {
  try {
    const { universityName, topic, limit } = (req.body || {}) as { universityName?: string; topic?: string; limit?: number };
    const q = [universityName, topic].filter(Boolean).join(' ');
    if (!q.trim()) {
      return res.status(400).json({ success: false, error: 'Query is required (universityName or topic)' });
    }

    const apiKey = process.env['SEMANTIC_SCHOLAR_API_KEY'];
    const params = new URLSearchParams({
      query: q,
      limit: String(Math.min(Math.max(limit || 5, 1), 10)),
      fields: 'title,year,venue,journal,authors,url,externalIds,doi'
    });

    const resp = await axios.get(`https://api.semanticscholar.org/graph/v1/paper/search?${params.toString()}`,
      {
        timeout: 12000,
        headers: apiKey ? { 'x-api-key': apiKey } : undefined
      }
    );

    const data = Array.isArray(resp.data?.data) ? resp.data.data : [];
    const items = data.map((p: any) => ({
      title: p.title,
      year: p.year,
      venue: p.venue || p.journal?.name || null,
      authors: Array.isArray(p.authors) ? p.authors.map((a: any) => a?.name).filter(Boolean) : [],
      doi: p.doi || p.externalIds?.DOI || null,
      url: p.url || (p.externalIds?.DOI ? `https://doi.org/${p.externalIds.DOI}` : null)
    })).filter((x: any) => x.title);

    return res.json({ success: true, data: { query: q, items } });
  } catch (error) {
    logger.error('Paper search failed', error);
    return res.status(500).json({ success: false, error: 'Failed to search papers' });
  }
});

export default router;

