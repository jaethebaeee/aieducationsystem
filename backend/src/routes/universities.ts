import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../utils/dbSetup';
import { UNIVERSITY_QUICK_INFO } from '../data/universityQuickInfo';

const router = Router();

// Search universities (by name/shortName)
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json({ success: true, data: [] });
    const results = await prisma.university.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { shortName: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
      orderBy: [{ ranking: 'asc' }],
    });
    return res.json({ success: true, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Search failed' });
  }
});

// Get consolidated cycle dataset with quick-info fallback
router.get('/:shortName/cycles/:year', authenticateToken, async (req, res) => {
  try {
    const { shortName, year } = req.params as { shortName: string; year: string };
    const uni = await prisma.university.findFirst({ where: { shortName }, include: { cycles: { where: { cycleYear: Number(year) }, include: { links: true, deadlines: true, prompts: true, testing: true, aid: true, scholarships: true, stats: true, policies: true, signals: true, weather: true } } } });
    const cycle = uni?.cycles?.[0];
    if (cycle) return res.json({ success: true, data: { university: uni, cycle } });
    // Fallback to quick info
    const qi = UNIVERSITY_QUICK_INFO[shortName as keyof typeof UNIVERSITY_QUICK_INFO];
    if (qi) {
      const data = {
        university: uni || { name: qi.name, shortName: qi.shortName, website: qi.website },
        cycle: {
          cycleYear: Number(year),
          links: qi.links,
          deadlines: qi.deadlines,
        },
      };
      return res.json({ success: true, data });
    }
    return res.status(404).json({ success: false, message: 'Not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch cycle' });
  }
});

// Get weather snapshot for a cycle (compute simple fallback)
router.get('/:shortName/cycles/:year/weather', authenticateToken, async (req, res) => {
  try {
    const { shortName, year } = req.params as { shortName: string; year: string };
    const uni = await prisma.university.findFirst({ where: { shortName }, include: { cycles: { where: { cycleYear: Number(year) }, include: { deadlines: true, weather: true, signals: true } } } });
    const cycle = uni?.cycles?.[0];
    if (!cycle) return res.status(404).json({ success: false, message: 'Not found' });
    const earliest = cycle.deadlines.sort((a, b) => +a.date - +b.date)[0];
    const computePressure = () => {
      let score = 50;
      if (uni?.ranking != null) score += uni.ranking <= 20 ? 30 : uni.ranking <= 50 ? 18 : 10;
      if (earliest) {
        const days = Math.round((+earliest.date - +new Date()) / (1000 * 60 * 60 * 24));
        if (days <= 30) score += 20; else if (days <= 60) score += 10; else if (days <= 120) score += 5;
      }
      return Math.max(0, Math.min(100, score));
    };
    const out = {
      pressureIndex: cycle.weather?.pressureIndex ?? computePressure(),
      topSignals: cycle.weather?.topSignals ? JSON.parse(cycle.weather.topSignals) : (cycle.signals || []).slice(0, 3).map(s => ({ label: s.label, change: s.change, detail: s.detail })),
      nextDeadline: earliest?.date ?? null,
      computedAt: cycle.weather?.computedAt ?? new Date(),
    };
    return res.json({ success: true, data: out });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch weather' });
  }
});

// Get scholarships for a given cycle
router.get('/:shortName/cycles/:year/scholarships', authenticateToken, async (req, res) => {
  try {
    const { shortName, year } = req.params as { shortName: string; year: string };
    const uni = await prisma.university.findFirst({ where: { shortName }, include: { cycles: { where: { cycleYear: Number(year) }, include: { scholarships: true } } } });
    const cycle = uni?.cycles?.[0];
    if (!cycle) return res.status(404).json({ success: false, message: 'Not found' });
    const rows = (cycle.scholarships || []).map((s) => ({ id: s.id, name: s.name, deadline: s.deadline, link: s.link, external: s.external }));
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch scholarships' });
  }
});

// Get prompts for a given cycle
router.get('/:shortName/cycles/:year/prompts', authenticateToken, async (req, res) => {
  try {
    const { shortName, year } = req.params as { shortName: string; year: string };
    const uni = await prisma.university.findFirst({ where: { shortName }, include: { cycles: { where: { cycleYear: Number(year) }, include: { prompts: true } } } });
    const cycle = uni?.cycles?.[0];
    if (!cycle) return res.status(404).json({ success: false, message: 'Not found' });
    const rows = (cycle.prompts || []).map((p) => ({ id: p.id, promptType: p.promptType, program: p.program, question: p.question, minWords: p.minWords, maxWords: p.maxWords, required: p.required }));
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch prompts' });
  }
});

export default router;

