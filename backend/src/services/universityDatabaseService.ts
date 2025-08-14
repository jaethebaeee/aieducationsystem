import { logger } from '../utils/logger';

export interface UniversityData {
  id: string;
  name: string;
  nameKo: string;
  location: string;
  locationKo: string;
  type: 'public' | 'private' | 'liberal-arts' | 'research' | 'ivy-league';
  ranking: number;
  acceptanceRate: number;
  koreanStudentCount: number;
  koreanAcceptanceRate: number;
  koreanStudentSuccessRate: number;
  tuition: number;
  roomAndBoard: number;
  totalCost: number;
  financialAidPercentage: number;
  koreanStudentAid: number;
  culturalFit: {
    koreanCommunity: number; // 1-10 scale
    asianStudentPercentage: number;
    internationalSupport: number; // 1-10 scale
    culturalClubs: string[];
    koreanStudentOrganizations: string[];
  };
  weather: {
    climate: string;
    seasons: string[];
    koreanStudentPreferences: string[];
  };
  applicationDeadlines: {
    earlyDecision: string;
    regularDecision: string;
    transfer: string;
  };
  strengths: string[];
  weaknesses: string[];
  koreanStudentAdvantages: string[];
  koreanStudentChallenges: string[];
  recommendations: string[];
}

export class UniversityDatabaseService {
  private universities: Map<string, UniversityData> = new Map();

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const universityData: UniversityData[] = [
      {
        id: 'harvard',
        name: 'Harvard University',
        nameKo: '하버드 대학교',
        location: 'Cambridge, MA',
        locationKo: '캠브리지, 매사추세츠',
        type: 'ivy-league',
        ranking: 1,
        acceptanceRate: 4.6,
        koreanStudentCount: 120,
        koreanAcceptanceRate: 3.2,
        koreanStudentSuccessRate: 98,
        tuition: 57261,
        roomAndBoard: 18589,
        totalCost: 76050,
        financialAidPercentage: 55,
        koreanStudentAid: 45000,
        culturalFit: {
          koreanCommunity: 8,
          asianStudentPercentage: 25,
          internationalSupport: 9,
          culturalClubs: ['Korean Students Association', 'Asian American Association', 'International Students Association'],
          koreanStudentOrganizations: ['Harvard Korean Students Association', 'Korean Cultural Society']
        },
        weather: {
          climate: 'Humid continental',
          seasons: ['Cold winters', 'Mild summers', 'Beautiful fall', 'Wet spring'],
          koreanStudentPreferences: ['Beautiful campus', 'Four seasons', 'Close to Boston']
        },
        applicationDeadlines: {
          earlyDecision: '2024-11-01',
          regularDecision: '2025-01-01',
          transfer: '2025-03-01'
        },
        strengths: ['World-class academics', 'Strong alumni network', 'Excellent resources', 'Global reputation'],
        weaknesses: ['Very competitive', 'High cost', 'Intense pressure', 'Cold weather'],
        koreanStudentAdvantages: ['Strong Korean community', 'Excellent academic preparation', 'Cultural diversity', 'International focus'],
        koreanStudentChallenges: ['Extreme competition', 'High expectations', 'Cultural adjustment', 'Financial burden'],
        recommendations: [
          'Emphasize unique cultural perspective',
          'Show strong academic preparation',
          'Demonstrate leadership in Korean community',
          'Highlight international experiences'
        ]
      },
      {
        id: 'stanford',
        name: 'Stanford University',
        nameKo: '스탠포드 대학교',
        location: 'Stanford, CA',
        locationKo: '스탠포드, 캘리포니아',
        type: 'research',
        ranking: 2,
        acceptanceRate: 4.3,
        koreanStudentCount: 180,
        koreanAcceptanceRate: 3.8,
        koreanStudentSuccessRate: 96,
        tuition: 56169,
        roomAndBoard: 17522,
        totalCost: 73691,
        financialAidPercentage: 63,
        koreanStudentAid: 48000,
        culturalFit: {
          koreanCommunity: 9,
          asianStudentPercentage: 30,
          internationalSupport: 8,
          culturalClubs: ['Korean Students Association', 'Asian American Students Association', 'Korean Graduate Student Association'],
          koreanStudentOrganizations: ['Stanford Korean Students Association', 'Korean Cultural Center']
        },
        weather: {
          climate: 'Mediterranean',
          seasons: ['Mild winters', 'Warm summers', 'Pleasant year-round'],
          koreanStudentPreferences: ['Great weather', 'Beautiful campus', 'Tech opportunities', 'Korean community']
        },
        applicationDeadlines: {
          earlyDecision: '2024-11-01',
          regularDecision: '2025-01-02',
          transfer: '2025-03-15'
        },
        strengths: ['Innovation focus', 'Beautiful campus', 'Great weather', 'Tech opportunities', 'Strong Korean community'],
        weaknesses: ['Very competitive', 'High cost', 'Silicon Valley pressure', 'Expensive area'],
        koreanStudentAdvantages: ['Large Korean community', 'Tech industry connections', 'Innovation culture', 'Beautiful weather'],
        koreanStudentChallenges: ['High competition', 'Cost of living', 'Academic pressure', 'Cultural adjustment'],
        recommendations: [
          'Show innovation and creativity',
          'Highlight tech interests',
          'Emphasize Korean cultural background',
          'Demonstrate entrepreneurial spirit'
        ]
      },
      {
        id: 'mit',
        name: 'Massachusetts Institute of Technology',
        nameKo: '매사추세츠 공과대학교',
        location: 'Cambridge, MA',
        locationKo: '캠브리지, 매사추세츠',
        type: 'research',
        ranking: 3,
        acceptanceRate: 6.7,
        koreanStudentCount: 150,
        koreanAcceptanceRate: 5.2,
        koreanStudentSuccessRate: 94,
        tuition: 57786,
        roomAndBoard: 17580,
        totalCost: 75366,
        financialAidPercentage: 58,
        koreanStudentAid: 42000,
        culturalFit: {
          koreanCommunity: 7,
          asianStudentPercentage: 40,
          internationalSupport: 7,
          culturalClubs: ['Korean Students Association', 'Asian American Association', 'International Students Office'],
          koreanStudentOrganizations: ['MIT Korean Students Association', 'Korean Cultural Club']
        },
        weather: {
          climate: 'Humid continental',
          seasons: ['Cold winters', 'Mild summers', 'Beautiful fall', 'Wet spring'],
          koreanStudentPreferences: ['Academic focus', 'Innovation culture', 'Strong STEM programs']
        },
        applicationDeadlines: {
          earlyDecision: '2024-11-01',
          regularDecision: '2025-01-01',
          transfer: '2025-03-15'
        },
        strengths: ['World-class STEM', 'Innovation culture', 'Research opportunities', 'Strong alumni network'],
        weaknesses: ['Very competitive', 'High cost', 'Intense academic pressure', 'Cold weather'],
        koreanStudentAdvantages: ['Strong STEM preparation', 'Innovation mindset', 'Research opportunities', 'Global reputation'],
        koreanStudentChallenges: ['Extreme academic pressure', 'High competition', 'Cultural adjustment', 'Work-life balance'],
        recommendations: [
          'Show strong STEM abilities',
          'Demonstrate innovation projects',
          'Highlight research experience',
          'Emphasize problem-solving skills'
        ]
      },
      {
        id: 'yale',
        name: 'Yale University',
        nameKo: '예일 대학교',
        location: 'New Haven, CT',
        locationKo: '뉴헤이븐, 코네티컷',
        type: 'ivy-league',
        ranking: 4,
        acceptanceRate: 5.9,
        koreanStudentCount: 95,
        koreanAcceptanceRate: 4.1,
        koreanStudentSuccessRate: 97,
        tuition: 59950,
        roomAndBoard: 17500,
        totalCost: 77450,
        financialAidPercentage: 52,
        koreanStudentAid: 44000,
        culturalFit: {
          koreanCommunity: 6,
          asianStudentPercentage: 20,
          internationalSupport: 8,
          culturalClubs: ['Korean Students Association', 'Asian American Students Alliance', 'International Students Organization'],
          koreanStudentOrganizations: ['Yale Korean Students Association', 'Korean Cultural Society']
        },
        weather: {
          climate: 'Humid continental',
          seasons: ['Cold winters', 'Mild summers', 'Beautiful fall', 'Wet spring'],
          koreanStudentPreferences: ['Beautiful campus', 'Strong academics', 'Cultural activities']
        },
        applicationDeadlines: {
          earlyDecision: '2024-11-01',
          regularDecision: '2025-01-02',
          transfer: '2025-03-01'
        },
        strengths: ['Excellent academics', 'Beautiful campus', 'Strong arts programs', 'Global reputation'],
        weaknesses: ['Very competitive', 'High cost', 'Small city', 'Cold weather'],
        koreanStudentAdvantages: ['Strong academic preparation', 'Cultural diversity', 'Global perspective', 'Excellent resources'],
        koreanStudentChallenges: ['High competition', 'Cultural adjustment', 'Academic pressure', 'Financial burden'],
        recommendations: [
          'Show intellectual curiosity',
          'Highlight cultural interests',
          'Demonstrate leadership',
          'Emphasize global perspective'
        ]
      },
      {
        id: 'princeton',
        name: 'Princeton University',
        nameKo: '프린스턴 대학교',
        location: 'Princeton, NJ',
        locationKo: '프린스턴, 뉴저지',
        type: 'ivy-league',
        ranking: 5,
        acceptanceRate: 5.6,
        koreanStudentCount: 85,
        koreanAcceptanceRate: 3.9,
        koreanStudentSuccessRate: 99,
        tuition: 57410,
        roomAndBoard: 17550,
        totalCost: 74960,
        financialAidPercentage: 60,
        koreanStudentAid: 46000,
        culturalFit: {
          koreanCommunity: 7,
          asianStudentPercentage: 22,
          internationalSupport: 8,
          culturalClubs: ['Korean Students Association', 'Asian American Students Association', 'International Students Association'],
          koreanStudentOrganizations: ['Princeton Korean Students Association', 'Korean Cultural Society']
        },
        weather: {
          climate: 'Humid subtropical',
          seasons: ['Cold winters', 'Hot summers', 'Beautiful fall', 'Mild spring'],
          koreanStudentPreferences: ['Beautiful campus', 'Strong academics', 'Close to NYC']
        },
        applicationDeadlines: {
          earlyDecision: '2024-11-01',
          regularDecision: '2025-01-01',
          transfer: '2025-03-01'
        },
        strengths: ['Excellent academics', 'Beautiful campus', 'Strong research', 'Generous financial aid'],
        weaknesses: ['Very competitive', 'Small town', 'High pressure', 'Expensive area'],
        koreanStudentAdvantages: ['Strong academic preparation', 'Research opportunities', 'Generous aid', 'Beautiful campus'],
        koreanStudentChallenges: ['High competition', 'Academic pressure', 'Cultural adjustment', 'Small town life'],
        recommendations: [
          'Show academic excellence',
          'Highlight research interests',
          'Demonstrate leadership',
          'Emphasize intellectual curiosity'
        ]
      }
    ];

    universityData.forEach(uni => {
      this.universities.set(uni.id, uni);
    });

    logger.info(`Initialized university database with ${this.universities.size} universities`);
  }

  /**
   * Get all universities
   */
  async getAllUniversities(): Promise<UniversityData[]> {
    return Array.from(this.universities.values());
  }

  /**
   * Get university by ID
   */
  async getUniversityById(id: string): Promise<UniversityData | null> {
    return this.universities.get(id) || null;
  }

  /**
   * Search universities by criteria
   */
  async searchUniversities(criteria: {
    type?: string;
    location?: string;
    maxTuition?: number;
    minKoreanCommunity?: number;
    maxAcceptanceRate?: number;
  }): Promise<UniversityData[]> {
    let results = Array.from(this.universities.values());

    if (criteria.type) {
      results = results.filter(uni => uni.type === criteria.type);
    }

    if (criteria.location) {
      results = results.filter(uni => 
        uni.location.toLowerCase().includes(criteria.location!.toLowerCase())
      );
    }

    if (criteria.maxTuition) {
      results = results.filter(uni => uni.tuition <= criteria.maxTuition!);
    }

    if (criteria.minKoreanCommunity) {
      results = results.filter(uni => uni.culturalFit.koreanCommunity >= criteria.minKoreanCommunity!);
    }

    if (criteria.maxAcceptanceRate) {
      results = results.filter(uni => uni.acceptanceRate <= criteria.maxAcceptanceRate!);
    }

    return results;
  }

  /**
   * Get universities recommended for Korean students
   */
  async getKoreanStudentRecommendations(studentProfile: {
    academicLevel: 'high' | 'medium' | 'low';
    budget: 'high' | 'medium' | 'low';
    locationPreference: 'northeast' | 'west-coast' | 'midwest' | 'south' | 'any';
    majorInterest: string;
  }): Promise<UniversityData[]> {
    let recommendations = Array.from(this.universities.values());

    // Filter by academic level
    if (studentProfile.academicLevel === 'high') {
      recommendations = recommendations.filter(uni => uni.ranking <= 20);
    } else if (studentProfile.academicLevel === 'medium') {
      recommendations = recommendations.filter(uni => uni.ranking <= 50);
    }

    // Filter by budget
    if (studentProfile.budget === 'low') {
      recommendations = recommendations.filter(uni => uni.koreanStudentAid >= 40000);
    } else if (studentProfile.budget === 'medium') {
      recommendations = recommendations.filter(uni => uni.koreanStudentAid >= 30000);
    }

    // Filter by location
    if (studentProfile.locationPreference !== 'any') {
      const locationMap: { [key: string]: string[] } = {
        'northeast': ['Cambridge, MA', 'New Haven, CT', 'Princeton, NJ', 'New York, NY'],
        'west-coast': ['Stanford, CA', 'Berkeley, CA', 'Los Angeles, CA'],
        'midwest': ['Chicago, IL', 'Ann Arbor, MI', 'Madison, WI'],
        'south': ['Atlanta, GA', 'Durham, NC', 'Nashville, TN']
      };
      
      const preferredLocations = locationMap[studentProfile.locationPreference] || [];
      recommendations = recommendations.filter(uni => 
        preferredLocations.some(location => uni.location.includes(location))
      );
    }

    // Sort by Korean student success rate
    recommendations.sort((a, b) => b.koreanStudentSuccessRate - a.koreanStudentSuccessRate);

    return recommendations.slice(0, 10);
  }

  /**
   * Get university comparison data
   */
  async compareUniversities(universityIds: string[]): Promise<{
    universities: UniversityData[];
    comparison: {
      [key: string]: {
        [universityId: string]: number | string;
      };
    };
  }> {
    const universities = universityIds
      .map(id => this.universities.get(id))
      .filter(uni => uni !== undefined) as UniversityData[];

    const comparison = {
      acceptanceRate: {} as { [key: string]: number },
      koreanAcceptanceRate: {} as { [key: string]: number },
      tuition: {} as { [key: string]: number },
      koreanStudentAid: {} as { [key: string]: number },
      koreanCommunity: {} as { [key: string]: number },
      koreanStudentSuccess: {} as { [key: string]: number }
    };

    universities.forEach(uni => {
      comparison.acceptanceRate[uni.id] = uni.acceptanceRate;
      comparison.koreanAcceptanceRate[uni.id] = uni.koreanAcceptanceRate;
      comparison.tuition[uni.id] = uni.tuition;
      comparison.koreanStudentAid[uni.id] = uni.koreanStudentAid;
      comparison.koreanCommunity[uni.id] = uni.culturalFit.koreanCommunity;
      comparison.koreanStudentSuccess[uni.id] = uni.koreanStudentSuccessRate;
    });

    return { universities, comparison };
  }

  /**
   * Get university weather analysis
   */
  async getUniversityWeather(universityId: string): Promise<{
    currentCondition: 'favorable' | 'moderate' | 'challenging';
    trends: string[];
    opportunities: string[];
    risks: string[];
    recommendations: string[];
  }> {
    const university = this.universities.get(universityId);
    if (!university) {
      throw new Error(`University not found: ${universityId}`);
    }

    const currentCondition = university.koreanAcceptanceRate > 4 ? 'favorable' :
                            university.koreanAcceptanceRate > 2 ? 'moderate' : 'challenging';

    const trends = [
      `Korean acceptance rate: ${university.koreanAcceptanceRate}%`,
      `Korean student success rate: ${university.koreanStudentSuccessRate}%`,
      `Financial aid for Korean students: $${university.koreanStudentAid.toLocaleString()}`
    ];

    const opportunities = [
      `Strong Korean community (${university.culturalFit.koreanCommunity}/10)`,
      `High financial aid percentage (${university.financialAidPercentage}%)`,
      `Excellent academic reputation (Rank #${university.ranking})`
    ];

    const risks = [
      `Very competitive (${university.acceptanceRate}% overall acceptance)`,
      `High cost ($${university.totalCost.toLocaleString()} total)`,
      `Cultural adjustment required`
    ];

    const recommendations = university.recommendations;

    return {
      currentCondition,
      trends,
      opportunities,
      risks,
      recommendations
    };
  }
}

// Export singleton instance
export const universityDatabaseService = new UniversityDatabaseService(); 