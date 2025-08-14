import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { logger } from '../utils/logger';
import { rateLimit } from 'express-rate-limit';
import { prisma } from '../utils/dbSetup';

const router = express.Router();

// Utility: robust word count for empty or whitespace-only content
function computeWordCount(content?: string | null): number {
  if (!content) return 0;
  const words = content.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

// Rate limiting for AI feedback requests
const feedbackRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many feedback requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Get all essays for a user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const userId = req.user.id;
    
    const essays = await prisma.essay.findMany({
      where: { userId },
      include: {
        feedback: true,
        versions: true,
        analytics: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({
      success: true,
      data: essays,
    });
  } catch (error) {
    logger.error('Error fetching essays:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch essays',
    });
  }
});

/**
 * Get a specific essay by ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Essay ID is required',
      });
    }
    const userId = req.user.id;

    const essay = await prisma.essay.findFirst({
      where: { id, userId },
      include: {
        feedback: {
          orderBy: { createdAt: 'desc' },
        },
        versions: {
          orderBy: { version: 'desc' },
        },
        analytics: true,
      },
    });

    if (!essay) {
      return res.status(404).json({
        success: false,
        message: 'Essay not found',
      });
    }

    return res.json({
      success: true,
      data: essay,
    });
  } catch (error) {
    logger.error('Error fetching essay:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch essay',
    });
  }
});

/**
 * Create a new essay
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const userId = req.user.id;
    const { title, content, type, targetSchool, prompt, universityId, targetWordLimit } = req.body;

    const wordCount = computeWordCount(content);

    const essay = await prisma.essay.create({
      data: {
        userId,
        title,
        content,
        type,
        targetSchool,
        universityId,
        prompt,
        wordCount,
        ...(typeof targetWordLimit === 'number' ? { targetWordLimit } : {}),
        status: 'DRAFT',
      },
    });

    // Create initial version
    await prisma.essayVersion.create({
      data: {
        essayId: essay.id,
        version: 1,
        content,
        wordCount,
      },
    });

    return res.status(201).json({
      success: true,
      data: essay,
    });
  } catch (error) {
    logger.error('Error creating essay:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create essay',
    });
  }
});

/**
 * Update an essay
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Essay ID is required',
      });
    }
    const userId = req.user.id;
    const { title, content, type, targetSchool, prompt, status, universityId, targetWordLimit } = req.body;

    const existingEssay = await prisma.essay.findFirst({
      where: { id, userId },
    });

    if (!existingEssay) {
      return res.status(404).json({
        success: false,
        message: 'Essay not found',
      });
    }

    const newContent = typeof content === 'string' ? content : (existingEssay.content || '');
    const wordCount = computeWordCount(newContent);

    const essay = await prisma.essay.update({
      where: { id },
      data: {
        title,
        content: newContent,
        type,
        targetSchool,
        universityId,
        prompt,
        wordCount,
        status,
        ...(typeof targetWordLimit === 'number' ? { targetWordLimit } : {}),
      },
    });

    // Create new version if content changed
    if (newContent !== existingEssay.content) {
      const latestVersion = await prisma.essayVersion.findFirst({
        where: { essayId: id },
        orderBy: { version: 'desc' },
      });

      await prisma.essayVersion.create({
        data: {
          essayId: id,
          version: (latestVersion?.version || 0) + 1,
          content: newContent,
          wordCount,
        },
      });
    }

    return res.json({
      success: true,
      data: essay,
    });
  } catch (error) {
    logger.error('Error updating essay:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update essay',
    });
  }
});

/**
 * Quick status update for an essay (PATCH /:id/status)
 */
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Essay ID is required' });
    }
    const userId = req.user.id;
    const { status } = req.body as { status?: string };
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const essay = await prisma.essay.findFirst({ where: { id, userId } });
    if (!essay) {
      return res.status(404).json({ success: false, message: 'Essay not found' });
    }

    const updated = await prisma.essay.update({ where: { id }, data: { status } });
    return res.json({ success: true, data: updated });
  } catch (error) {
    logger.error('Error updating essay status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update essay status' });
  }
});

/**
 * Get essays grouped by school with summary stats
 * Useful for the free "Essays" view: list per school, stages, word counts
 */
router.get('/grouped/by-school', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userId = req.user.id;

    const essays = await prisma.essay.findMany({
      where: { userId },
      include: { university: { select: { id: true, name: true, shortName: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    type Group = {
      schoolId: string | null;
      schoolName: string;
      schoolShortName?: string | null;
      essays: Array<{
        id: string;
        title: string;
        status: string;
        wordCount: number;
        prompt?: string | null;
        updatedAt: Date;
      }>;
      totals: {
        essaysCount: number;
        totalWords: number;
        byStatus: Record<string, number>;
      };
    };

    const groupsMap = new Map<string, Group>();

    for (const e of essays) {
      const key = e.university?.id || e.targetSchool || 'Unassigned';
      const name = e.university?.name || e.targetSchool || 'Unassigned';
      const shortName = e.university?.shortName || null;

      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          schoolId: e.university?.id ?? null,
          schoolName: name,
          schoolShortName: shortName,
          essays: [],
          totals: { essaysCount: 0, totalWords: 0, byStatus: {} },
        });
      }
      const g = groupsMap.get(key)!;
      g.essays.push({
        id: e.id,
        title: e.title,
        status: e.status,
        wordCount: e.wordCount,
        prompt: e.prompt,
        updatedAt: e.updatedAt,
      });
      g.totals.essaysCount += 1;
      g.totals.totalWords += e.wordCount || 0;
      g.totals.byStatus[e.status] = (g.totals.byStatus[e.status] || 0) + 1;
    }

    const data = Array.from(groupsMap.values()).sort((a, b) => a.schoolName.localeCompare(b.schoolName));
    return res.json({ success: true, data });
  } catch (error) {
    logger.error('Error grouping essays by school:', error);
    return res.status(500).json({ success: false, message: 'Failed to group essays by school' });
  }
});

/**
 * Aggregate essay stats for the current user
 */
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userId = req.user.id;

    const essays = await prisma.essay.findMany({
      where: { userId },
      select: { status: true, wordCount: true },
    });

    const totals = {
      totalEssays: essays.length,
      totalWords: essays.reduce((sum: number, e: { wordCount: number; status: string }) => sum + (e.wordCount || 0), 0),
      byStatus: essays.reduce<Record<string, number>>((acc: Record<string, number>, e: { status: string; wordCount: number }) => {
        acc[e.status] = (acc[e.status] || 0) + 1;
        return acc;
      }, {}),
    };

    return res.json({ success: true, data: totals });
  } catch (error) {
    logger.error('Error getting essay stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to get essay stats' });
  }
});

/**
 * Delete an essay
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Essay ID is required',
      });
    }
    const userId = req.user.id;

    const essay = await prisma.essay.findFirst({
      where: { id, userId },
    });

    if (!essay) {
      return res.status(404).json({
        success: false,
        message: 'Essay not found',
      });
    }

    await prisma.essay.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Essay deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting essay:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete essay',
    });
  }
});

/**
 * Generate AI feedback for an essay
 * This is the core feature implementing the fine-tuned LLM system
 */
router.post('/:id/feedback', authenticateToken, feedbackRateLimit, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Essay ID is required',
      });
    }
    const userId = req.user.id;

    // Check if AI service is configured
    if (!aiService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'AI feedback service is not configured',
      });
    }

    // Get the essay
    const essay = await prisma.essay.findFirst({
      where: { id, userId },
      include: {
        user: {
          include: {
            profile: {
              include: {
                preferences: true,
                extracurriculars: true,
              },
            },
          },
        },
      },
    });

    if (!essay) {
      return res.status(404).json({
        success: false,
        message: 'Essay not found',
      });
    }

    // Prepare user data for AI feedback
    const userData: {
      gpa?: number;
      extracurriculars?: string;
      targetSchools?: string[];
      essayGoals?: string[];
      language?: 'KO' | 'EN';
    } = {
      gpa: essay.user.profile?.gpa || 0,
      extracurriculars: '',
      targetSchools: (() => {
        const raw = essay.user.profile?.targetSchools as unknown;
        if (typeof raw === 'string') {
          try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed)
              ? parsed.filter((s): s is string => typeof s === 'string')
              : [];
          } catch {
            return [];
          }
        }
        if (Array.isArray(raw)) {
          return raw.filter((s): s is string => typeof s === 'string');
        }
        return [essay.targetSchool].filter((s): s is string => typeof s === 'string');
      })(),
      essayGoals: (() => {
        const goalsRaw = essay.user.profile?.preferences?.essayGoals as unknown;
        if (typeof goalsRaw === 'string') {
          try {
            const parsed = JSON.parse(goalsRaw);
            return Array.isArray(parsed)
              ? parsed.filter((g): g is string => typeof g === 'string')
              : [];
          } catch {
            return [];
          }
        }
        return Array.isArray(goalsRaw)
          ? goalsRaw.filter((g): g is string => typeof g === 'string')
          : [];
      })(),
      language: (essay.user.language === 'KO' || essay.user.language === 'EN') 
        ? essay.user.language 
        : 'EN',
    };

    // Generate AI feedback using the fine-tuned prompt
    const aiFeedback = await aiService.generateEssayFeedback(essay.content, userData);

    // Save feedback to database
    const feedback = await prisma.essayFeedback.create({
      data: {
        essayId: id,
        type: 'CONTENT',
        category: 'CONTENT_SUGGESTION',
        severity: 'MEDIUM',
        title: 'AI-Generated Comprehensive Feedback',
        description: aiFeedback.storylineFeedback.english,
        suggestions: JSON.stringify(aiFeedback.suggestions.english),
        examples: JSON.stringify(aiFeedback.suggestions.korean),
        culturalContext: aiFeedback.culturalContext?.english || null,
      },
    });

    // Update essay analytics
    await prisma.essayAnalytics.upsert({
      where: { essayId: id },
      update: {
        impactScore: aiFeedback.overallScore,
        clarityScore: aiFeedback.overallScore * 0.9, // Mock clarity score
        grammarScore: aiFeedback.overallScore * 0.95, // Mock grammar score
        culturalRelevance: aiFeedback.overallScore * 0.85, // Mock cultural relevance
        authenticityScore: aiFeedback.overallScore * 0.88, // Mock authenticity score
      },
      create: {
        essayId: id,
        impactScore: aiFeedback.overallScore,
        clarityScore: aiFeedback.overallScore * 0.9,
        grammarScore: aiFeedback.overallScore * 0.95,
        culturalRelevance: aiFeedback.overallScore * 0.85,
        authenticityScore: aiFeedback.overallScore * 0.88,
      },
    });

    // Update essay status
    await prisma.essay.update({
      where: { id },
      data: { status: 'FEEDBACK_READY' },
    });

    logger.info('AI feedback generated and saved', {
      essayId: id,
      userId,
      feedbackId: feedback.id,
      score: aiFeedback.overallScore,
    });

    return res.json({
      success: true,
      data: {
        feedback: aiFeedback,
        feedbackId: feedback.id,
        message: 'AI feedback generated successfully',
      },
    });
  } catch (error) {
    logger.error('Error generating AI feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI feedback',
    });
  }
});

/**
 * Get feedback history for an essay
 */
router.get('/:id/feedback', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Essay ID is required',
      });
    }
    const userId = req.user.id;

    const feedback = await prisma.essayFeedback.findMany({
      where: {
        essay: {
          id,
          userId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    logger.error('Error fetching feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
    });
  }
});

/**
 * Generate cultural context suggestions
 */
router.post('/:id/cultural-context', authenticateToken, feedbackRateLimit, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Essay ID is required',
      });
    }
    const userId = req.user.id;

    if (!aiService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured',
      });
    }

    const essay = await prisma.essay.findFirst({
      where: { id, userId },
    });

    if (!essay) {
      return res.status(404).json({
        success: false,
        message: 'Essay not found',
      });
    }

    const culturalSuggestions = await aiService.generateCulturalContextSuggestions(essay.content);

    return res.json({
      success: true,
      data: {
        suggestions: culturalSuggestions,
      },
    });
  } catch (error) {
    logger.error('Error generating cultural context suggestions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate cultural context suggestions',
    });
  }
});

export default router; 