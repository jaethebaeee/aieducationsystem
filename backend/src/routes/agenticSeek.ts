import express from 'express';
import { aiService } from '../services/aiService';
import { agenticSeekService } from '../services/agenticSeekService';
import { logger } from '../utils/logger';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../utils/dbSetup';

const router = express.Router();

/**
 * @route GET /api/agentic-seek/status
 * @desc Get AgenticSeek service status and capabilities
 * @access Private
 */
router.get('/status', authenticateToken, async (_req, res) => {
  try {
    const status = await aiService.getServiceStatus();
    
    return res.json({
      success: true,
      data: status,
      message: 'AgenticSeek status retrieved successfully'
    });
  } catch (error) {
    logger.error('Error getting AgenticSeek status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get AgenticSeek status'
    });
  }
});

/**
 * @route POST /api/agentic-seek/research-university
 * @desc Research university information using AgenticSeek
 * @access Private
 */
router.post('/research-university', authenticateToken, async (req, res) => {
  try {
    const { universityName, persona: _persona } = req.body as { universityName: string; persona?: 'dean' | 'alumni' | 'ta' };
    
    if (!universityName) {
      return res.status(400).json({
        success: false,
        error: 'University name is required'
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    logger.info('Researching university with AgenticSeek', { 
      universityName, 
      userId: req.user.id 
    });

    const research = await aiService.researchUniversity(universityName);
    
    return res.json({
      success: true,
      data: research,
      message: `Research completed for ${universityName}`
    });
  } catch (error) {
    logger.error('Error researching university:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to research university';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

/**
 * @route POST /api/agentic-seek/create-timeline
 * @desc Create personalized application timeline using AgenticSeek
 * @access Private
 */
router.post('/create-timeline', authenticateToken, async (req, res) => {
  try {
    const { userData, targetUniversities } = req.body as { userData?: any; targetUniversities?: unknown };
    
    if (!targetUniversities || !Array.isArray(targetUniversities)) {
      return res.status(400).json({
        success: false,
        error: 'Target universities array is required'
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    logger.info('Creating application timeline with AgenticSeek', {     targetUniversities: targetUniversities.length, 
      userId: req.user.id 
    });

    const timeline = await aiService.createApplicationTimeline(userData, targetUniversities);
    
    return res.json({
      success: true,
      data: timeline,
      message: 'Application timeline created successfully'
    });
  } catch (error) {
    logger.error('Error creating application timeline:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create application timeline';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

/**
 * @route POST /api/agentic-seek/cultural-analysis
 * @desc Generate cultural context analysis using AgenticSeek
 * @access Private
 */
router.post('/cultural-analysis', authenticateToken, async (req, res) => {
  try {
    const { essayText, targetUniversity, persona: _persona2 } = req.body as { essayText: string; targetUniversity?: string; persona?: 'dean' | 'alumni' | 'ta' };
    
    if (!essayText) {
      return res.status(400).json({
        success: false,
        error: 'Essay text is required'
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    logger.info('Generating cultural analysis with AgenticSeek', { 
      essayLength: essayText.length, 
      targetUniversity,
      userId: req.user.id 
    });

    const analysis = await agenticSeekService.generateCulturalContextSuggestions(
      essayText,
      targetUniversity
    );
    
    return res.json({
      success: true,
      data: {
        culturalAnalysis: analysis,
        targetUniversity
      },
      message: 'Cultural analysis completed successfully'
    });
  } catch (error) {
    logger.error('Error generating cultural analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate cultural analysis';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

/**
 * @route POST /api/agentic-seek/topic-ideation
 * @desc Generate essay topic ideation outputs
 * @access Private
 */
router.post('/topic-ideation', authenticateToken, async (req, res) => {
  try {
    const { ideationType, background, experience, essayText, persona: _persona3 } = req.body as {
      ideationType: 'authentic_topics' | 'hardship_growth' | 'cliche_diagnosis';
      background?: string;
      experience?: string;
      essayText?: string;
      persona?: 'dean' | 'alumni' | 'ta';
    };

    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    if (!ideationType) {
      return res.status(400).json({ success: false, error: 'ideationType is required' });
    }

    let result: string;
    switch (ideationType) {
      case 'authentic_topics':
        if (!background) return res.status(400).json({ success: false, error: 'background is required' });
        result = await agenticSeekService.generateTopicIdeas(background);
        break;
      case 'hardship_growth':
        if (!experience) return res.status(400).json({ success: false, error: 'experience is required' });
        result = await agenticSeekService.reframeHardship(experience);
        break;
      case 'cliche_diagnosis':
        if (!essayText) return res.status(400).json({ success: false, error: 'essayText is required' });
        result = await agenticSeekService.diagnoseCliches(essayText);
        break;
      default:
        return res.status(400).json({ success: false, error: 'Invalid ideationType' });
    }

    return res.json({ success: true, data: { result } });
  } catch (error) {
    logger.error('Error in topic ideation:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate topic ideation';
    return res.status(500).json({ success: false, error: message });
  }
});

/**
 * @route POST /api/agentic-seek/evaluate-input
 * @desc Lightweight 0–5 scoring with subscores and recommendations
 * @access Private
 */
router.post('/evaluate-input', authenticateToken, async (req, res) => {
  try {
    const { inputText = '', targetUniversity, intent = 'general' } = req.body as { inputText?: string; targetUniversity?: string; intent?: string };
    if (!req.user?.id) return res.status(401).json({ success: false, error: 'User not authenticated' });
    const text = String(inputText || '').trim();
    if (!text) return res.status(400).json({ success: false, error: 'inputText is required' });

    // Simple heuristic subscores
    const hasNumbers = /\d/.test(text) ? 0.2 : 0;
    const nounish = (text.match(/\b([A-Z][a-z]+){1,}/g) || []).length > 2 ? 0.2 : 0; // proper nouns
    const specificity = Math.min(1, 0.6 + hasNumbers + nounish);

    const authenticity = /I\s+learned|I\s+realized|reflect|meaning|because/i.test(text) ? 0.8 : 0.5;
    const contextFit = targetUniversity ? (/\b(why|program|lab|course|community)\b/i.test(text) ? 0.8 : 0.5) : 0.6;
    const actionability = /next|plan|outline|steps|scene|beat/i.test(text) ? 0.8 : 0.5;
    const clarity = text.length > 0 && text.length < 1200 ? 0.8 : 0.6;

    const subscores = { specificity, authenticity, contextFit, actionability, clarity };
    const total = Number((specificity + authenticity + contextFit + actionability + clarity).toFixed(2)); // 0–5

    const recommendations: Array<{ label: string; actionKey: string }> = [];
    if (specificity < 0.7) recommendations.push({ label: 'Hardship → Growth', actionKey: 'hardship_growth' });
    if (contextFit < 0.7 && targetUniversity) recommendations.push({ label: 'Why Us outline', actionKey: 'why_us' });
    if (actionability < 0.7) recommendations.push({ label: '8‑week plan', actionKey: 'plan_8w' });
    if (clarity < 0.7) recommendations.push({ label: 'Clarity rewrite', actionKey: 'clarity' });
    if (authenticity < 0.7) recommendations.push({ label: 'Find 5 authentic topics', actionKey: 'topics_5' });

    return res.json({ success: true, data: { total, subscores, recommendations, intent } });
  } catch (error) {
    logger.error('Error evaluating input:', error);
    return res.status(500).json({ success: false, error: 'Failed to evaluate input' });
  }
});

/**
 * @route POST /api/agentic-seek/advanced-essay-analysis
 * @desc Advanced essay analysis with university-specific insights
 * @access Private
 */
router.post('/advanced-essay-analysis', authenticateToken, async (req, res) => {
  try {
    const { essayText, userData, targetUniversity, analysisType, persona } = req.body as { essayText: string; userData?: any; targetUniversity?: string; analysisType?: 'university-specific' | 'cultural-focus' | 'general'; persona?: 'dean' | 'alumni' | 'ta' };
    
    if (!essayText) {
      return res.status(400).json({
        success: false,
        error: 'Essay text is required'
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    logger.info('Performing advanced essay analysis with AgenticSeek', { 
      essayLength: essayText.length, 
      targetUniversity,
      analysisType,
      userId: req.user.id 
    });

    let analysis: unknown;
    
    switch (analysisType) {
      case 'university-specific': {
        // Get university research first, then analyze essay
        const universityResearch = await aiService.researchUniversity(targetUniversity || '');
        const resAnalysis = await agenticSeekService.generateEssayFeedback(
          essayText,
          { ...userData, targetSchools: [targetUniversity] },
          targetUniversity,
          persona
        );
        analysis = { ...resAnalysis, universityResearch };
        break;
      }
        
      case 'cultural-focus': {
        const culturalAnalysis = await agenticSeekService.generateCulturalContextSuggestions(
          essayText,
          targetUniversity
        );
        const resAnalysis = await agenticSeekService.generateEssayFeedback(
          essayText,
          userData,
          targetUniversity,
          persona
        );
        analysis = { ...resAnalysis, culturalAnalysis };
        break;
      }
        
      default:
        analysis = await agenticSeekService.generateEssayFeedback(
          essayText,
          userData,
          targetUniversity,
          persona
        );
    }
    
    return res.json({
      success: true,
      data: analysis,
      message: 'Advanced essay analysis completed successfully'
    });
  } catch (error) {
    logger.error('Error performing advanced essay analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to perform advanced essay analysis';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

/**
 * @route GET /api/agentic-seek/models
 * @desc Get available AI models and their status
 * @access Private
 */
router.get('/models', authenticateToken, async (_req, res) => {
  try {
    const status = agenticSeekService.getStatus();
    
    return res.json({
      success: true,
      data: {
        currentModel: status.model,
        isLocal: status.isLocal,
        voiceEnabled: status.voiceEnabled,
        webBrowsingEnabled: status.webBrowsingEnabled,
        availableProviders: aiService.getAvailableProviders()
      },
      message: 'Model information retrieved successfully'
    });
  } catch (error) {
    logger.error('Error getting model information:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get model information'
    });
  }
});

/**
 * @route POST /api/agentic-seek/health-check
 * @desc Perform health check on AgenticSeek services
 * @access Private
 */
router.post('/health-check', authenticateToken, async (_req, res) => {
  try {
    const healthChecks = {
      agenticSeek: await agenticSeekService.healthCheck(),
      timestamp: new Date().toISOString()
    };
    
    return res.json({
      success: true,
      data: healthChecks,
      message: 'Health check completed'
    });
  } catch (error) {
    logger.error('Error performing health check:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to perform health check'
    });
  }
});

/**
 * @route POST /api/agentic-seek/batch-analysis
 * @desc Perform batch analysis on multiple essays
 * @access Private
 */
router.post('/batch-analysis', authenticateToken, async (req, res) => {
  try {
    const { essays, userData } = req.body;
    
    if (!essays || !Array.isArray(essays) || essays.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Essays array is required and must not be empty'
      });
    }

    if (!req.user?.id) {
      return res.status(41).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    logger.info('Starting batch analysis with AgenticSeek', { 
      essayCount: essays.length, 
      userId: req.user.id 
    });

    const results = [];
    const errors = [];

    for (const essay of essays) {
      try {
        const analysis = await agenticSeekService.generateEssayFeedback(
          essay.content,
          userData,
          essay.targetUniversity
        );
        
        results.push({
          essayId: essay.id,
          analysis,
          success: true
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          essayId: essay.id,
          error: errorMessage,
          success: false
        });
      }
    }
    
    return res.json({
      success: true,
      data: {
        results,
        errors,
        totalProcessed: essays.length,
        successful: results.length,
        failed: errors.length
      },
      message: `Batch analysis completed: ${results.length} successful, ${errors.length} failed`
    });
  } catch (error) {
    logger.error('Error performing batch analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to perform batch analysis';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

/**
 * Smart prompt pack: given story/essay, suggest school-specific prompts/angles
 */
router.post('/prompt-pack', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ success: false, error: 'User not authenticated' });
    const { story, essayText, targets, persona: _persona4 } = req.body as { story?: string; essayText?: string; targets?: string[]; persona?: 'dean' | 'alumni' | 'ta' };
    const text = (story || essayText || '').toString();
    if (!text.trim()) return res.status(400).json({ success: false, error: 'story or essayText required' });

    // Fetch user targets (fallback to top ranked universities)
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { profile: true } });
    let schools: string[] = [];
    try { if (targets?.length) schools = targets; else if (user?.profile?.targetSchools) schools = JSON.parse(user.profile.targetSchools); } catch { /* ignore */ }
    if (!schools.length) {
      const top = await prisma.university.findMany({ orderBy: { ranking: 'asc' }, take: 8 });
      schools = top.map((u: { name: string }) => u.name);
    }

    // Heuristic pack
    const pack = await Promise.all(schools.slice(0, 8).map(async (name) => {
      const personaPrefix = _persona4 === 'dean' ? '[Formal, policy-aware tone] ' : _persona4 === 'alumni' ? '[Conversational, story-first tone] ' : '[Direct, actionable writing advice] ';
      const prompt = `${personaPrefix}Describe how this story fits ${name} values and program.`;
      const angle = text.length > 400 ? 'Condense to core arc, emphasize outcomes' : 'Expand with concrete outcomes and reflection';
      const reuse = name.toLowerCase().includes('university of california') || name.toLowerCase().includes('uc') ? 0.6 : 0.8;
      return { school: name, prompt, angle, reuse };
    }));

    return res.json({ success: true, data: { suggestions: pack } });
  } catch (error) {
    logger.error('Error generating prompt pack:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate prompt pack' });
  }
});

/**
 * Reuse map: where can this essay be reused with minimal edits
 */
router.post('/reuse-map', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ success: false, error: 'User not authenticated' });
    const { essayText, persona: _persona5 } = req.body as { essayText: string; persona?: 'dean' | 'alumni' | 'ta' };
    if (!essayText?.trim()) return res.status(400).json({ success: false, error: 'essayText required' });

    const all = await prisma.university.findMany({ orderBy: { ranking: 'asc' }, take: 20 });
    const map = all.map((u: { name: string; shortName: string }) => {
      const isUC = u.name.toLowerCase().includes('university of california') || u.shortName.toLowerCase().includes('uc');
      const platform = isUC ? 'UC' : 'Common App';
      const edits = isUC ? ['Convert to PIQ format', 'Add activity-driven evidence'] : ['Add school/program specifics', 'Tighten conclusion'];
      const reuse = isUC ? 0.5 : 0.85;
      return { school: u.name, platform, reuse, minimalEdits: edits };
    }).slice(0, 10);

    return res.json({ success: true, data: { reuseMap: map } });
  } catch (error) {
    logger.error('Error generating reuse map:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate reuse map' });
  }
});

/**
 * Gap scan: simple comparison of profile vs target expectations to suggest 3 fixes
 */
router.post('/gap-scan', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ success: false, error: 'User not authenticated' });
    const { targetSchool } = req.body as { targetSchool?: string; persona?: 'dean' | 'alumni' | 'ta' };
    const profile = await prisma.userProfile.findUnique({ where: { userId: req.user.id } });
    const gaps: Array<{ label: string; action: string }> = [];
    if (!profile?.gpa || profile.gpa < 3.6) gaps.push({ label: 'GPA narrative', action: 'Add context + upward trend to PS' });
    if (!profile?.satScore && !profile?.actScore) gaps.push({ label: 'Testing plan', action: 'Decide SAT/ACT or test-optional by 2 weeks' });
    if (!profile?.targetSchools || JSON.parse(profile.targetSchools).length < 3) gaps.push({ label: 'Broaden list', action: 'Add 2 targets and 1 safety' });
    while (gaps.length < 3) gaps.push({ label: 'Activity depth', action: 'Highlight measurable impact in one activity' });
    return res.json({ success: true, data: { targetSchool: targetSchool || null, gaps: gaps.slice(0,3) } });
  } catch (error) {
    logger.error('Error performing gap scan:', error);
    return res.status(500).json({ success: false, error: 'Failed to perform gap scan' });
  }
});

export default router; 