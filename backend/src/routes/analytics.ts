import express from 'express';
import { prisma } from '../utils/dbSetup';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get user analytics
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    const analytics = await prisma.userAnalytics.findUnique({
      where: { userId: req.user.id },
      include: {
        goals: {
          include: {
            progressData: {
              orderBy: { date: 'desc' },
              take: 30, // Last 30 days
            },
          },
        },
      },
    });

    if (!analytics) {
      // Create analytics if they don't exist
      const newAnalytics = await prisma.userAnalytics.create({
        data: {
          userId: req.user.id,
          essaysWritten: 0,
          essaysReviewed: 0,
          feedbackReceived: 0,
          timeSpent: 0,
        },
      });

      return res.json({
        success: true,
        data: newAnalytics,
      });
    }

    return res.json({
      success: true,
      data: analytics,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
    });
  }
});

// Update analytics
router.put('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    const { essaysWritten, essaysReviewed, feedbackReceived, timeSpent } = req.body;

    const analytics = await prisma.userAnalytics.upsert({
      where: { userId: req.user.id },
      update: {
        essaysWritten,
        essaysReviewed,
        feedbackReceived,
        timeSpent,
      },
      create: {
        userId: req.user.id,
        essaysWritten: essaysWritten || 0,
        essaysReviewed: essaysReviewed || 0,
        feedbackReceived: feedbackReceived || 0,
        timeSpent: timeSpent || 0,
      },
    });

    return res.json({
      success: true,
      data: analytics,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to update analytics',
    });
  }
});

// Add progress data point
router.post('/progress', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    const { goalId, date, value, notes } = req.body;

    if (!goalId) {
      return res.status(400).json({
        success: false,
        message: 'Goal ID is required',
      });
    }

    const progress = await prisma.progressData.create({
      data: {
        goalId,
        date: new Date(date),
        value: value || 0,
        notes: notes || '',
      },
    });

    return res.status(201).json({
      success: true,
      data: progress,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to add progress data',
    });
  }
});

export default router; 