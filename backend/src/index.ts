import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { createServer } from 'http';
import { logger } from './utils/logger';
import { initializeDatabase, testDatabaseConnection } from './utils/dbSetup';
import { aiService } from './services/aiService';
import websocketService from './services/websocketService';
import { pingQdrant } from './services/ragService';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import essayRoutes from './routes/essays';
import feedbackRoutes from './routes/feedback';
import resourceRoutes from './routes/resources';
import communityRoutes from './routes/community';
import analyticsRoutes from './routes/analytics';
import paymentRoutes from './routes/payments';
import analysisRoutes from './routes/analysis';
import recommendationsRoutes from './routes/recommendations';
import universitiesRoutes from './routes/universities';
import academicProfileRoutes from './routes/academicProfiles';
import storytellingRoutes from './routes/storytelling';
import timelineRoutes from './routes/timeline';
import agenticSeekRoutes from './routes/agenticSeek';
import grammarRoutes from './routes/grammar';
import careersRoutes from './routes/careers';
import ragRoutes from './routes/rag';
import papersRoutes from './routes/papers';
import statsRoutes from './routes/stats';
// import planRoutes from './routes/plan';
// Temporarily disable external routes until they compile cleanly
// import universityRoutes from '../routes/universities';
// import academicProfileRoutes from '../routes/academic-profiles';
// import applicationRoutes from '../routes/applications';
// import financialPlanningRoutes from '../routes/financial-planning';


const app = express();
const server = createServer(app);
const PORT = process.env['PORT'] || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// /health – basic liveness
app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// /ready – dependencies check
app.get('/ready', async (_req, res) => {
  const deps = {
    db: await testDatabaseConnection(),
    qdrant: await pingQdrant(),
    llm: await aiService.pingLLM(),
  } as const;
  const allOk = Object.values(deps).every(Boolean);
  res.status(allOk ? 200 : 503).json(deps);
});

// AI service status endpoint
app.get('/ai/status', (_req, res) => {
  const isConfigured = aiService.isConfigured();
  res.json({
    success: true,
    data: {
      configured: isConfigured,
      model: process.env['OPENAI_MODEL'] || 'gpt-4',
      message: isConfigured 
        ? 'AI service is ready' 
        : 'AI service requires OpenAI API key configuration',
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/essays', essayRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/universities', universitiesRoutes);
app.use('/api/academic-profiles', academicProfileRoutes);
app.use('/api/storytelling', storytellingRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/agentic-seek', agenticSeekRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/rag', ragRoutes);
// app.use('/api/seo', seoRoutes);
app.use('/api/papers', papersRoutes);
app.use('/api/stats', statsRoutes);
// app.use('/api/plan', planRoutes);
 // app.use('/api/universities', universityRoutes);
 // app.use('/api/applications', applicationRoutes);
 // app.use('/api/financial-planning', financialPlanningRoutes);


// Error handling middleware (must have 4 args)
app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error('Unhandled error:', err);

  let message = 'Internal server error';
  let status = 500;
  if (typeof err === 'object' && err !== null) {
    const anyErr = err as { message?: string; statusCode?: number };
    if (anyErr.message) message = anyErr.message;
    if (typeof anyErr.statusCode === 'number') status = anyErr.statusCode;
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env['NODE_ENV'] === 'development' && err instanceof Error && { stack: err.stack }),
  });
});

// Robots.txt and Sitemap
app.get('/robots.txt', (_req, res) => {
  const base = process.env['PUBLIC_URL'] || 'https://admitai.kr';
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml`);
});

app.get('/sitemap.xml', (_req, res) => {
  const base = process.env['PUBLIC_URL'] || 'https://admitai.kr';
  const urls = ['/', '/methodology', '/about', '/pricing', '/schools', '/contact', '/privacy', '/terms', '/cookies', '/data-protection'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${base}${u}</loc></url>`).join('\n') +
    `\n</urlset>`;
  res.type('application/xml').send(body);
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Start server
async function startServer() {
  try {
    // Optionally skip DB for local demos
    if (process.env['SKIP_DB'] === '1') {
      logger.warn('SKIP_DB=1 detected. Starting server without database connection. Some endpoints will be unavailable.');
    } else {
      // Test database connection
      const dbConnected = await testDatabaseConnection();
      if (!dbConnected) {
        logger.error('Failed to connect to database');
        process.exit(1);
      }
      // Initialize database with sample data
      await initializeDatabase();
    }

    // Initialize WebSocket server
    websocketService.initialize(server);

    // Start the server
    server.listen(PORT, () => {
      logger.info(`🚀 AdmitAI Korea Backend server running on port ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🤖 AI status: http://localhost:${PORT}/ai/status`);
      logger.info(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
      logger.info(`🔗 Frontend URL: ${process.env['FRONTEND_URL'] || 'http://localhost:5173'}`);
      
      // Log AI service status
      if (aiService.isConfigured()) {
        logger.info('✅ AI service is configured and ready');
      } else {
        logger.warn('⚠️  AI service requires OpenAI API key configuration');
        logger.info('💡 Set OPENAI_API_KEY in your environment variables to enable AI features');
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  websocketService.shutdown();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  websocketService.shutdown();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer(); 