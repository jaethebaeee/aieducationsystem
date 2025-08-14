import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/dbSetup';

const router = express.Router();

/**
 * Get current user profile
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            extracurriculars: true,
            preferences: true,
          },
        },
        subscription: true,
        analytics: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove sensitive information
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _unused, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
    });
  }
});

/**
 * Update user profile (onboarding)
 * This handles the comprehensive profile setup for personalized AI feedback
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      bio,
      avatar,
      // Academic background
      gpa,
      satScore,
      actScore,
      toeflScore,
      ieltsScore,
      schoolName,
      graduationYear,
      // Target schools
      targetSchools,
      // Extracurriculars
      extracurriculars,
      // Preferences
      emailNotifications,
      pushNotifications,
      smsNotifications,
      notificationFrequency,
      profileVisibility,
      essaySharing,
      analyticsSharing,
      essayGoals,
    } = req.body;

    // Update basic user info
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        bio,
        avatar,
      },
    });

    // Update or create user profile
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        gpa,
        satScore,
        actScore,
        toeflScore,
        ieltsScore,
        schoolName,
        graduationYear,
        targetSchools,
      },
      create: {
        userId,
        gpa,
        satScore,
        actScore,
        toeflScore,
        ieltsScore,
        schoolName,
        graduationYear,
        targetSchools,
      },
    });

    // Handle extracurriculars
    if (extracurriculars && extracurriculars.length > 0) {
      // Delete existing extracurriculars
      await prisma.extracurricular.deleteMany({
        where: { profileId: profile.id },
      });

      // Create new extracurriculars
      await prisma.extracurricular.createMany({
        data: extracurriculars.map((ec: unknown) => {
          if (typeof ec === 'object' && ec !== null && 'name' in ec && 'description' in ec && 'role' in ec && 'duration' in ec && 'impact' in ec) {
            const e = ec as { name: string; description: string; role: string; duration: string; impact: string };
            return {
              profileId: profile.id,
              name: e.name,
              description: e.description,
              role: e.role,
              duration: e.duration,
              impact: e.impact,
            };
          }
          // fallback for invalid data
          return {
            profileId: profile.id,
            name: '',
            description: '',
            role: '',
            duration: '',
            impact: '',
          };
        }),
      });
    }

    // Update or create user preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { profileId: profile.id },
      update: {
        emailNotifications,
        pushNotifications,
        smsNotifications,
        notificationFrequency,
        profileVisibility,
        essaySharing,
        analyticsSharing,
        essayGoals: essayGoals ? JSON.stringify(essayGoals) : JSON.stringify([]),
      },
      create: {
        profileId: profile.id,
        emailNotifications,
        pushNotifications,
        smsNotifications,
        notificationFrequency,
        profileVisibility,
        essaySharing,
        analyticsSharing,
        essayGoals: essayGoals ? JSON.stringify(essayGoals) : JSON.stringify([]),
      },
    });

    // Get updated user with all relations
    const updatedUserWithProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            extracurriculars: true,
            preferences: true,
          },
        },
        subscription: true,
        analytics: true,
      },
    });

    logger.info('User profile updated successfully', {
      userId,
      hasProfile: !!profile,
      hasPreferences: !!preferences,
      extracurricularsCount: extracurriculars?.length || 0,
    });

    res.json({
      success: true,
      data: updatedUserWithProfile,
      message: 'Profile updated successfully',
    });
    return;
  } catch (error) {
    logger.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
    });
  }
});

/**
 * Update user language preference
 */
router.patch('/language', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const userId = req.user.id;
    const { language } = req.body;
    if (!language) {
      return res.status(400).json({
        success: false,
        message: 'Language is required',
      });
    }
    await prisma.user.update({ where: { id: userId }, data: { language } });
    return res.json({ success: true, message: 'Language updated' });
  } catch (error) {
    logger.error('Error updating language:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update language',
    });
  }
});

/**
 * Change password
 */
// @ts-expect-error - Express route handler doesn't need return values
router.patch('/password', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    logger.info('Password changed successfully', { userId });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
});

/**
 * Delete user account
 */
// @ts-expect-error - Express route handler doesn't need return values
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const userId = req.user.id;

    // Delete user (cascade will handle related data)
    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info('User account deleted', { userId });

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting user account:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete account',
    });
  }
});

/**
 * Get user analytics
 */
// @ts-expect-error - Express route handler doesn't need return values
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const userId = req.user.id;

    const analytics = await prisma.userAnalytics.findUnique({
      where: { userId },
      include: {
        goals: {
          include: {
            progressData: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    logger.error('Error fetching user analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
    });
  }
});

/**
 * Update user analytics
 */
// @ts-expect-error - Express route handler doesn't need return values
router.put('/analytics', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const userId = req.user.id;
    const {
      essaysWritten,
      essaysReviewed,
      feedbackReceived,
      timeSpent,
      goals,
    } = req.body;

    const analytics = await prisma.userAnalytics.upsert({
      where: { userId },
      update: {
        essaysWritten,
        essaysReviewed,
        feedbackReceived,
        timeSpent,
      },
      create: {
        userId,
        essaysWritten,
        essaysReviewed,
        feedbackReceived,
        timeSpent,
      },
    });

    // Handle goals
    if (goals && goals.length > 0) {
      for (const goal of goals) {
        await prisma.analyticsGoal.upsert({
          where: {
            analyticsId_name: {
              analyticsId: analytics.id,
              name: goal.name,
            },
          },
          update: {
            target: goal.target,
            current: goal.current,
            status: goal.status,
            deadline: goal.deadline,
          },
          create: {
            analyticsId: analytics.id,
            name: goal.name,
            target: goal.target,
            current: goal.current,
            status: goal.status,
            deadline: goal.deadline,
          },
        });
      }
    }

    res.json({
      success: true,
      data: analytics,
      message: 'Analytics updated successfully',
    });
  } catch (error) {
    logger.error('Error updating user analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update analytics',
    });
  }
});

export default router; 