import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import universityAnalysisService from '../services/universityAnalysisService';
import { logger } from '../utils/logger';
import { UNIVERSITY_QUICK_INFO } from '../data/universityQuickInfo';
import { universityDatabaseService } from '../services/universityDatabaseService';
import { prisma } from '../utils/dbSetup';

const router = Router();

// Get university weather analysis for a specific university
router.get('/university/:universityName', authenticateToken, async (req, res) => {
  try {
    const { universityName } = req.params;
    
    if (!universityName) {
      return res.status(400).json({
        success: false,
        message: 'University name is required',
      });
    }

    const insights = await universityAnalysisService.getUniversityInsights(universityName);
    
    return res.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    logger.error('Error fetching university insights:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch university insights',
    });
  }
});

// Analyze essay for specific university
router.post('/essay/university', authenticateToken, async (req, res) => {
  try {
    const { universityName, essayContent } = req.body;
    
    if (!universityName || !essayContent) {
      return res.status(400).json({
        success: false,
        message: 'University name and essay content are required',
      });
    }

    const analysis = await universityAnalysisService.analyzeEssayForUniversity(
      universityName,
      essayContent,
      'personal_statement'
    );

    return res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    logger.error('Error analyzing essay for university:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze essay for university',
    });
  }
});

// Get list of supported universities (from DB)
router.get('/universities', authenticateToken, async (_req, res) => {
  try {
    const universities = await prisma.university.findMany({
      select: { name: true },
      orderBy: { ranking: 'asc' },
      take: 200,
    });

    return res.json({
      success: true,
      data: universities.map((u: { name: string }) => u.name),
    });
  } catch (error) {
    logger.error('Error fetching universities:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch universities',
    });
  }
});

// Get cultural adaptation tips for specific university
router.get('/cultural/:universityName', authenticateToken, async (req, res) => {
  try {
    const { universityName } = req.params;
    
    // Mock cultural adaptation data - replace with actual service call
    const culturalTips = {
      universityName,
      tips: [
        {
          category: 'leadership',
          title: 'Collective Leadership Approach',
          description: 'Emphasize how Korean cultural values of harmony and community can enhance leadership effectiveness',
          examples: [
            'Leading study groups that prioritize collaboration',
            'Organizing community events that bring diverse groups together',
            'Creating inclusive environments in student organizations'
          ]
        },
        {
          category: 'communication',
          title: 'Cultural Bridge Building',
          description: 'Highlight your ability to bridge Korean and American cultural perspectives',
          examples: [
            'Explaining Korean cultural concepts to international friends',
            'Adapting communication styles for different audiences',
            'Sharing Korean traditions while learning American customs'
          ]
        },
        {
          category: 'academic',
          title: 'Educational Background Integration',
          description: 'Connect your Korean educational experiences with American academic values',
          examples: [
            'Applying rigorous study habits from Korean education to American courses',
            'Combining Korean analytical thinking with American creative approaches',
            'Leveraging bilingual skills for research and collaboration'
          ]
        }
      ]
    };

    return res.json({
      success: true,
      data: culturalTips
    });
  } catch (error) {
    logger.error('Error getting cultural adaptation tips:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get cultural adaptation tips'
    });
  }
});

// Get market trends and opportunities
router.get('/market-trends', authenticateToken, async (_req, res) => {
  try {
    // Mock market trends data - replace with actual service call
    const marketTrends = {
      currentYear: 2024,
      trends: [
        {
          category: 'admissions',
          trend: 'Increasing focus on global diversity',
          impact: 'positive',
          description: 'Universities are actively seeking international students with unique cultural perspectives',
          opportunities: [
            'Emphasize Korean cultural background as a unique contribution',
            'Highlight cross-cultural experiences and understanding',
            'Show how Korean values can enhance campus diversity'
          ]
        },
        {
          category: 'programs',
          trend: 'Growth in STEM and interdisciplinary programs',
          impact: 'positive',
          description: 'High demand for students in technology, science, and cross-disciplinary fields',
          opportunities: [
            'Connect Korean educational background with STEM interests',
            'Show interdisciplinary thinking and problem-solving',
            'Highlight innovation and creativity in technical fields'
          ]
        },
        {
          category: 'competition',
          trend: 'Rising application numbers',
          impact: 'negative',
          description: 'More students applying to top universities, increasing competition',
          strategies: [
            'Focus on unique personal story and experiences',
            'Emphasize specific fit with university programs',
            'Highlight distinctive contributions to campus community'
          ]
        }
      ],
      recommendations: [
        'Apply early decision to demonstrate strong interest',
        'Focus on authentic cultural storytelling',
        'Connect personal experiences with university initiatives',
        'Show how Korean background provides unique perspective'
      ]
    };

    return res.json({
      success: true,
      data: marketTrends
    });
  } catch (error) {
    logger.error('Error getting market trends:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get market trends'
    });
  }
});

// Quick links and deadlines (static dataset easy to maintain)
router.get('/universities/quick-info', authenticateToken, async (_req, res) => {
  try {
    const data = Object.values(UNIVERSITY_QUICK_INFO);
    return res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching university quick info:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch quick info' });
  }
});

// Targets briefing: combine user's target schools with deadlines/links and simple recommendations
router.get('/targets/briefing', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Fetch user profile targets
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    let targets: string[] = [];
    try {
      const raw = (profile as any)?.targetSchools;
      if (typeof raw === 'string') {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) targets = parsed.filter((s): s is string => typeof s === 'string');
      }
    } catch {}

    // Fallback to essays' targetSchool values if profile empty
    if (targets.length === 0) {
      const essayTargets = await prisma.essay.findMany({ where: { userId }, select: { targetSchool: true } });
      targets = Array.from(new Set(essayTargets.map(e => e.targetSchool).filter((s): s is string => !!s)));
    }

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const quickByKey = new Map<string, any>();
    for (const info of Object.values(UNIVERSITY_QUICK_INFO)) {
      quickByKey.set(normalize(info.shortName), info);
      quickByKey.set(normalize(info.name), info);
    }

    const externalUniversities = await universityDatabaseService.getAllUniversities();
    const extByKey = new Map<string, any>();
    for (const u of externalUniversities) {
      extByKey.set(normalize(u.id), u);
      extByKey.set(normalize(u.name), u);
      extByKey.set(normalize(u.nameKo), u);
    }

    type TargetOut = {
      name: string;
      shortName?: string;
      deadlines: { earlyDecision?: string | null; earlyAction?: string | null; regularDecision?: string | null; transfer?: string | null };
      links: { admissions?: string; deadlines?: string; apply?: string; prompts?: string; financialAid?: string; international?: string };
      ranking?: number;
      tier?: 'ivy-league' | 'top-20' | 'top-50' | 'top-100' | 'other';
      source: 'quick' | 'external' | 'mixed' | 'unknown';
    };

    const result: TargetOut[] = [];
    const missing: string[] = [];

    for (const targetName of targets) {
      const key = normalize(targetName);
      const q = quickByKey.get(key);
      const ext = extByKey.get(key);

      if (!q && !ext) {
        missing.push(targetName);
        continue;
      }

      const deadlines = q?.deadlines || (ext?.applicationDeadlines ? {
        earlyDecision: ext.applicationDeadlines.earlyDecision || null,
        earlyAction: ext.applicationDeadlines.earlyAction || null,
        regularDecision: ext.applicationDeadlines.regularDecision || null,
        transfer: ext.applicationDeadlines.transfer || null,
      } : { earlyDecision: null, earlyAction: null, regularDecision: null, transfer: null });

      const links = q?.links || {};

      const ranking = (ext?.ranking as number | undefined) ?? undefined;
      let tier: TargetOut['tier'] = 'other';
      if (typeof ranking === 'number') {
        if (ranking <= 20) tier = 'top-20';
        else if (ranking <= 50) tier = 'top-50';
        else if (ranking <= 100) tier = 'top-100';
      }
      if (ext?.type === 'ivy-league') tier = 'ivy-league';

      result.push({
        name: q?.name || ext?.name || targetName,
        shortName: q?.shortName || ext?.id,
        deadlines,
        links,
        ranking,
        tier,
        source: q && ext ? 'mixed' : q ? 'quick' : ext ? 'external' : 'unknown',
      });
    }

    // Cluster by identical dates
    const dateKey = (s?: string | null) => (s ? new Date(s).toISOString().slice(0, 10) : null);
    const clusters: Record<string, { date: string; type: 'ED' | 'EA' | 'RD' | 'TR'; schools: string[] }> = {};
    for (const t of result) {
      const pairs: Array<{ val?: string | null; type: 'ED' | 'EA' | 'RD' | 'TR' }> = [
        { val: t.deadlines.earlyDecision, type: 'ED' },
        { val: t.deadlines.earlyAction, type: 'EA' },
        { val: t.deadlines.regularDecision, type: 'RD' },
        { val: t.deadlines.transfer, type: 'TR' },
      ];
      for (const p of pairs) {
        const dk = dateKey(p.val);
        if (!dk) continue;
        const clusterKey = `${p.type}:${dk}`;
        if (!clusters[clusterKey]) clusters[clusterKey] = { date: dk, type: p.type, schools: [] };
        clusters[clusterKey].schools.push(t.shortName || t.name);
      }
    }

    // Simple ED/EA recommendation
    const edCandidates = result.filter(r => !!r.deadlines.earlyDecision);
    const eaCandidates = result.filter(r => !!r.deadlines.earlyAction);
    const rankValue = (r?: number) => (typeof r === 'number' ? r : 9999);
    const pickBest = (arr: TargetOut[]) => arr.sort((a, b) => rankValue(a.ranking) - rankValue(b.ranking))[0]?.shortName || arr[0]?.name;

    const recommended = {
      ed: edCandidates.length ? pickBest(edCandidates) : null,
      ea: eaCandidates.length ? pickBest(eaCandidates) : null,
    } as const;

    return res.json({ success: true, data: { targets: result, clusters, recommended, missing } });
  } catch (error) {
    logger.error('Error building targets briefing:', error);
    return res.status(500).json({ success: false, message: 'Failed to build targets briefing' });
  }
});

// Update university profile (admin only)
router.put('/university/:universityName', authenticateToken, async (req, res) => {
  try {
    const { universityName } = req.params;
    const updateData = req.body;
    
    if (!universityName) {
      return res.status(400).json({
        success: false,
        message: 'University name is required',
      });
    }

    await universityAnalysisService.updateUniversityProfile(universityName, updateData);
    
    return res.json({
      success: true,
      message: 'University profile updated successfully',
    });
  } catch (error) {
    logger.error('Error updating university profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update university profile',
    });
  }
});

export default router; 