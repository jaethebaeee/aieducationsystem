import axios from 'axios';
import { logger } from '../utils/logger';

interface GrammarIssue {
  type: string;
  category: string;
  message: string;
  suggestion?: string;
  offset: number;
  length: number;
  context: string;
  severity: 'low' | 'medium' | 'high';
}

interface GrammarAnalysis {
  score: number;
  total_errors: number;
  issues: GrammarIssue[];
  summary: string;
  error?: string;
}

interface GrammarSuggestion {
  original: string;
  suggestion: string;
  explanation: string;
  category: string;
}

export class GrammarService {
  private baseUrl: string;
  private isAvailable: boolean = false;

  constructor() {
    this.baseUrl = process.env['GRAMMAR_SERVICE_URL'] || 'http://localhost:5001';
    this.checkHealth();
  }

  private async checkHealth(): Promise<void> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      this.isAvailable = response.data.tool_available;
      logger.info(`Grammar service health check: ${response.data.status}`);
    } catch (_error) {
      logger.warn('Grammar service not available, falling back to basic analysis');
      this.isAvailable = false;
    }
  }

  async analyzeEssay(text: string): Promise<GrammarAnalysis> {
    if (!this.isAvailable) return this.fallbackAnalysis(text);
    try {
      const response = await axios.post(`${this.baseUrl}/analyze`, { text });
      return response.data;
    } catch (error) {
      logger.error('Error calling grammar service:', error);
      return this.fallbackAnalysis(text);
    }
  }

  async getSuggestions(text: string): Promise<GrammarSuggestion[]> {
    if (!this.isAvailable) return [];
    try {
      const response = await axios.post(`${this.baseUrl}/suggestions`, { text });
      return response.data.suggestions || [];
    } catch (error) {
      logger.error('Error getting grammar suggestions:', error);
      return [];
    }
  }

  async quickCheck(text: string): Promise<{ has_errors: boolean; error_count: number; score: number; }> {
    if (!this.isAvailable) return this.fallbackQuickCheck(text);
    try {
      const response = await axios.post(`${this.baseUrl}/check`, { text });
      return response.data;
    } catch (error) {
      logger.error('Error in quick grammar check:', error);
      return this.fallbackQuickCheck(text);
    }
  }

  private fallbackAnalysis(text: string): GrammarAnalysis {
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).length - 1;
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
    const issues: GrammarIssue[] = [];
    let score = 100;
    if (avgWordsPerSentence > 25) {
      issues.push({
        type: 'LONG_SENTENCE',
        category: 'STYLE',
        message: 'Sentence is very long. Consider breaking it into shorter sentences.',
        offset: 0,
        length: text.length,
        context: text.substring(0, 100) + '...',
        severity: 'medium'
      });
      score -= 10;
    }
    if (wordCount < 50) {
      issues.push({
        type: 'SHORT_ESSAY',
        category: 'STYLE',
        message: 'Essay is very short. Consider adding more content.',
        offset: 0,
        length: text.length,
        context: text,
        severity: 'high'
      });
      score -= 20;
    }
    return {
      score: Math.max(0, score),
      total_errors: issues.length,
      issues,
      summary: issues.length > 0
        ? `Found ${issues.length} style issues. Consider using LanguageTool for detailed grammar analysis.`
        : 'Basic analysis complete. For detailed grammar checking, ensure LanguageTool service is running.'
    };
  }

  private fallbackQuickCheck(text: string): { has_errors: boolean; error_count: number; score: number; } {
    const wordCount = text.split(/\s+/).length;
    const hasErrors = wordCount < 50;
    return { has_errors: hasErrors, error_count: hasErrors ? 1 : 0, score: hasErrors ? 80 : 100 };
  }

  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  async refreshHealth(): Promise<void> {
    await this.checkHealth();
  }
}

export const grammarService = new GrammarService();

