import express from 'express';
import { prisma } from '../utils/dbSetup';
import { CustomError } from '../types/errors';
import { authenticateToken } from '../middleware/auth';
import { AIService } from '../services/aiService';

const router = express.Router();
const aiService = new AIService();

// Generate AI feedback for essay
router.post('/generate/:essayId', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    const essayId = req.params['essayId'];
    if (!essayId) {
      return res.status(400).json({
        success: false,
        message: 'Essay ID is required',
      });
    }
    
    const essay = await prisma.essay.findFirst({
      where: {
        id: essayId,
        userId: req.user.id,
      },
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
      throw new CustomError('Essay not found', 404);
    }

    // Get user data for AI context
    const userData = {
      gpa: essay.user.profile?.gpa || undefined,
      extracurriculars: Array.isArray(essay.user.profile?.extracurriculars)
        ? (essay.user.profile?.extracurriculars as Array<{ name?: string }>).map((e: { name?: string }) => (typeof e?.name === 'string' ? e.name : '')).filter(Boolean).join(', ')
        : undefined,
      targetSchools: essay.user.profile?.targetSchools ? JSON.parse(essay.user.profile.targetSchools) : undefined,
      essayGoals: essay.user.profile?.preferences?.essayGoals ? JSON.parse(essay.user.profile.preferences.essayGoals) : undefined,
      language: (essay.user.language as 'EN' | 'KO') || 'EN',
    } as {
      gpa?: number;
      extracurriculars?: string;
      targetSchools?: string[];
      essayGoals?: string[];
      language?: 'EN' | 'KO';
    };

    // Generate real AI feedback (optional persona)
    const persona = (req.body?.persona as 'dean' | 'alumni' | 'ta' | undefined);
    const aiFeedback = await aiService.generateEssayFeedback(
      essay.content,
      userData,
      persona ? { persona } : {}
    );

    // Transform AI feedback to our database format
    const feedbackData = [
      {
        type: 'GRAMMAR',
        category: 'GRAMMAR_ERROR',
        severity: 'LOW',
        title: 'Grammar and Style Feedback',
        description: aiFeedback.grammarFeedback.english,
        suggestions: aiFeedback.suggestions.english.filter((s: string) => s.toLowerCase().includes('grammar') || s.toLowerCase().includes('style')),
        position: { start: 0, end: 0 },
      },
      {
        type: 'CONTENT',
        category: 'CONTENT_SUGGESTION',
        severity: 'MEDIUM',
        title: 'Content and Structure Feedback',
        description: aiFeedback.storylineFeedback.english,
        suggestions: aiFeedback.suggestions.english.filter((s: string) => s.toLowerCase().includes('content') || s.toLowerCase().includes('structure')),
        position: { start: 0, end: 0 },
      },
      {
        type: 'CULTURAL',
        category: 'CULTURAL_ADAPTATION',
        severity: 'HIGH',
        title: 'Cultural Context and College Fit',
        description: aiFeedback.collegeFitFeedback.english,
        suggestions: aiFeedback.suggestions.english.filter((s: string) => s.toLowerCase().includes('cultural') || s.toLowerCase().includes('college')),
        position: { start: 0, end: 0 },
      },
    ].filter(f => f.suggestions.length > 0); // Only include feedback with suggestions

    // Save feedback to database
    await prisma.essayFeedback.createMany({
      data: feedbackData.map(f => ({
        essayId: essay.id,
        type: f.type,
        category: f.category,
        severity: f.severity,
        title: f.title,
        description: f.description,
        suggestions: JSON.stringify(f.suggestions),
        examples: JSON.stringify(f.suggestions),
        startPosition: f.position.start,
        endPosition: f.position.end,
      })),
    });

    return res.json({
      success: true,
      data: {
        feedback: feedbackData,
        essayId: essay.id,
        overallScore: aiFeedback.overallScore,
        confidence: aiFeedback.confidence,
        aiProvider: aiFeedback.aiProvider,
        processingTime: aiFeedback.processingTime,
      },
    });
  } catch (error) {
    console.error('Error generating feedback:', error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to generate feedback',
    });
  }
});

// Get feedback for essay
router.get('/:essayId', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    const essayId = req.params['essayId'];
    if (!essayId) {
      return res.status(400).json({
        success: false,
        message: 'Essay ID is required',
      });
    }
    
    const feedback = await prisma.essayFeedback.findMany({
      where: {
        essayId: essayId,
        essay: {
          userId: req.user.id,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: feedback,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
    });
  }
});

export default router; 