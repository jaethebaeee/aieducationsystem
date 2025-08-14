import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// Define subscription plans
const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: 'basic',
    name: 'Basic Plan',
    price: 29.00,
    priceKRW: 39000,
    features: ['Essay Analysis', 'Basic Feedback', 'Community Access'],
    description: 'Perfect for students starting their college application journey',
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium Plan',
    price: 59.00,
    priceKRW: 79000,
    features: ['Advanced AI Analysis', 'Unlimited Essays', 'Mentor Access', 'Priority Support'],
    description: 'Comprehensive support for serious applicants',
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 99.00,
    priceKRW: 129000,
    features: ['All Premium Features', 'Custom Analysis', 'Dedicated Mentor', 'White-label Options'],
    description: 'Complete solution for institutions and hagwons',
  },
};

// Mock payment processing
const mockPaymentProcessor = {
  async createPaymentIntent(amount: number, currency: string = 'USD') {
    return {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
    };
  },

  async confirmPayment(paymentIntentId: string) {
    return {
      id: paymentIntentId,
      status: 'succeeded',
      amount: 2900,
      currency: 'usd',
    };
  },

  async createSubscription(planId: string, customerId: string) {
    return {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      planId,
      customerId,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  },
};

/**
 * Get subscription plans
 */
router.get('/plans', (_req, res) => {
  return res.json({
    success: true,
    data: SUBSCRIPTION_PLANS,
  });
});

/**
 * Create payment intent for one-time payments
 */
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const schema = z.object({
      amount: z.number().int().min(100, 'Invalid amount (minimum $1.00 or 100 in minor units)'),
      currency: z.string().default('USD'),
    });
    const { amount, currency } = schema.parse(req.body);

    // amount validated by zod

    const paymentIntent = await mockPaymentProcessor.createPaymentIntent(amount, currency);

    return res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
    });
  }
});

/**
 * Create subscription
 */
router.post('/create-subscription', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const schema = z.object({ planId: z.enum(['BASIC', 'PREMIUM', 'ENTERPRISE']) });
    const { planId } = schema.parse(req.body);

    // planId validated by zod

    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];

    // Create mock subscription
    const subscription = await mockPaymentProcessor.createSubscription(planId, req.user.id);

    // Save subscription to database
    await prisma.subscription.upsert({
      where: { userId: req.user.id },
      update: {
        plan: planId,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      create: {
        userId: req.user.id,
        plan: planId,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return res.json({
      success: true,
      message: 'Subscription created successfully',
      data: {
        subscriptionId: subscription.id,
        plan: planId,
        status: 'active',
        features: plan.features,
      },
    });
  } catch (error) {
    logger.error('Error creating subscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
    });
  }
});

/**
 * Get user's current subscription
 */
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id },
    });

    if (!subscription) {
      return res.json({
        success: true,
        data: null,
        message: 'No active subscription',
      });
    }

    const plan = SUBSCRIPTION_PLANS[subscription.plan as keyof typeof SUBSCRIPTION_PLANS];

    return res.json({
      success: true,
      data: {
        ...subscription,
        planDetails: plan,
        features: plan?.features || [],
      },
    });
  } catch (error) {
    logger.error('Error fetching subscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
    });
  }
});

/**
 * Cancel subscription
 */
router.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    // Update in database
    await prisma.subscription.update({
      where: { userId: req.user.id },
      data: {
        status: 'CANCELLED',
        endDate: new Date(),
      },
    });

    return res.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    logger.error('Error cancelling subscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
    });
  }
});

/**
 * Upgrade subscription
 */
router.post('/upgrade-subscription', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const schema = z.object({ newPlanId: z.enum(['BASIC', 'PREMIUM', 'ENTERPRISE']) });
    const { newPlanId } = schema.parse(req.body);

    // newPlanId validated by zod

    const newPlan = SUBSCRIPTION_PLANS[newPlanId as keyof typeof SUBSCRIPTION_PLANS];

    // Update subscription in database
    await prisma.subscription.upsert({
      where: { userId: req.user.id },
      update: {
        plan: newPlanId,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      create: {
        userId: req.user.id,
        plan: newPlanId,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return res.json({
      success: true,
      message: 'Subscription upgraded successfully',
      data: {
        plan: newPlanId,
        features: newPlan.features,
      },
    });
  } catch (error) {
    logger.error('Error upgrading subscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upgrade subscription',
    });
  }
});

/**
 * Get payment history
 */
router.get('/history', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Mock payment history
    const paymentHistory = [
      {
        id: 'pay_1',
        amount: 29.00,
        currency: 'USD',
        status: 'succeeded',
        description: 'Basic Plan Subscription',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'pay_2',
        amount: 59.00,
        currency: 'USD',
        status: 'succeeded',
        description: 'Premium Plan Upgrade',
        date: new Date(),
      },
    ];

    return res.json({
      success: true,
      data: paymentHistory,
    });
  } catch (error) {
    logger.error('Error fetching payment history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
    });
  }
});

/**
 * Check subscription status for feature access
 */
router.get('/check-access/:feature', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { feature } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id },
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      return res.json({
        success: true,
        hasAccess: false,
        message: 'No active subscription',
      });
    }

    const plan = SUBSCRIPTION_PLANS[subscription.plan as keyof typeof SUBSCRIPTION_PLANS];
    const hasAccess = plan?.features.includes(feature as string) || false;

    return res.json({
      success: true,
      hasAccess,
      plan: subscription.plan,
      features: plan?.features || [],
    });
  } catch (error) {
    logger.error('Error checking feature access:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check feature access',
    });
  }
});

export default router; 