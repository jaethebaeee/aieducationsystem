import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { academicProfileService } from '../services/academicProfileService';
import { z } from 'zod';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * POST /api/academic-profiles
 * Create new academic profile for authenticated user
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const profileSchema = z.object({
      koreanEducation: z.object({
        schoolType: z.enum(['public', 'private', 'international', 'foreign']),
        curriculum: z.enum(['regular', 'gifted', 'science', 'foreign', 'ib']),
        grade: z.number().int().min(1),
        gpa: z.number().min(0).max(4.5),
        classRank: z.number().int().positive().optional(),
        totalStudents: z.number().int().positive().optional(),
        schoolRanking: z.number().int().positive().optional(),
      }),
    }).passthrough();
    const profileData = profileSchema.parse(req.body) as { koreanEducation: {
      schoolType: 'public' | 'private' | 'international' | 'foreign';
      curriculum: 'regular' | 'gifted' | 'science' | 'foreign' | 'ib';
      grade: number;
      gpa: number;
      classRank?: number;
      totalStudents?: number;
      schoolRanking?: number;
    } };
    const userId = req.user.id;

    if (!profileData || !profileData.koreanEducation) {
      return res.status(400).json({ success: false, error: 'koreanEducation data is required' });
    }

    const profile = await academicProfileService.createAcademicProfile(userId, profileData);

    return res.status(201).json({ success: true, data: profile });
  } catch (error) {
    logger.error('Error creating academic profile:', error);
    return res.status(500).json({ success: false, error: 'Failed to create academic profile' });
  }
});

/**
 * GET /api/academic-profiles/:userId
 * Get academic profile for the authenticated user (must match :userId)
 */
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const { userId } = req.params as { userId?: string };
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    if (req.user.id !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const profile = await academicProfileService.getAcademicProfile(userId);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Academic profile not found' });
    }

    return res.json({ success: true, data: profile });
  } catch (error) {
    logger.error('Error fetching academic profile:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch academic profile' });
  }
});

/**
 * PUT /api/academic-profiles/:profileId
 * Update academic profile (ownership should be enforced at service/db layer in real impl)
 */
router.put('/:profileId', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const { profileId } = req.params as { profileId?: string };
    if (!profileId) {
      return res.status(400).json({ success: false, error: 'profileId is required' });
    }
    const updates = req.body;

    const profile = await academicProfileService.updateAcademicProfile(profileId, updates);
    return res.json({ success: true, data: profile });
  } catch (error) {
    logger.error('Error updating academic profile:', error);
    return res.status(500).json({ success: false, error: 'Failed to update academic profile' });
  }
});

/**
 * POST /api/academic-profiles/convert-gpa
 * Convert Korean GPA to U.S. equivalent
 */
router.post('/convert-gpa', async (req, res) => {
  try {
    const schema = z.object({
      koreanEducation: z.object({
        schoolType: z.enum(['public', 'private', 'international', 'foreign']),
        curriculum: z.enum(['regular', 'gifted', 'science', 'foreign', 'ib']),
        grade: z.number().int().min(1),
        gpa: z.number().min(0).max(4.5),
      })
    });
    const { koreanEducation } = schema.parse(req.body);
    if (!koreanEducation) {
      return res.status(400).json({ success: false, error: 'koreanEducation data is required' });
    }
    const conversion = academicProfileService.convertKoreanGPA(koreanEducation);
    return res.json({ success: true, data: conversion });
  } catch (error) {
    logger.error('Error converting GPA:', error);
    return res.status(500).json({ success: false, error: 'Failed to convert GPA' });
  }
});

/**
 * POST /api/academic-profiles/calculate-strength
 * Calculate academic strength score
 */
router.post('/calculate-strength', async (req, res) => {
  try {
    const profileData = req.body; // Optional: add schema if needed for deep validation
    if (!profileData) {
      return res.status(400).json({ success: false, error: 'Profile data is required' });
    }
    const strength = academicProfileService.calculateAcademicStrength(profileData);
    return res.json({ success: true, data: strength });
  } catch (error) {
    logger.error('Error calculating academic strength:', error);
    return res.status(500).json({ success: false, error: 'Failed to calculate academic strength' });
  }
});

/**
 * POST /api/academic-profiles/generate-recommendations
 * Generate academic recommendations
 */
router.post('/generate-recommendations', async (req, res) => {
  try {
    const profileData = req.body; // Optional: add schema if needed for deep validation
    if (!profileData) {
      return res.status(400).json({ success: false, error: 'Profile data is required' });
    }
    const recommendations = academicProfileService.generateRecommendations(profileData);
    return res.json({ success: true, data: recommendations });
  } catch (error) {
    logger.error('Error generating recommendations:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate recommendations' });
  }
});

/**
 * GET /api/academic-profiles/:userId/analysis
 * Get comprehensive academic analysis for authenticated user
 */
router.get('/:userId/analysis', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const { userId } = req.params as { userId?: string };
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    if (req.user.id !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const profile = await academicProfileService.getAcademicProfile(userId);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Academic profile not found' });
    }

    const strength = academicProfileService.calculateAcademicStrength(profile);
    const recommendations = academicProfileService.generateRecommendations(profile);

    const analysis = {
      profile,
      strength,
      recommendations,
      summary: {
        gpaLevel: profile.convertedGPA >= 3.8 ? 'excellent' : 
                 profile.convertedGPA >= 3.5 ? 'strong' : 
                 profile.convertedGPA >= 3.2 ? 'good' : 
                 profile.convertedGPA >= 3.0 ? 'average' : 'below-average',
        testLevel: (profile.standardizedTests.sat?.total ?? 0) >= 1400 || (profile.standardizedTests.act?.composite ?? 0) >= 30 ? 'excellent' :
                   (profile.standardizedTests.sat?.total ?? 0) >= 1300 || (profile.standardizedTests.act?.composite ?? 0) >= 26 ? 'strong' :
                   (profile.standardizedTests.sat?.total ?? 0) >= 1200 || (profile.standardizedTests.act?.composite ?? 0) >= 22 ? 'good' : 'needs-improvement',
        activityLevel: profile.activities.length >= 8 ? 'excellent' :
                      profile.activities.length >= 6 ? 'strong' :
                      profile.activities.length >= 4 ? 'good' : 'needs-improvement'
      }
    };

    return res.json({ success: true, data: analysis });
  } catch (error) {
    logger.error('Error generating academic analysis:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate academic analysis' });
  }
});

/**
 * GET /api/academic-profiles/templates/korean-schools
 * Get Korean school type templates
 */
router.get('/templates/korean-schools', async (_req, res) => {
  try {
    const templates = {
      schoolTypes: [
        { value: 'public', label: '공립학교', labelKo: '공립학교' },
        { value: 'private', label: '사립학교', labelKo: '사립학교' },
        { value: 'international', label: '국제학교', labelKo: '국제학교' },
        { value: 'foreign', label: '외국인학교', labelKo: '외국인학교' }
      ],
      curricula: [
        { value: 'regular', label: '일반과정', labelKo: '일반과정' },
        { value: 'gifted', label: '영재과정', labelKo: '영재과정' },
        { value: 'science', label: '과학고', labelKo: '과학고' },
        { value: 'foreign', label: '외국어고', labelKo: '외국어고' },
        { value: 'ib', label: 'IB 과정', labelKo: 'IB 과정' }
      ],
      gradeLevels: [
        { value: 1, label: '1학년', labelKo: '1학년' },
        { value: 2, label: '2학년', labelKo: '2학년' },
        { value: 3, label: '3학년', labelKo: '3학년' }
      ]
    };

    return res.json({ success: true, data: templates });
  } catch (error) {
    logger.error('Error fetching Korean school templates:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch Korean school templates' });
  }
});

export default router;

