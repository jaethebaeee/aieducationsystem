import { PrismaClient } from '@prisma/client';
import { logger } from './logger';
import { seedUniversities } from './seedUniversities';

const prisma = new PrismaClient();

/**
 * Initialize database with sample data for development
 */
export async function initializeDatabase() {
  try {
    logger.info('Initializing database...');

    // Check if we have any users
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      logger.info('No users found, creating sample data...');
      
      // Create sample user
      const sampleUser = await prisma.user.create({
        data: {
          email: 'demo@admitai.kr',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // password: demo123
          firstName: 'Ji-Hoon',
          lastName: 'Kim',
          role: 'STUDENT',
          language: 'KO',
          bio: 'Ambitious student from Seoul applying to Ivy League schools',
        },
      });

      // Create user profile
      const profile = await prisma.userProfile.create({
        data: {
          userId: sampleUser.id,
          gpa: 3.8,
          satScore: 1500,
          actScore: 34,
          toeflScore: 110,
          schoolName: 'Seoul International School',
          graduationYear: 2025,
          targetSchools: JSON.stringify(['Harvard', 'Stanford', 'MIT']),
        },
      });

      // Create extracurriculars
      await prisma.extracurricular.createMany({
        data: [
          {
            profileId: profile.id,
            name: 'Debate Club',
            description: 'President of the school debate club',
            role: 'President',
            duration: '3 years',
            impact: 'Led team to national championships',
          },
          {
            profileId: profile.id,
            name: 'Volunteer Work',
            description: 'Community service at local orphanage',
            role: 'Volunteer',
            duration: '2 years',
            impact: 'Organized fundraising events raising $10,000',
          },
        ],
      });

      // Create user preferences
      await prisma.userPreferences.create({
        data: {
          profileId: profile.id,
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          notificationFrequency: 'IMMEDIATE',
          profileVisibility: 'PRIVATE',
          essaySharing: false,
          analyticsSharing: true,
          essayGoals: JSON.stringify(['Show leadership', 'Highlight cultural identity', 'Demonstrate academic excellence']),
        },
      });

      // Create sample essays
      const sampleEssay = await prisma.essay.create({
        data: {
          userId: sampleUser.id,
          title: 'My Journey from Seoul to Harvard',
          content: `Growing up in Seoul, I was always fascinated by the intersection of technology and human potential. When I first learned about artificial intelligence in my computer science class, I realized that this field could revolutionize how we solve complex problems.

My interest deepened when I started working on a project to develop an AI-powered tutoring system for underprivileged students in my community. The challenge was not just technical—it was about understanding the unique needs of Korean students and adapting the technology to our cultural context.

Through this project, I learned that true innovation comes from combining technical expertise with cultural sensitivity. I want to bring this perspective to Harvard, where I can contribute to the development of AI systems that serve diverse global communities.

The experience taught me that leadership is not about having all the answers, but about asking the right questions and bringing people together to find solutions.`,
          type: 'PERSONAL_STATEMENT',
          targetSchool: 'Harvard',
          prompt: 'Common App Personal Statement',
          wordCount: 250,
          status: 'DRAFT',
        },
      });

      // Create essay version
      await prisma.essayVersion.create({
        data: {
          essayId: sampleEssay.id,
          version: 1,
          content: sampleEssay.content,
          wordCount: sampleEssay.wordCount,
        },
      });

      // Create user analytics
      await prisma.userAnalytics.create({
        data: {
          userId: sampleUser.id,
          essaysWritten: 1,
          essaysReviewed: 0,
          feedbackReceived: 0,
          timeSpent: 120, // minutes
        },
      });

      logger.info('Sample data created successfully');
    } else {
      logger.info('Database already has data, skipping initialization');
    }

    // Seed universities
    await seedUniversities();
    
    logger.info('Database initialization completed');
  } catch (error) {
    logger.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  await prisma.$disconnect();
  logger.info('Database connection closed');
}

export { prisma }; 