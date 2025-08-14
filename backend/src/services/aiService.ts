import axios from 'axios';
import { logger } from '../utils/logger';
import { agenticSeekService } from './agenticSeekService';

interface UserData {
  gpa?: number;
  extracurriculars?: string;
  targetSchools?: string[];
  essayGoals?: string[];
  language?: 'KO' | 'EN';
}

interface EssayFeedbackResponse {
  grammarFeedback: {
    english: string;
    korean: string;
  };
  storylineFeedback: {
    english: string;
    korean: string;
  };
  collegeFitFeedback: {
    english: string;
    korean: string;
  };
  suggestions: {
    english: string[];
    korean: string[];
  };
  culturalContext?: {
    english: string;
    korean: string;
  };
  overallScore: number;
  confidence: number;
  aiProvider?: 'agentic-seek' | 'openai';
  processingTime?: number;
}

export class AIService {
  private openaiApiKey: string;
  private openaiBaseUrl: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;
  private enableAgenticSeek: boolean;
  private agenticSeekFallback: boolean;

  constructor() {
    this.openaiApiKey = process.env['OPENAI_API_KEY'] || '';
    this.openaiBaseUrl = process.env['OPENAI_BASE_URL'] || 'https://api.openai.com/v1';
    this.model = process.env['OPENAI_MODEL'] || 'gpt-4';
    this.maxTokens = parseInt(process.env['OPENAI_MAX_TOKENS'] || '2000');
    this.temperature = parseFloat(process.env['OPENAI_TEMPERATURE'] || '0.7');
    this.enableAgenticSeek = process.env['ENABLE_AGENTIC_SEEK'] === 'true';
    this.agenticSeekFallback = process.env['AGENTIC_SEEK_FALLBACK'] === 'true';
  }

  /**
   * Generate comprehensive essay feedback using AgenticSeek (local LLM) or OpenAI
   */
  async generateEssayFeedback(
    essayText: string,
    userData: UserData,
    options?: { persona?: 'dean' | 'alumni' | 'ta'; targetUniversity?: string }
  ): Promise<EssayFeedbackResponse> {
    const startTime = Date.now();
    const persona = options?.persona;
    const targetUniversity = options?.targetUniversity;
    
    try {
      // Try AgenticSeek first if enabled
      if (this.enableAgenticSeek) {
        try {
          const isHealthy = await agenticSeekService.healthCheck();
          if (isHealthy) {
            logger.info('Using AgenticSeek for essay feedback');
            const result = await agenticSeekService.generateEssayFeedback(
              essayText,
              userData,
              targetUniversity || userData.targetSchools?.[0],
              persona
            );
            
            const processingTime = Date.now() - startTime;
            logger.info('Essay feedback generated successfully with AgenticSeek', {
              essayLength: essayText.length,
              userData: { ...userData, targetSchools: userData.targetSchools?.length },
              processingTime,
              provider: 'agentic-seek'
            });

            return {
              ...result,
              aiProvider: 'agentic-seek',
              processingTime
            };
          }
        } catch (error) {
          logger.warn('AgenticSeek failed, falling back to OpenAI:', error);
          if (!this.agenticSeekFallback) {
            throw error;
          }
        }
      }

      // Fallback to OpenAI
      logger.info('Using OpenAI for essay feedback');
      const result = await this.generateEssayFeedbackWithOpenAI(essayText, userData, persona);
      
      const processingTime = Date.now() - startTime;
      logger.info('Essay feedback generated successfully with OpenAI', {
        essayLength: essayText.length,
        userData: { ...userData, targetSchools: userData.targetSchools?.length },
        processingTime,
        provider: 'openai'
      });

      return {
        ...result,
        aiProvider: 'openai',
        processingTime
      };

    } catch (error) {
      logger.error('Error generating essay feedback:', error);
      throw new Error('Failed to generate essay feedback');
    }
  }

  /**
   * Generate essay feedback using OpenAI (fallback method)
   */
  private async generateEssayFeedbackWithOpenAI(
    essayText: string,
    userData: UserData,
    persona?: 'dean' | 'alumni' | 'ta'
  ): Promise<EssayFeedbackResponse> {
    // If calling api.openai.com, require API key; for OSS OpenAI-compatible servers (e.g., Ollama/vLLM/LocalAI), allow no key
    const isOfficialOpenAI = this.openaiBaseUrl.includes('api.openai.com');
    if (isOfficialOpenAI && !this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = this.buildEssayFeedbackPrompt(essayText, userData, persona);
    
    const response = await axios.post(
      `${this.openaiBaseUrl}/chat/completions`,
      {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert college admissions essay consultant specializing in helping Korean students apply to U.S. colleges. You provide constructive, culturally-aware feedback that enhances the student's authentic voice without writing for them. Always respond in valid JSON format.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          ...(this.openaiApiKey ? { 'Authorization': `Bearer ${this.openaiApiKey}` } : {}),
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const feedback = JSON.parse(content);

    return feedback;
  }

  /**
   * Generate cultural context suggestions using AgenticSeek or OpenAI
   */
  async generateCulturalContextSuggestions(essayText: string): Promise<string> {
    try {
      // Try AgenticSeek first if enabled
      if (this.enableAgenticSeek) {
        try {
          const isHealthy = await agenticSeekService.healthCheck();
          if (isHealthy) {
            logger.info('Using AgenticSeek for cultural context suggestions');
            return await agenticSeekService.generateCulturalContextSuggestions(essayText);
          }
        } catch (error) {
          logger.warn('AgenticSeek failed for cultural context, falling back to OpenAI:', error);
          if (!this.agenticSeekFallback) {
            throw error;
          }
        }
      }

      // Fallback to OpenAI
      logger.info('Using OpenAI for cultural context suggestions');
      return await this.generateCulturalContextWithOpenAI(essayText);

    } catch (error) {
      logger.error('Error generating cultural context suggestions:', error);
      throw new Error('Failed to generate cultural context suggestions');
    }
  }

  /**
   * Generate cultural context using OpenAI (fallback method)
   */
  private async generateCulturalContextWithOpenAI(essayText: string): Promise<string> {
    const response = await axios.post(
      `${this.openaiBaseUrl}/chat/completions`,
      {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert in helping Korean students adapt their cultural experiences for U.S. college applications.'
          },
          {
            role: 'user',
            content: `Analyze this essay and provide specific suggestions for how a Korean student can better present their cultural background and experiences for U.S. college admissions. Focus on authenticity and cultural pride while making the content accessible to U.S. admissions officers.

Essay: ${essayText}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          ...(this.openaiApiKey ? { 'Authorization': `Bearer ${this.openaiApiKey}` } : {}),
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Research university information using AgenticSeek
   */
  async researchUniversity(universityName: string): Promise<any> {
    try {
      if (!this.enableAgenticSeek) {
        throw new Error('AgenticSeek is not enabled for university research');
      }

      const isHealthy = await agenticSeekService.healthCheck();
      if (!isHealthy) {
        throw new Error('AgenticSeek is not available for university research');
      }

      logger.info('Using AgenticSeek for university research', { universityName });
      return await agenticSeekService.researchUniversity(universityName);

    } catch (error) {
      logger.error('Error researching university:', error);
      throw new Error('Failed to research university information');
    }
  }

  /**
   * Create personalized application timeline using AgenticSeek
   */
  async createApplicationTimeline(userData: any, targetUniversities: string[]): Promise<any> {
    try {
      if (!this.enableAgenticSeek) {
        throw new Error('AgenticSeek is not enabled for timeline creation');
      }

      const isHealthy = await agenticSeekService.healthCheck();
      if (!isHealthy) {
        throw new Error('AgenticSeek is not available for timeline creation');
      }

      logger.info('Using AgenticSeek for timeline creation', { 
        targetUniversities: targetUniversities.length 
      });
      return await agenticSeekService.createApplicationTimeline(userData, targetUniversities);

    } catch (error) {
      logger.error('Error creating application timeline:', error);
      throw new Error('Failed to create application timeline');
    }
  }

  /**
   * Get AI service status and capabilities
   */
  async getServiceStatus(): Promise<{
    agenticSeek: {
      enabled: boolean;
      healthy: boolean;
      status: any;
    };
    openai: {
      enabled: boolean;
      configured: boolean;
      baseUrl: string;
    };
    recommendedProvider: string;
  }> {
    const agenticSeekStatus = {
      enabled: this.enableAgenticSeek,
      healthy: false,
      status: null as any
    };

    if (this.enableAgenticSeek) {
      try {
        agenticSeekStatus.healthy = await agenticSeekService.healthCheck();
        agenticSeekStatus.status = agenticSeekService.getStatus();
      } catch (error) {
        logger.warn('AgenticSeek health check failed:', error);
      }
    }

    const openaiStatus = {
      enabled: !this.enableAgenticSeek || this.agenticSeekFallback,
      configured: !!this.openaiApiKey || !this.openaiBaseUrl.includes('api.openai.com'),
      baseUrl: this.openaiBaseUrl
    };

    const recommendedProvider = agenticSeekStatus.healthy ? 'agentic-seek' : 'openai';

    return {
      agenticSeek: agenticSeekStatus,
      openai: openaiStatus,
      recommendedProvider
    };
  }

  /**
   * Build the comprehensive prompt for essay analysis
   */
  private buildEssayFeedbackPrompt(essayText: string, userData: UserData, persona?: 'dean' | 'alumni' | 'ta'): string {
    const userBackground = this.formatUserBackground(userData);
    const targetSchools = userData.targetSchools?.join(', ') || 'General U.S. colleges';
    const essayGoals = userData.essayGoals?.join(', ') || 'General improvement';
    const personaTone = persona === 'dean'
      ? 'Use a formal, policy-aware tone emphasizing institutional fit and fairness.'
      : persona === 'alumni'
        ? 'Use a warm, conversational tone like an alumni interviewer focusing on stories, authenticity, and campus contribution.'
        : persona === 'ta'
          ? 'Use a direct, concise, writing-TA tone focusing on clarity, structure, and actionable edits.'
          : 'Use a balanced, professional tone.';

    return `Analyze the following college essay for grammar, narrative structure, emotional impact, and alignment with top U.S. colleges like Harvard (leadership), Stanford (innovation), or MIT (technical expertise).

Persona guidelines: ${personaTone}

Student Background: ${userBackground}
Target Schools: ${targetSchools}
Essay Goals: ${essayGoals}

Provide comprehensive feedback in both Korean and English, ensuring it enhances the student's voice without writing for them. Focus on suggestions for improvement.

Essay to analyze:
${essayText}

Respond in the following JSON format:
{
  "grammarFeedback": {
    "english": "Detailed grammar feedback in English",
    "korean": "상세한 문법 피드백 (한국어)"
  },
  "storylineFeedback": {
    "english": "Narrative structure and storytelling feedback in English",
    "korean": "내러티브 구조 및 스토리텔링 피드백 (한국어)"
  },
  "collegeFitFeedback": {
    "english": "Alignment with target colleges and values in English",
    "korean": "목표 대학 및 가치와의 일치도 피드백 (한국어)"
  },
  "suggestions": {
    "english": ["Specific suggestion 1", "Specific suggestion 2", "Specific suggestion 3"],
    "korean": ["구체적인 제안 1", "구체적인 제안 2", "구체적인 제안 3"]
  },
  "culturalContext": {
    "english": "Cultural adaptation suggestions for U.S. college context",
    "korean": "미국 대학 맥락에 맞는 문화적 적응 제안"
  },
  "overallScore": 85,
  "confidence": 0.92
}

Include specific examples like "In paragraph 2, add sensory details to enhance vividness" and align feedback with college values like "This aligns with Harvard's emphasis on leadership, but consider emphasizing teamwork."`;
  }

  /**
   * Format user background for the prompt
   */
  private formatUserBackground(userData: UserData): string {
    const parts = [];
    
    if (userData.gpa) {
      parts.push(`GPA: ${userData.gpa}/4.0`);
    }
    
    if (userData.extracurriculars) {
      parts.push(`Extracurriculars: ${userData.extracurriculars}`);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Background information not provided';
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return this.enableAgenticSeek || !!this.openaiApiKey;
  }

  /**
   * Lightweight LLM health check: try /models for OpenAI-compatible, or a trivial completion
   */
  async pingLLM(): Promise<boolean> {
    try {
      // If using OpenAI-compatible APIs
      const isOfficialOpenAI = this.openaiBaseUrl.includes('api.openai.com');
      if (isOfficialOpenAI && !this.openaiApiKey) return false;

      // Try /models first as a cheap request
      const modelsUrl = `${this.openaiBaseUrl}/models`;
      const res = await axios.get(modelsUrl, {
        headers: {
          ...(this.openaiApiKey ? { Authorization: `Bearer ${this.openaiApiKey}` } : {}),
          'Content-Type': 'application/json',
        },
      });
      return res.status >= 200 && res.status < 300;
    } catch (_err) {
      // If models endpoint not supported, try a trivial completion
      try {
        const res = await axios.post(
          `${this.openaiBaseUrl}/chat/completions`,
          {
            model: this.model,
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 1,
            temperature: 0,
          },
          {
            headers: {
              ...(this.openaiApiKey ? { Authorization: `Bearer ${this.openaiApiKey}` } : {}),
              'Content-Type': 'application/json',
            },
          }
        );
        return res.status >= 200 && res.status < 300;
      } catch (__err) {
        return false;
      }
    }
  }

  /**
   * Get available AI providers
   */
  getAvailableProviders(): string[] {
    const providers = [];
    
    if (this.enableAgenticSeek) {
      providers.push('agentic-seek');
    }
    
    if (this.openaiApiKey) {
      providers.push('openai');
    }
    
    return providers;
  }
}

// Export singleton instance
export const aiService = new AIService(); 