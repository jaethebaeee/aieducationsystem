import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/dbSetup';
import { CustomError } from '../types/errors';

const router = express.Router();

// Helper to ensure JWT secret is configured
function getJwtSecret(): string {
  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    throw new CustomError('Server misconfiguration: missing JWT secret', 500);
  }
  return secret;
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['STUDENT', 'PARENT', 'MENTOR']),
  language: z.enum(['KO', 'EN']).default('KO'),
});

// Login endpoint
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        subscription: true,
      },
    });

    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new CustomError('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Register endpoint
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, language } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new CustomError('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with profile and subscription
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        language,
        profile: {
          create: {
            targetSchools: JSON.stringify([]),
            extracurriculars: {
              create: [],
            },
            preferences: {
              create: {
                emailNotifications: true,
                pushNotifications: true,
                smsNotifications: false,
                notificationFrequency: 'IMMEDIATE',
                profileVisibility: 'PRIVATE',
                essaySharing: false,
                analyticsSharing: true,
                essayGoals: JSON.stringify([]),
              },
            },
          },
        },
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
            startDate: new Date(),
            features: {
              create: [
                {
                  name: 'Basic Essay Analysis',
                  description: 'Grammar and style feedback',
                  limit: 3,
                  used: 0,
                },
                {
                  name: 'Cultural Context',
                  description: 'Korean cultural adaptation suggestions',
                  limit: 3,
                  used: 0,
                },
              ],
            },
          },
        },
      },
      include: {
        profile: true,
        subscription: {
          include: {
            features: true,
          },
        },
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Verify token endpoint
router.get('/verify', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new CustomError('No token provided', 401);
    }

    interface JwtPayload { userId: string; email: string; role: string; }
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
        subscription: {
          include: {
            features: true,
          },
        },
      },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _unused, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router; 