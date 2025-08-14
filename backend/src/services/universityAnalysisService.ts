import { logger } from '../utils/logger';
import { aiService } from './aiService';

export interface UniversityProfile {
  id: string;
  name: string;
  admissionsTrends: AdmissionsTrend[];
  culturalPreferences: CulturalPreference[];
  essayPreferences: EssayPreference[];
  demographicShifts: DemographicShift[];
  programPriorities: ProgramPriority[];
  lastUpdated: string;
}

export interface AdmissionsTrend {
  year: number;
  totalApplications: number;
  acceptanceRate: number;
  internationalAcceptanceRate: number;
  koreanStudentAcceptanceRate: number;
  keyChanges: string[];
  newInitiatives: string[];
}

export interface CulturalPreference {
  aspect: 'leadership' | 'community|innovation' | 'diversity' | 'global_perspective' | 'academic_excellence';
  weight: number; // 1-10 scale
  description: string;
  examples: string[];
  koreanCulturalAlignment: string;
}

export interface EssayPreference {
  type: 'personal_statement' | 'supplemental' | 'why_school' | 'major';
  preferredThemes: string[];
  avoidedTopics: string[];
  culturalElements: string[];
  storytellingStyle: 'narrative' | 'analytical' | 'reflective' | 'innovative';
  wordCountPreference: 'concise' | 'detailed' | 'flexible';
}

export interface DemographicShift {
  year: number;
  internationalStudentPercentage: number;
  asianStudentPercentage: number;
  koreanStudentPercentage: number;
  geographicDiversity: string[];
  socioeconomicDiversity: string[];
}

export interface ProgramPriority {
  program: string;
  priority: 'high' | 'medium' | 'low';
  enrollmentTarget: number;
  currentEnrollment: number;
  focusAreas: string[];
}

export interface EssayAnalysis {
  universityFit: number;
  culturalAlignment: number;
  strategicRecommendations: StrategicRecommendation[];
  marketOpportunities: MarketOpportunity[];
  riskFactors: RiskFactor[];
  competitiveAdvantage: string[];
}

export interface StrategicRecommendation {
  category: 'content' | 'structure' | 'cultural' | 'timing' | 'presentation';
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
  reasoning: string;
  implementation: string;
  expectedImpact: string;
}

export interface MarketOpportunity {
  trend: string;
  opportunity: string;
  howToLeverage: string;
  successMetrics: string[];
}

export interface RiskFactor {
  factor: string;
  risk: 'high' | 'medium' | 'low';
  mitigation: string;
  alternativeApproach: string;
}

class UniversityAnalysisService {
  private universityProfiles: Map<string, UniversityProfile> = new Map();
  private analysisCache: Map<string, EssayAnalysis> = new Map();

  constructor() {
    this.initializeUniversityProfiles();
  }

  private async initializeUniversityProfiles(): Promise<void> {
    try {
      const profiles = await this.loadUniversityData();
      profiles.forEach(profile => {
        this.universityProfiles.set(profile.name.toLowerCase(), profile);
      });
      logger.info(`Loaded ${profiles.length} university profiles`);
    } catch (error) {
      logger.error('Failed to initialize university profiles:', error);
    }
  }

  private async loadUniversityData(): Promise<UniversityProfile[]> {
    // Mock data - replace with actual database/API call
    return [
      {
        id: 'harvard',
        name: 'Harvard University',
        admissionsTrends: [
          {
            year: 2024,
            totalApplications: 57000,
            acceptanceRate: 3.2,
            internationalAcceptanceRate: 2.8,
            koreanStudentAcceptanceRate: 3.1,
            keyChanges: ['Increased focus on global leadership', 'Enhanced diversity initiatives'],
            newInitiatives: ['GlobalLeadership Program', 'Cultural Innovation Hub']
          }
        ],
        culturalPreferences: [
          {
            aspect: 'leadership',
            weight: 9,
            description: 'Demonstrated leadership in community and academic settings',
            examples: ['Student government president', 'Community service organization founder'],
            koreanCulturalAlignment: 'Emphasize collective leadership and community harmony'
          },
          {
            aspect: 'global_perspective',
            weight: 8,
            description: 'International perspective and cross-cultural understanding',
            examples: ['Study abroad experience', 'International competitions'],
            koreanCulturalAlignment: 'Highlight Korean cultural background as global asset'
          }
        ],
        essayPreferences: [
          {
            type: 'personal_statement',
            preferredThemes: ['leadership', 'community service', 'intellectual curiosity'],
            avoidedTopics: ['Generic achievements', 'Overly personal trauma'],
            culturalElements: ['Cultural bridge building', 'Global perspective'],
            storytellingStyle: 'narrative',
            wordCountPreference: 'detailed'
          }
        ],
        demographicShifts: [
          {
            year: 2024,
            internationalStudentPercentage: 12,
            asianStudentPercentage: 25,
            koreanStudentPercentage: 2.1,
            geographicDiversity: ['Asia', 'Europe', 'Americas'],
            socioeconomicDiversity: ['Need-blind admissions', 'Generous financial aid']
          }
        ],
        programPriorities: [
          {
            program: 'Computer Science',
            priority: 'high',
            enrollmentTarget: 200,
            currentEnrollment: 180,
            focusAreas: ['AI/ML', 'Cybersecurity', 'Computer Interaction']
          }
        ],
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  public async analyzeEssayForUniversity(
    essayContent: string,
    universityName: string,
    essayType: string
  ): Promise<EssayAnalysis> {
    const cacheKey = `${universityName}_${this.hashContent(essayContent)}_${essayType}`;
    
    // Check cache first
    if (this.analysisCache.has(cacheKey)) {
      logger.info('Returning cached analysis result');
      return this.analysisCache.get(cacheKey)!;
    }

    const universityProfile = this.universityProfiles.get(universityName.toLowerCase());
    if (!universityProfile) {
      throw new Error(`University profile not found for ${universityName}`);
    }

    const analysis = await this.performDeepAnalysis(essayContent, universityProfile);
    
    // Cache the result
    this.analysisCache.set(cacheKey, analysis);
    
    return analysis;
  }

  private async performDeepAnalysis(
    essayContent: string,
    universityProfile: UniversityProfile
  ): Promise<EssayAnalysis> {
    const [marketAnalysis, culturalAnalysis] = await Promise.all([
      this.analyzeMarketConditions(universityProfile),
      this.analyzeCulturalAlignment(essayContent, universityProfile)
    ]);

    const strategicRecommendations = await this.generateStrategicRecommendations(
      universityProfile,
      marketAnalysis,
      culturalAnalysis
    );

    const competitiveAdvantage = await this.analyzeStrategicPositioning(essayContent, universityProfile);

    return {
      universityFit: this.calculateUniversityFit(universityProfile),
      culturalAlignment: this.calculateCulturalAlignment(culturalAnalysis),
      strategicRecommendations,
      marketOpportunities: marketAnalysis.opportunities,
      riskFactors: marketAnalysis.risks,
      competitiveAdvantage: competitiveAdvantage.advantages
    };
  }

  private async analyzeMarketConditions(universityProfile: UniversityProfile): Promise<{
    opportunities: MarketOpportunity[];
    risks: RiskFactor[];
  }> {
    const currentTrends = universityProfile.admissionsTrends[0];
    const opportunities: MarketOpportunity[] = [];
    const risks: RiskFactor[] = [];

    if (currentTrends) {
      // Market opportunities
      if (currentTrends.koreanStudentAcceptanceRate > currentTrends.internationalAcceptanceRate) {
        opportunities.push({
          trend: 'Korean student advantage',
          opportunity: 'Korean students have higher acceptance rates than other international students',
          howToLeverage: 'Emphasize Korean cultural background and bilingual capabilities',
          successMetrics: ['Cultural authenticity score', 'Language proficiency demonstration']
        });
      }

      if (currentTrends.newInitiatives.some(initiative => initiative.includes('global'))) {
        opportunities.push({
          trend: 'Global initiatives focus',
          opportunity: 'University prioritizing global perspective and international collaboration',
          howToLeverage: 'Highlight cross-cultural experiences and global mindset',
          successMetrics: ['International experience documentation, s-cultural project examples']
        });
      }

      // Market risks
      if (currentTrends.acceptanceRate < 5) {
        risks.push({
          factor: 'Highly competitive admissions',
          risk: 'high',
          mitigation: 'Focus on unique value proposition and distinctive experiences',
          alternativeApproach: 'Consider applying to similar but less competitive programs'
        });
      }

      if (currentTrends.totalApplications > 50000) {
        risks.push({
          factor: 'Application volume surge',
          risk: 'medium',
          mitigation: 'Ensure application stands out with unique personal story',
          alternativeApproach: 'Apply early decision to demonstrate strong interest'
        });
      }
    }

    return { opportunities, risks };
  }

  private async analyzeCulturalAlignment(
    essayContent: string,
    universityProfile: UniversityProfile
  ): Promise<Record<string, number>> {
    const alignmentScores: Record<string, number> = {};

    for (const preference of universityProfile.culturalPreferences) {
      const score = await this.calculateCulturalPreferenceScore(essayContent, preference);
      alignmentScores[preference.aspect] = score;
    }

    return alignmentScores;
  }

  private async calculateCulturalPreferenceScore(
    essayContent: string,
    preference: CulturalPreference
  ): Promise<number> {
    const prompt = `
      Analyze how well this essay aligns with the cultural preference: ${preference.aspect}
      
      Essay: ${essayContent.substring(0,1000)}...
      
      Cultural Preference: ${preference.description}
      Examples: ${preference.examples.join(', ')}
      Korean Cultural Alignment: ${preference.koreanCulturalAlignment}
      
      Rate the alignment from 1-100 and provide specific feedback on how well the essay demonstrates this cultural preference, especially considering Korean cultural context.
    `;

    try {
      const response = await aiService.generateEssayFeedback(prompt, {});
      // Parse the response to extract the score
      const scoreMatch = response.grammarFeedback.english.match(/(\d+)/);
      return scoreMatch && scoreMatch[1] ? parseInt(scoreMatch[1]) : 50;
    } catch (error) {
      logger.error('Error calculating cultural preference score:', error);
      return 50; // Default score
    }
  }

  private async analyzeStrategicPositioning(
    essayContent: string,
    universityProfile: UniversityProfile
  ): Promise<{
    advantages: string[];
    positioning: string;
  }> {
    const advantages: string[] = [];
    const positioning = await this.determineStrategicPositioning(essayContent, universityProfile);

    // Analyze competitive advantages based on student profile and university preferences
    if (universityProfile.culturalPreferences.some(p => p.aspect === 'global_perspective')) {
      advantages.push('Unique Korean cultural perspective');
      advantages.push('Bilingual capabilities');
      advantages.push('Cross-cultural understanding');
    }

    // Add advantages based on university preferences
    universityProfile.culturalPreferences.forEach(preference => {
      if (preference.weight >= 8) {
        advantages.push(`Strong alignment with ${preference.aspect} preference`);
      }
    });

    return { advantages, positioning };
  }

  private async determineStrategicPositioning(
    essayContent: string,
    universityProfile: UniversityProfile
  ): Promise<string> {
    const prompt = `
      Based on the following information, determine the optimal strategic positioning for this student:
      
      University: ${universityProfile.name}
      University Focus Areas: ${(universityProfile.admissionsTrends[0]?.newInitiatives || []).join(', ')}
      Student Background: Korean
      Essay Content: ${essayContent.substring(0, 500)}...
      
      Provide a strategic positioning statement that highlights the student's unique value proposition for this specific university.
    `;

    try {
      const response = await aiService.generateEssayFeedback(prompt, {});
      return response.grammarFeedback.english;
    } catch (error) {
      logger.error('Error determining strategic positioning:', error);
      return 'Cultural bridge builder with global perspective';
    }
  }

  private async generateStrategicRecommendations(
    universityProfile: UniversityProfile,
    marketAnalysis: { opportunities: MarketOpportunity[]; risks: RiskFactor[] },
    culturalAnalysis: Record<string, number>
  ): Promise<StrategicRecommendation[]> {
    const recommendations: StrategicRecommendation[] = [];

    // Content recommendations based on university preferences
    const essayPreference = universityProfile.essayPreferences.find(ep => ep.type === 'personal_statement');
    if (essayPreference) {
      recommendations.push({
        category: 'content',
        priority: 'high',
        recommendation: `Emphasize themes: ${essayPreference.preferredThemes.join(', ')}`,
        reasoning: 'University specifically values these themes in essays',
        implementation: 'Revise essay to highlight these themes more prominently',
        expectedImpact: 'Increased alignment with university preferences'
      });
    }

    // Cultural recommendations
    Object.entries(culturalAnalysis).forEach(([aspect, score]) => {
      if (score < 70) {
        const preference = universityProfile.culturalPreferences.find(cp => cp.aspect === aspect);
        if (preference) {
          recommendations.push({
            category: 'cultural',
            priority: score < 50 ? 'high' : 'medium',
            recommendation: `Strengthen ${aspect} alignment`,
            reasoning: `University heavily weights ${aspect} (weight: ${preference.weight})`,
            implementation: preference.koreanCulturalAlignment,
            expectedImpact: 'Improved cultural fit score'
          });
        }
      }
    });

    // Market opportunity recommendations
    marketAnalysis.opportunities.forEach((opportunity) => {
      recommendations.push({
        category: 'content',
        priority: 'medium',
        recommendation: `Leverage: ${opportunity.trend}`,
        reasoning: opportunity.opportunity,
        implementation: opportunity.howToLeverage,
        expectedImpact: 'Capitalize on current market conditions'
      });
    });

    return recommendations;
  }

  private calculateUniversityFit(universityProfile: UniversityProfile): number {
    // Calculate overall fit score based on multiple factors
    let score = 50; // Base score

    // Adjust based on cultural preferences
    universityProfile.culturalPreferences.forEach(preference => {
      score += preference.weight * 2; // Weighted contribution
    });

    // Adjust based on program priorities
    const highPriorityPrograms = universityProfile.programPriorities.filter(p => p.priority === 'high');
    score += highPriorityPrograms.length * 5;

    return Math.min(100, Math.max(0));
  }

  private calculateCulturalAlignment(culturalAnalysis: Record<string, number>): number {
    const scores = Object.values(culturalAnalysis);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private hashContent(content: string): string {
    // Simple hash function for caching
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  public async getUniversityInsights(universityName: string): Promise<{
    trends: string[];
    opportunities: string[];
    risks: string[];
    recommendations: string[];
  }> {
    const universityProfile = this.universityProfiles.get(universityName.toLowerCase());
    if (!universityProfile) {
      throw new Error(`University profile not found for ${universityName}`);
    }

    const currentTrends = universityProfile.admissionsTrends[0];
    const insights = {
      trends: currentTrends?.keyChanges || [],
      opportunities: currentTrends?.newInitiatives || [],
      risks: [] as string[],
      recommendations: [] as string[]
    };

    // Add strategic recommendations based on current trends
    if (currentTrends) {
      if (currentTrends.acceptanceRate < 5) {
        insights.risks.push('Highly competitive admissions - focus on unique value proposition');
        insights.recommendations.push('Emphasize distinctive qualities and experiences');
      }

      if (currentTrends.koreanStudentAcceptanceRate > currentTrends.internationalAcceptanceRate) {
        insights.opportunities.push('Korean students have competitive advantage');
        insights.recommendations.push('Highlight Korean cultural background authentically');
      }
    }

    return insights;
  }

  public async updateUniversityProfile(universityName: string, newData: Partial<UniversityProfile>): Promise<void> {
    const existingProfile = this.universityProfiles.get(universityName.toLowerCase());
    if (existingProfile) {
      const updatedProfile = { ...existingProfile, ...newData, lastUpdated: new Date().toISOString() };
      this.universityProfiles.set(universityName.toLowerCase(), updatedProfile);
      
      // Clear cache for this university
      const cacheKeys = Array.from(this.analysisCache.keys()).filter(key => key.startsWith(universityName));
      cacheKeys.forEach(key => this.analysisCache.delete(key));
      
      logger.info(`Updated university profile for ${universityName}`);
    }
  }
}

// Create singleton instance
const universityAnalysisService = new UniversityAnalysisService();

export default universityAnalysisService; 