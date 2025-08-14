import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/dbSetup';
import { logger } from '../utils/logger';

/**
 * Require an active (non-expired) subscription for access.
 * Assumes authentication middleware has already populated req.user
 */
export const requireActiveSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id },
    });

    const now = new Date();
    const isActive = Boolean(
      subscription &&
        subscription.status === 'ACTIVE' &&
        (!subscription.endDate || new Date(subscription.endDate) > now)
    );

    if (!isActive) {
      res.status(403).json({ success: false, message: 'Active subscription required' });
      return;
    }

    next();
  } catch (error) {
    logger.error('Subscription check failed:', error);
    res.status(500).json({ success: false, message: 'Failed to verify subscription' });
  }
};

