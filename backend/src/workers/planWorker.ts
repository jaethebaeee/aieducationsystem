import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '../utils/dbSetup';
import { logger } from '../utils/logger';
import { search, generateInsight } from '../services/ragService';

const redisUrl = process.env['REDIS_URL'];
if (!redisUrl) {
  logger.warn('REDIS_URL not set; planWorker will not start.');
}

const connection = redisUrl ? new IORedis(redisUrl) : undefined;

type BootstrapJob = {
  userId: string;
  targets: Array<{ id?: string; name: string; plan?: string }>;
  generate?: { insights?: boolean; essays?: boolean; deadlines?: boolean; resources?: boolean };
  notify?: { alerts?: boolean; parent?: boolean };
};

// Worker: process plan bootstrap jobs
if (connection) {
  const worker = new Worker<BootstrapJob>(
    'plan-bootstrap',
    async (job) => {
      const { userId, targets = [], generate = {}, notify = {} } = job.data;
      logger.info('Processing plan bootstrap job', { userId, targets: targets.length });

      // 1) Essays per target
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

      // Ensure timeline
      const timeline = await prisma.applicationTimeline.upsert({ where: { userId }, update: {}, create: { userId, title: 'My Application Timeline' } });

      // 2) Deadlines
      if (generate.deadlines !== false && targets.length > 0) {
        const nowYear = new Date().getFullYear();
        for (const t of targets) {
          const plan = (t.plan || 'RD').toUpperCase();
          let due = new Date(nowYear, 10, 1);
          if (plan === 'ED' || plan === 'REA') due = new Date(nowYear, 10, 1);
          else if (plan === 'EA') due = new Date(nowYear, 10, 15);
          else if (plan === 'RD' || plan === 'ROLLING') due = new Date(nowYear + 1, 0, 1);
          await prisma.timelineTask.create({
            data: { timelineId: timeline.id, type: 'DEADLINE', label: `${t.name} ${plan} application due`, dueDate: due },
          }).catch(() => undefined);
        }
      }

      // 3) Insights via RAG (policy + next steps)
      if (generate.insights !== false && targets.length > 0) {
        for (const t of targets) {
          try {
            const results = await search(`${t.name} admissions policy updates and strategy`, 5);
            const chunks = results.map((r) => r.chunk);
            const insight = await generateInsight(`Summarize ${t.name} policy + next steps for a Korean student applicant`, chunks);
            // Persist as a resource note tied to user for now
            await prisma.resource.create({
              data: {
                title: `${t.name} — Policy & Next Steps`,
                description: insight.answer.slice(0, 512),
                type: 'INSIGHT',
                category: 'UNIVERSITY',
                url: '',
                language: 'EN',
                tags: JSON.stringify(['policy', 'next-steps']),
              },
            }).catch(() => undefined);
          } catch (e) {
            logger.warn('Insight generation failed', { school: t.name, error: (e as Error).message });
          }
        }
      }

      // 4) Resources preload (placeholder)
      if (generate.resources !== false && targets.length > 0) {
        logger.info('Resources preload placeholder complete', { userId });
      }

      // 5) Parent summary (placeholder)
      if (notify.parent) {
        logger.info('Parent summary email placeholder queued', { userId });
      }
    },
    { connection }
  );

  worker.on('completed', (job) => logger.info('Plan bootstrap completed', { jobId: job.id }));
  worker.on('failed', (job, err) => logger.error('Plan bootstrap failed', { jobId: job?.id, error: err?.message }));
}

