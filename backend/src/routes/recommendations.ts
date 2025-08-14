import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../utils/dbSetup';
import { logger } from '../utils/logger';

const router = express.Router();

// Minimal metadata to enrich recommendations (app platform and sample deadlines)
const UNIVERSITY_META: Record<string, { requires: string[]; deadlines: { type: string; date: string }[] }> = {
  'stanford': {
    requires: ['Common App', 'Stanford Questions', 'School Report & Transcript', 'Teacher Evaluations', 'SAT/ACT optional'],
    deadlines: [
      { type: 'Restrictive Early Action', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-05' },
    ],
  },
  'harvard': {
    requires: ['Common App or Coalition', 'Harvard Supplement', 'School Report & Transcript', 'Teacher Recommendations', 'SAT/ACT required'],
    deadlines: [
      { type: 'Restrictive Early Action', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-01' },
    ],
  },
  'mit': {
    requires: ['MIT Application', 'Secondary School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    deadlines: [
      { type: 'Early Action', date: '2025-11-01' },
      { type: 'Regular Action', date: '2026-01-06' },
    ],
  },
  'yale': {
    requires: ['Common App or Coalition', 'Yale-Specific Questions', 'School Report & Transcript', 'Two Teacher Recommendations', 'Standardized Tests required'],
    deadlines: [
      { type: 'Single-Choice Early Action', date: '2025-11-01' },
      { type: 'Regular Decision', date: '2026-01-02' },
    ],
  },
  'uc-berkeley': {
    requires: ['UC Application', 'Academic History', 'PIQs', 'No Letters of Rec (generally)'],
    deadlines: [
      { type: 'Application Deadline', date: '2025-11-30' },
    ],
  },
  'ucla': {
    requires: ['UC Application', 'PIQs'],
    deadlines: [
      { type: 'Application Deadline', date: '2025-11-30' },
    ],
  },
};

function computeFitScore(ranking: number | null | undefined, requires: string[]): number {
  const base = ranking ? Math.max(50, 95 - Math.min(50, ranking)) : 70;
  let score = base;
  if (requires.some(r => r.toLowerCase().includes('common app'))) score += 4;
  if (requires.some(r => r.includes('UC'))) score += 3;
  return Math.max(50, Math.min(96, score));
}

router.get('/universities', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Fetch universities from DB
    const universities = await prisma.university.findMany({ orderBy: { ranking: 'asc' } });

    // Optionally exclude user's existing targets if profile exists
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { profile: true } });
    const existingTargets: Set<string> = new Set();
    if (user?.profile?.targetSchools) {
      try {
        const arr = JSON.parse(user.profile.targetSchools) as string[];
        arr.forEach((name) => existingTargets.add(name.toLowerCase()));
      } catch {
        // ignore parse errors
      }
    }

    const now = new Date();
    const results = universities
      .filter((u: { name: string }) => !existingTargets.has(u.name.toLowerCase()))
      .slice(0, 100)
      .map((u: { id: string; name: string; website: string | null; ranking: number | null; shortName: string }) => {
        const meta = UNIVERSITY_META[u.shortName] || UNIVERSITY_META[u.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')];
        const requires = meta?.requires || ['Common App (varies)'];
        const deadlines = meta?.deadlines || [];
        const soonest = deadlines
          .map((d: { date: string }) => new Date(d.date))
          .filter((d: Date) => !isNaN(d.getTime()) && d > now)
          .sort((a: Date, b: Date) => +a - +b)[0];
        const score = computeFitScore(u.ranking ?? null, requires);
        const appPlatform = requires.find(r => r.includes('UC')) ? 'UC' : (requires.find(r => r.toLowerCase().includes('common app')) ? 'Common App' : 'Other');
        return {
          id: u.id,
          name: u.name,
          website: u.website,
          ranking: u.ranking,
          appPlatform,
          nextDeadline: soonest ? soonest.toISOString().slice(0, 10) : null,
          requires,
          score,
          badges: [appPlatform].filter(Boolean),
        };
      })
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 12);

    return res.json({ success: true, data: { recommendations: results } });
  } catch (error) {
    logger.error('Error generating university recommendations:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate recommendations' });
  }
});

export default router;

