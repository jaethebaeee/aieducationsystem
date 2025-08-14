import express from 'express';
import { grammarService } from '../services/grammarService';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: grammarService.isServiceAvailable() ? 'OK' : 'DEGRADED',
    tool_available: grammarService.isServiceAvailable(),
  });
});

router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body as { text?: string };
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'text is required' });
    }
    const analysis = await grammarService.analyzeEssay(text);
    return res.json({ success: true, data: analysis });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to analyze text' });
  }
});

router.post('/suggestions', async (req, res) => {
  try {
    const { text } = req.body as { text?: string };
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'text is required' });
    }
    const suggestions = await grammarService.getSuggestions(text);
    return res.json({ success: true, data: { suggestions } });
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Failed to get suggestions' });
  }
});

router.post('/check', async (req, res) => {
  try {
    const { text } = req.body as { text?: string };
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'text is required' });
    }
    const result = await grammarService.quickCheck(text);
    return res.json({ success: true, data: result });
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Failed to run quick check' });
  }
});

export default router;

