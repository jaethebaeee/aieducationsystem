import { Router } from 'express';
import { readFileSync } from 'fs';
import path from 'path';

const router = Router();

// Placeholder parity data; in production, back this with logs and WMT exports
router.get('/parity', (_req, res) => {
  try {
    const filePath = path.resolve(process.cwd(), 'monitoring/seo/sample-parity.json');
    const raw = readFileSync(filePath, 'utf-8');
    const payload = JSON.parse(raw);
    res.json({ success: true, data: { generatedAt: payload.generatedAt, windows: ['7d', '28d'], pages: payload.pages, parityThresholds: payload.parityThresholds } });
  } catch (e) {
    res.status(200).json({ success: true, data: { generatedAt: new Date().toISOString(), windows: ['7d', '28d'], pages: [], parityThresholds: {} } });
  }
});

export default router;

