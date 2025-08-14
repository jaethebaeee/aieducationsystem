import axios from 'axios';
import { logger } from '../utils/logger';

export interface AgenticSeekConfig {
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
  enableVoice: boolean;
  enableWebBrowsing: boolean;
}

export interface AgenticSeekRequest {
  task: string;
  context?: string;
  userData?: any;
  language?: 'KO' | 'EN';
  voiceEnabled?: boolean;
  webBrowsingEnabled?: boolean;
}

export interface AgenticSeekResponse {
  result: string;
  confidence: number;
  sources?: string[];
  culturalContext?: string;
  suggestions?: string[];
  metadata?: any;
}

export interface EssayAnalysisResult {
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
  sources?: string[];
}

export interface UniversityResearchResult {
  universityName: string;
  admissionsTrends: string[];
  culturalPreferences: string[];
  essayPreferences: string[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  lastUpdated: string;
  sources: string[];
}

export class AgenticSeekService {
  private config: AgenticSeekConfig;
  private isLocal: boolean;

  constructor() {
    this.config = {
      baseUrl: process.env['AGENTIC_SEEK_URL'] || 'http://localhost:8000',
      model: process.env['AGENTIC_SEEK_MODEL'] || 'deepseek-coder:33b-instruct',
      maxTokens: parseInt(process.env['AGENTIC_SEEK_MAX_TOKENS'] || '4000'),
      temperature: parseFloat(process.env['AGENTIC_SEEK_TEMPERATURE'] || '0.7'),
      enableVoice: process.env['AGENTIC_SEEK_VOICE'] === 'true',
      enableWebBrowsing: process.env['AGENTIC_SEEK_WEB_BROWSING'] === 'true'
    };
    
    this.isLocal = process.env['AGENTIC_SEEK_MODE'] === 'local';
    
    logger.info('AgenticSeek service initialized', {
      mode: this.isLocal ? 'local' : 'api',
      model: this.config.model,
      voiceEnabled: this.config.enableVoice,
      webBrowsingEnabled: this.config.enableWebBrowsing
    });
  }

  /**
   * Check if AgenticSeek is available and healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      logger.error('AgenticSeek health check failed:', error);
      return false;
    }
  }

  /**
   * Generate essay feedback using local LLM
   */
  async generateEssayFeedback(
    essayText: string,
    userData: any,
    targetUniversity?: string,
    persona?: 'dean' | 'alumni' | 'ta'
  ): Promise<EssayAnalysisResult> {
    const task = this.buildEssayAnalysisTask(essayText, userData, targetUniversity, persona);
    
    const response = await this.executeTask({
      task,
      context: `Analyzing essay for ${targetUniversity || 'general U.S. college'} admissions`,
      userData,
      language: userData.language || 'EN'
    });

    return this.parseEssayAnalysisResponse(response);
  }

  /**
   * Research university information using web browsing
   */
  async researchUniversity(universityName: string): Promise<UniversityResearchResult> {
    const task = `Research the latest admissions information, trends, and requirements for ${universityName}. 
    Focus on:
    1. Current admissions trends and acceptance rates
    2. Cultural preferences and values
    3. Essay preferences and requirements
    4. Opportunities for Korean students
    5. Potential risks or challenges
    6. Specific recommendations for Korean applicants
    
    Provide detailed, up-to-date information from official sources.`;

    const response = await this.executeTask({
      task,
      context: `Researching ${universityName} for Korean student admissions`,
      webBrowsingEnabled: true,
      language: 'EN'
    });

    return this.parseUniversityResearchResponse(response, universityName);
  }

  /**
   * Generate cultural context suggestions
   */
  async generateCulturalContextSuggestions(
    essayText: string,
    targetUniversity?: string
  ): Promise<string> {
    const task = `Analyze this essay from a Korean cultural perspective and provide specific suggestions 
    for how the student can better present their cultural background and experiences for U.S. college admissions.
    
    Focus on:
    1. Authentic cultural elements that can be emphasized
    2. Cultural adaptation strategies
    3. Ways to make Korean experiences accessible to U.S. admissions officers
    4. Balancing cultural pride with cultural accessibility
    
    Essay: ${essayText}
    
    Target University: ${targetUniversity || 'General U.S. colleges'}`;

    const response = await this.executeTask({
      task,
      context: 'Cultural context analysis for Korean students',
      language: 'KO'
    });

    return response.result;
  }

  /**
   * Generate 5 authentic personal statement topics based on background
   */
  async generateTopicIdeas(background: string): Promise<string> {
    const task = `Generate 5 authentic, specific personal statement topics for a Korean student applying to U.S. universities.

Background: ${background}

Guidelines:
- Prioritize authenticity over hype; avoid generic hardship/competition tropes
- Tie each idea to a specific scene or moment
- Include a one-sentence angle for why it fits U.S. admissions values
- Output as a numbered list`;

    const response = await this.executeTask({ task, context: 'Essay topic ideation', language: 'EN' });
    return response.result;
  }

  /**
   * Reframe hardship into a growth arc with concrete scenes
   */
  async reframeHardship(experience: string): Promise<string> {
    const task = `Reframe this hardship into a growth narrative with concrete scenes.

Experience: ${experience}

Deliver:
1) 1–2 sentence hook
2) 2 scene beats (what happened, your actions)
3) Reflection linking growth to future goals
Keep it authentic, concise, and admissions-appropriate.`;

    const response = await this.executeTask({ task, context: 'Hardship to growth reframing', language: 'EN' });
    return response.result;
  }

  /**
   * Diagnose clichés and propose fresher angles
   */
  async diagnoseCliches(essayText: string): Promise<string> {
    const task = `Diagnose clichés in this draft and propose 3 fresher angles with brief rationale.

Draft: ${essayText}

Identify:
- Specific cliché phrases/themes
- Why they are overused
- A concrete, specific alternative angle for each`;

    const response = await this.executeTask({ task, context: 'Cliché diagnosis and reframing', language: 'EN' });
    return response.result;
  }

  /**
   * Create personalized application timeline
   */
  async createApplicationTimeline(
    userData: any,
    targetUniversities: string[]
  ): Promise<any> {
    const task = `Create a personalized application timeline for a Korean student applying to U.S. universities.
    
    Student Profile:
    - GPA: ${userData.gpa || 'Not specified'}
    - Target Universities: ${targetUniversities.join(', ')}
    - Current Date: ${new Date().toISOString().split('T')[0]}
    
    Create a detailed timeline including:
    1. Essay writing deadlines
    2. Application submission deadlines
    3. Test preparation schedules
    4. Document gathering tasks
    5. Cultural preparation activities
    6. University-specific requirements
    
    Consider Korean cultural context and provide bilingual recommendations.`;

    const response = await this.executeTask({
      task,
      context: 'Creating personalized application timeline',
      userData,
      language: userData.language || 'KO'
    });

    return this.parseTimelineResponse(response);
  }

  /**
   * Execute a task using AgenticSeek
   */
  private async executeTask(request: AgenticSeekRequest): Promise<AgenticSeekResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as AgenticSeekResponse;
      
      logger.info('AgenticSeek task executed successfully', {
        taskType: this.getTaskType(request.task),
        responseTime: response.headers.get('x-response-time'),
        resultLength: data.result?.length
      });

      return data;
    } catch (error) {
      logger.error('AgenticSeek task execution failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`AgenticSeek task failed: ${errorMessage}`);
    }
  }

  /**
   * Build essay analysis task prompt
   */
  private buildEssayAnalysisTask(essayText: string, userData: any, targetUniversity?: string, persona?: 'dean' | 'alumni' | 'ta'): string {
    const userBackground = this.formatUserBackground(userData);
    const universityContext = targetUniversity ? `for ${targetUniversity}` : 'for U.S. colleges';
    const personaTone = persona === 'dean'
      ? 'Use a formal, policy-aware tone emphasizing institutional fit and fairness.'
      : persona === 'alumni'
        ? 'Use a warm, conversational tone like an alumni interviewer focusing on stories and community contribution.'
        : persona === 'ta'
          ? 'Use a direct, concise, writing-TA tone focusing on clarity, structure, and actionable edits.'
          : 'Use a balanced, professional tone.';

    return `Analyze the following college essay for grammar, narrative structure, emotional impact, and alignment with ${universityContext}.

Persona guidelines: ${personaTone}

Student Background: ${userBackground}
Target University: ${targetUniversity || 'General U.S. colleges'}

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
}`;
  }

  /**
   * Format user background for prompts
   */
  private formatUserBackground(userData: any): string {
    const parts = [];
    
    if (userData.gpa) {
      parts.push(`GPA: ${userData.gpa}/4.0`);
    }
    
    if (userData.extracurriculars) {
      parts.push(`Extracurriculars: ${userData.extracurriculars}`);
    }
    
    if (userData.targetSchools) {
      parts.push(`Target Schools: ${userData.targetSchools.join(', ')}`);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Background information not provided';
  }

  /**
   * Parse essay analysis response
   */
  private parseEssayAnalysisResponse(response: AgenticSeekResponse): EssayAnalysisResult {
    try {
      // Try to parse as JSON first
      if (typeof response.result === 'string' && response.result.startsWith('{')) {
        const parsed = JSON.parse(response.result);
        return {
          ...parsed,
          confidence: response.confidence,
          sources: response.sources
        };
      }

      // Fallback: parse from text
      return this.parseEssayAnalysisFromText(response.result, response.confidence);
    } catch (error) {
      logger.error('Failed to parse essay analysis response:', error);
      return this.createDefaultEssayAnalysis();
    }
  }

  /**
   * Parse university research response
   */
  private parseUniversityResearchResponse(response: AgenticSeekResponse, universityName: string): UniversityResearchResult {
    // Implementation for parsing university research results
    return {
      universityName,
      admissionsTrends: this.extractListFromText(response.result, 'admissions trends'),
      culturalPreferences: this.extractListFromText(response.result, 'cultural preferences'),
      essayPreferences: this.extractListFromText(response.result, 'essay preferences'),
      opportunities: this.extractListFromText(response.result, 'opportunities'),
      risks: this.extractListFromText(response.result, 'risks'),
      recommendations: this.extractListFromText(response.result, 'recommendations'),
      lastUpdated: new Date().toISOString(),
      sources: response.sources || []
    };
  }

  /**
   * Parse timeline response
   */
  private parseTimelineResponse(response: AgenticSeekResponse): any {
    // Implementation for parsing timeline results
    return {
      timeline: response.result,
      confidence: response.confidence,
      sources: response.sources
    };
  }

  /**
   * Helper methods for parsing
   */
  private extractListFromText(text: string, category: string): string[] {
    // Simple extraction logic - can be enhanced
    const lines = text.split('\n');
    const items: string[] = [];
    let inCategory = false;
    
    for (const line of lines) {
      if (line.toLowerCase().includes(category.toLowerCase())) {
        inCategory = true;
        continue;
      }
      if (inCategory && line.trim().startsWith('-')) {
        items.push(line.trim().substring(1).trim());
      }
    }
    
    return items.length > 0 ? items : ['Information not available'];
  }

  private parseEssayAnalysisFromText(text: string, confidence: number): EssayAnalysisResult {
    // Fallback parsing logic
    return {
      grammarFeedback: { english: text, korean: text },
      storylineFeedback: { english: text, korean: text },
      collegeFitFeedback: { english: text, korean: text },
      suggestions: { english: [text], korean: [text] },
      culturalContext: { english: text, korean: text },
      overallScore: 75,
      confidence
    };
  }

  private createDefaultEssayAnalysis(): EssayAnalysisResult {
    return {
      grammarFeedback: { english: 'Analysis in progress', korean: '분석 중입니다' },
      storylineFeedback: { english: 'Analysis in progress', korean: '분석 중입니다' },
      collegeFitFeedback: { english: 'Analysis in progress', korean: '분석 중입니다' },
      suggestions: { english: ['Please try again'], korean: ['다시 시도해주세요'] },
      culturalContext: { english: 'Analysis in progress', korean: '분석 중입니다' },
      overallScore: 50,
      confidence: 0.5
    };
  }

  private getTaskType(task: string): string {
    if (task.includes('essay')) return 'essay_analysis';
    if (task.includes('university') || task.includes('research')) return 'university_research';
    if (task.includes('timeline')) return 'timeline_creation';
    if (task.includes('cultural')) return 'cultural_analysis';
    return 'general';
  }

  /**
   * Get service status
   */
  getStatus(): { isLocal: boolean; model: string; voiceEnabled: boolean; webBrowsingEnabled: boolean } {
    return {
      isLocal: this.isLocal,
      model: this.config.model,
      voiceEnabled: this.config.enableVoice,
      webBrowsingEnabled: this.config.enableWebBrowsing
    };
  }
}

// Export singleton instance
export const agenticSeekService = new AgenticSeekService(); 