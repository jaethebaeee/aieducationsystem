/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

interface JwtPayload {
  userId?: string;
  id?: string;
  email: string;
  role: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    });
  }

  try {
    const secret = process.env['JWT_SECRET'];
    if (!secret) {
      logger.error('JWT_SECRET is not set. Rejecting all requests for security.');
      return res.status(500).json({
        success: false,
        message: 'Server misconfiguration: missing JWT secret',
      });
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const resolvedUserId = decoded.userId ?? decoded.id;
    if (!resolvedUserId) {
      logger.error('JWT payload missing user identifier');
      return res.status(403).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    req.user = {
      id: resolvedUserId,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
    return;
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
    return;
  };
};

export const requireStudent = requireRole(['STUDENT']);
export const requireParent = requireRole(['PARENT']);
export const requireMentor = requireRole(['MENTOR']);
export const requireAdmin = requireRole(['ADMIN']); 