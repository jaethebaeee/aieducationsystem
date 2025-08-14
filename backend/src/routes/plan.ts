import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';
import { prisma } from '../utils/dbSetup';
import { Queue, QueueScheduler, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

const router = express.Router();

// Queue setup (BullMQ)
const redisUrl = process.env['REDIS_URL'];
const connection = redisUrl ? new IORedis(redisUrl) : undefined;
const planQueue = connection ? new Queue('plan-bootstrap', { connection }) : undefined;
// Create a scheduler to manage delayed/retried jobs when connection exists
const planQueueScheduler = connection ? new QueueScheduler('plan-bootstrap', { connection }) : undefined;

type TargetInput = {
  id?: string;
  name: string;
  plan?: 'ED' | 'EA' | 'REA' | 'RD' | 'Rolling' | string;
};

type BootstrapBody = {
  targets?: TargetInput[];
  profile?: any;
  generate?: { insights?: boolean; essays?: boolean; deadlines?: boolean; resources?: boolean };
  notify?: { alerts?: boolean; parent?: boolean };
};

router.post('/bootstrap', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const body = req.body as BootstrapBody;
    const userId = req.user.id;
    const targets: TargetInput[] = Array.isArray(body.targets) ? body.targets : [];
    const generate = body.generate || {};
    const notify = body.notify || {};

    // Respond quickly to avoid blocking UI
    res.status(202).json({ success: true });

    // Prefer queue; fallback to inline background if queue not configured
    if (planQueue) {
      const jobOpts: JobsOptions = { removeOnComplete: 50, removeOnFail: 100, attempts: 2, backoff: { type: 'exponential', delay: 2000 } };
      await planQueue.add('bootstrap', { userId, targets, generate, notify }, jobOpts).catch((e) => logger.error('Failed to enqueue bootstrap job', e));
      return;
    }

    // Fan out background work without awaiting (inline fallback)
    setTimeout(async () => {
      try {
        // 1) Create essay projects per target (if opted)
        if (generate.essays !== false && targets.length > 0) {
          for (const t of targets) {
            const title = `Application to ${t.name} — Personal Statement`;
            await prisma.essay.create({
              data: {
                userId,
                title,
                content: '',
                type: 'PERSONAL_STATEMENT',
                targetSchool: t.name,
                prompt: 'Describe your background, identity, interest, or talent...',
                wordCount: 0,
                status: 'DRAFT',
              },
            }).catch(() => undefined);
          }
        }

        // Ensure user timeline exists
        const timeline = await prisma.applicationTimeline.upsert({
          where: { userId },
          update: {},
          create: { userId, title: 'My Application Timeline' },
        });

        // 2) Compute deadlines + reminders (basic heuristic)
        if (generate.deadlines !== false && targets.length > 0) {
          const tasks: Array<{ label: string; dueDate: Date; type: string; description?: string }>
            = [];
          const nowYear = new Date().getFullYear();
          for (const t of targets) {
            const plan = (t.plan || 'RD').toUpperCase();
            let due = new Date(nowYear, 10, 1); // default Nov 1
            if (plan === 'ED' || plan === 'REA') due = new Date(nowYear, 10, 1); // Nov 1
            else if (plan === 'EA') due = new Date(nowYear, 10, 15); // Nov 15
            else if (plan === 'RD' || plan === 'ROLLING') due = new Date(nowYear + 1, 0, 1); // Jan 1
            tasks.push({ label: `${t.name} ${plan} application due`, dueDate: due, type: 'DEADLINE' });
          }
          for (const task of tasks) {
            await prisma.timelineTask.create({
              data: {
                timelineId: timeline.id,
                type: 'DEADLINE',
                label: task.label,
                description: task.description,
                dueDate: task.dueDate,
              },
            }).catch(() => undefined);
          }
        }

        // 3) Enqueue insights jobs per school (placeholder logging)
        if (generate.insights !== false && targets.length > 0) {
          for (const t of targets) {
            logger.info(`Enqueue insights job for user ${userId} — ${t.name}`);
          }
        }

        // 4) Preload recommended resources (placeholder logging)
        if (generate.resources !== false && targets.length > 0) {
          for (const t of targets) {
            logger.info(`Preload resources for ${t.name} for user ${userId}`);
          }
        }

        // 5) Optional parent summary notification (placeholder logging)
        if (notify.parent) {
          logger.info(`Enqueue parent summary email for user ${userId}`);
        }

        // Alerts toggle (placeholder logging)
        if (notify.alerts) {
          logger.info(`Enable alerts for user ${userId}`);
        }
      } catch (bgError) {
        logger.error('Error in plan bootstrap background job:', bgError);
      }
    }, 0);
  } catch (error) {
    logger.error('Error bootstrapping plan:', error);
    return res.status(500).json({ success: false, error: 'Failed to bootstrap plan' });
  }
});

export default router;

