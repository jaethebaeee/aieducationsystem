import { logger } from '../utils/logger';

export interface KoreanEducation {
  schoolType: 'public' | 'private' | 'international' | 'foreign';
  curriculum: 'regular' | 'gifted' | 'science' | 'foreign' | 'ib';
  grade: number; // 1-6 for elementary, 1-3 for middle, 1-3 for high
  gpa: number; // Korean GPA (usually 1.0-4.5)
  classRank?: number;
  totalStudents?: number;
  schoolRanking?: number; // School ranking in Korea
}

export interface StandardizedTests {
  sat?: {
    total: number;
    math: number;
    evidenceBasedReading: number;
    essay?: {
      analysis: number;
      writing: number;
    };
  };
  act?: {
    composite: number;
    math: number;
    english: number;
    reading: number;
    science: number;
    writing?: number;
  };
  toefl?: {
    total: number;
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
  };
  ielts?: {
    overall: number;
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
  };
}

export interface AdvancedCourse {
  name: string;
  type: 'ap' | 'ib' | 'dual-enrollment' | 'korean-advanced';
  grade: string; // A, B, C, etc.
  score?: number; // AP score (1-5), IB score (1-7)
  year: number;
}

export interface Activity {
  name: string;
  type: 'academic' | 'leadership' | 'community-service' | 'sports' | 'arts' | 'research' | 'internship' | 'competition';
  role: string;
  hoursPerWeek: number;
  weeksPerYear: number;
  years: number;
  description: string;
  achievements: string[];
  koreanCulturalElement?: boolean;
}

export interface Award {
  name: string;
  type: 'academic' | 'leadership' | 'community-service' | 'sports' | 'arts' | 'research' | 'competition';
  level: 'school' | 'city' | 'province' | 'national' | 'international';
  year: number;
  description: string;
  koreanContext?: string;
}

export interface AcademicProfile {
  id: string;
  userId: string;
  
  // Korean Education
  koreanEducation: KoreanEducation;
  
  // U.S. Equivalents
  convertedGPA: number;
  weightedGPA: number;
  classRank?: number;
  totalStudents?: number;
  
  // Standardized Tests
  standardizedTests: StandardizedTests;
  
  // Advanced Courses
  advancedCourses: AdvancedCourse[];
  
  // Activities & Leadership
  activities: Activity[];
  leadershipRoles: Activity[];
  communityService: Activity[];
  
  // Awards & Recognition
  awards: Award[];
  
  // Research & Internships
  researchExperience: Activity[];
  internships: Activity[];
  
  // Korean Cultural Elements
  koreanCulturalActivities: Activity[];
  
  // Academic Strengths
  academicStrengths: string[];
  areasForImprovement: string[];
  
  // Recommendations
  recommendations: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export class AcademicProfileService {
  
  /**
   * Convert Korean GPA to U.S. equivalent
   */
  convertKoreanGPA(koreanEducation: KoreanEducation): {
    convertedGPA: number;
    weightedGPA: number;
    classRank?: number;
    totalStudents?: number;
  } {
    let convertedGPA = koreanEducation.gpa;
    let weightedGPA = koreanEducation.gpa;
    
    // Korean GPA conversion factors
    const conversionFactors: { [key: string]: number } = {
      'public': 1.0,
      'private': 1.1,
      'international': 1.2,
      'foreign': 1.3
    };
    
    const curriculumFactors: { [key: string]: number } = {
      'regular': 1.0,
      'gifted': 1.15,
      'science': 1.2,
      'foreign': 1.25,
      'ib': 1.3
    };
    
    // Apply conversion factors
    const schoolFactor = conversionFactors[koreanEducation.schoolType] || 1.0;
    const curriculumFactor = curriculumFactors[koreanEducation.curriculum] || 1.0;
    
    convertedGPA = koreanEducation.gpa * schoolFactor;
    weightedGPA = koreanEducation.gpa * schoolFactor * curriculumFactor;
    
    // Cap at 4.0 for converted GPA
    convertedGPA = Math.min(convertedGPA, 4.0);
    weightedGPA = Math.min(weightedGPA, 4.5);
    
    const result: { convertedGPA: number; weightedGPA: number; classRank?: number; totalStudents?: number } = {
      convertedGPA: Math.round(convertedGPA * 100) / 100,
      weightedGPA: Math.round(weightedGPA * 100) / 100,
    };
    if (koreanEducation.classRank !== undefined) {
      result.classRank = koreanEducation.classRank;
    }
    if (koreanEducation.totalStudents !== undefined) {
      result.totalStudents = koreanEducation.totalStudents;
    }
    return result;
  }
  
  /**
   * Calculate academic strength score
   */
  calculateAcademicStrength(profile: AcademicProfile): {
    score: number; // 0-100
    level: 'excellent' | 'strong' | 'good' | 'average' | 'below-average';
    breakdown: {
      gpa: number;
      tests: number;
      courses: number;
      activities: number;
    };
  } {
    let totalScore = 0;
    const breakdown = {
      gpa: 0,
      tests: 0,
      courses: 0,
      activities: 0
    };
    
    // GPA Score (30 points)
    if (profile.convertedGPA >= 3.8) breakdown.gpa = 30;
    else if (profile.convertedGPA >= 3.5) breakdown.gpa = 25;
    else if (profile.convertedGPA >= 3.2) breakdown.gpa = 20;
    else if (profile.convertedGPA >= 3.0) breakdown.gpa = 15;
    else breakdown.gpa = 10;
    
    // Standardized Tests Score (25 points)
    if (profile.standardizedTests.sat) {
      if (profile.standardizedTests.sat.total >= 1500) breakdown.tests = 25;
      else if (profile.standardizedTests.sat.total >= 1400) breakdown.tests = 20;
      else if (profile.standardizedTests.sat.total >= 1300) breakdown.tests = 15;
      else if (profile.standardizedTests.sat.total >= 1200) breakdown.tests = 10;
      else breakdown.tests = 5;
    } else if (profile.standardizedTests.act) {
      if (profile.standardizedTests.act.composite >= 34) breakdown.tests = 25;
      else if (profile.standardizedTests.act.composite >= 30) breakdown.tests = 20;
      else if (profile.standardizedTests.act.composite >= 26) breakdown.tests = 15;
      else if (profile.standardizedTests.act.composite >= 22) breakdown.tests = 10;
      else breakdown.tests = 5;
    }
    
    // Advanced Courses Score (25 points)
    const apCourses = profile.advancedCourses.filter(c => c.type === 'ap');
    const ibCourses = profile.advancedCourses.filter(c => c.type === 'ib');
    const totalAdvanced = apCourses.length + ibCourses.length;
    
    if (totalAdvanced >= 8) breakdown.courses = 25;
    else if (totalAdvanced >= 6) breakdown.courses = 20;
    else if (totalAdvanced >= 4) breakdown.courses = 15;
    else if (totalAdvanced >= 2) breakdown.courses = 10;
    else breakdown.courses = 5;
    
    // Activities Score (20 points)
    const totalActivities = profile.activities.length + profile.leadershipRoles.length;
    const leadershipHours = profile.leadershipRoles.reduce((sum, activity) => 
      sum + (activity.hoursPerWeek * activity.weeksPerYear * activity.years), 0
    );
    
    if (totalActivities >= 8 && leadershipHours >= 200) breakdown.activities = 20;
    else if (totalActivities >= 6 && leadershipHours >= 150) breakdown.activities = 15;
    else if (totalActivities >= 4 && leadershipHours >= 100) breakdown.activities = 10;
    else if (totalActivities >= 2) breakdown.activities = 5;
    else breakdown.activities = 0;
    
    totalScore = breakdown.gpa + breakdown.tests + breakdown.courses + breakdown.activities;
    
    let level: 'excellent' | 'strong' | 'good' | 'average' | 'below-average';
    if (totalScore >= 85) level = 'excellent';
    else if (totalScore >= 70) level = 'strong';
    else if (totalScore >= 55) level = 'good';
    else if (totalScore >= 40) level = 'average';
    else level = 'below-average';
    
    return {
      score: totalScore,
      level,
      breakdown
    };
  }
  
  /**
   * Generate academic recommendations
   */
  generateRecommendations(profile: AcademicProfile): {
    academicStrengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
    universityFit: 'ivy-league' | 'top-20' | 'top-50' | 'top-100' | 'other';
  } {
    const strength = this.calculateAcademicStrength(profile);
    const academicStrengths: string[] = [];
    const areasForImprovement: string[] = [];
    const recommendations: string[] = [];
    
    // Analyze strengths
    if (profile.convertedGPA >= 3.8) {
      academicStrengths.push('Excellent academic performance');
    } else if (profile.convertedGPA >= 3.5) {
      academicStrengths.push('Strong academic record');
    }
    
    if ((profile.standardizedTests.sat?.total ?? 0) >= 1400 || (profile.standardizedTests.act?.composite ?? 0) >= 30) {
      academicStrengths.push('Outstanding standardized test scores');
    }
    
    if (profile.advancedCourses.length >= 6) {
      academicStrengths.push('Strong advanced course load');
    }
    
    if (profile.leadershipRoles.length >= 3) {
      academicStrengths.push('Demonstrated leadership experience');
    }
    
    if (profile.koreanCulturalActivities.length > 0) {
      academicStrengths.push('Unique Korean cultural perspective');
    }
    
    // Identify areas for improvement
    if (profile.convertedGPA < 3.5) {
      areasForImprovement.push('Consider improving GPA through additional coursework');
    }
    
    if (!profile.standardizedTests.sat && !profile.standardizedTests.act) {
      areasForImprovement.push('Take SAT or ACT to strengthen application');
    }
    
    if (profile.advancedCourses.length < 4) {
      areasForImprovement.push('Take more advanced courses (AP, IB, or dual enrollment)');
    }
    
    if (profile.leadershipRoles.length < 2) {
      areasForImprovement.push('Seek leadership opportunities in clubs or organizations');
    }
    
    if (profile.communityService.length < 2) {
      areasForImprovement.push('Increase community service involvement');
    }
    
    // Generate specific recommendations
    if (strength.level === 'excellent') {
      recommendations.push('Focus on highly selective universities (Ivy League, Stanford, MIT)');
      recommendations.push('Emphasize unique Korean cultural background in essays');
      recommendations.push('Highlight leadership and community impact');
    } else if (strength.level === 'strong') {
      recommendations.push('Target top 20-30 universities');
      recommendations.push('Strengthen extracurricular activities');
      recommendations.push('Consider retaking standardized tests for higher scores');
    } else if (strength.level === 'good') {
      recommendations.push('Focus on top 50-100 universities');
      recommendations.push('Improve GPA through additional coursework');
      recommendations.push('Develop stronger leadership experience');
    } else {
      recommendations.push('Consider community colleges or less selective universities');
      recommendations.push('Focus on improving academic performance');
      recommendations.push('Build strong extracurricular profile');
    }
    
    // University fit recommendation
    let universityFit: 'ivy-league' | 'top-20' | 'top-50' | 'top-100' | 'other';
    if (strength.score >= 85) universityFit = 'ivy-league';
    else if (strength.score >= 70) universityFit = 'top-20';
    else if (strength.score >= 55) universityFit = 'top-50';
    else if (strength.score >= 40) universityFit = 'top-100';
    else universityFit = 'other';
    
    return {
      academicStrengths,
      areasForImprovement,
      recommendations,
      universityFit
    };
  }
  
  /**
   * Create academic profile
   * Accepts minimal payloads (at least koreanEducation) and fills sensible defaults.
   */
  async createAcademicProfile(
    userId: string,
    data: { koreanEducation: KoreanEducation } & Partial<Pick<AcademicProfile,
      'standardizedTests' |
      'advancedCourses' |
      'activities' |
      'leadershipRoles' |
      'communityService' |
      'awards' |
      'researchExperience' |
      'internships' |
      'koreanCulturalActivities'
    >>
  ): Promise<AcademicProfile> {
    // Convert Korean GPA
    const conversion = this.convertKoreanGPA(data.koreanEducation);
    
    // Generate recommendations
    const standardizedTests = data.standardizedTests ?? {};
    const advancedCourses = data.advancedCourses ?? [];
    const activities = data.activities ?? [];
    const leadershipRoles = data.leadershipRoles ?? [];
    const communityService = data.communityService ?? [];
    const awards = data.awards ?? [];
    const researchExperience = data.researchExperience ?? [];
    const internships = data.internships ?? [];
    const koreanCulturalActivities = data.koreanCulturalActivities ?? [];

    const recommendations = this.generateRecommendations({
      id: 'temp',
      userId,
      koreanEducation: data.koreanEducation,
      convertedGPA: conversion.convertedGPA,
      weightedGPA: conversion.weightedGPA,
      classRank: conversion.classRank,
      totalStudents: conversion.totalStudents,
      standardizedTests,
      advancedCourses,
      activities,
      leadershipRoles,
      communityService,
      awards,
      researchExperience,
      internships,
      koreanCulturalActivities,
      academicStrengths: [],
      areasForImprovement: [],
      recommendations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    } as AcademicProfile);
    
    const profile: AcademicProfile = {
      id: `profile_${Date.now()}`,
      userId,
      koreanEducation: data.koreanEducation,
      convertedGPA: conversion.convertedGPA,
      weightedGPA: conversion.weightedGPA,
      ...(conversion.classRank !== undefined && { classRank: conversion.classRank }),
      ...(conversion.totalStudents !== undefined && { totalStudents: conversion.totalStudents }),
      standardizedTests,
      advancedCourses,
      activities,
      leadershipRoles,
      communityService,
      awards,
      researchExperience,
      internships,
      koreanCulturalActivities,
      academicStrengths: recommendations.academicStrengths,
      areasForImprovement: recommendations.areasForImprovement,
      recommendations: recommendations.recommendations,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    logger.info(`Created academic profile for user ${userId}`);
    return profile;
  }
  
  /**
   * Update academic profile
   */
  async updateAcademicProfile(profileId: string, _updates: Partial<AcademicProfile>): Promise<AcademicProfile> {
    // This would typically update the database
    // For now, return a mock updated profile
    logger.info(`Updated academic profile ${profileId}`);
    
    return {
      id: profileId,
      userId: 'user_123',
      koreanEducation: {
        schoolType: 'private',
        curriculum: 'science',
        grade: 3,
        gpa: 4.2,
        classRank: 5,
        totalStudents: 300
      },
      convertedGPA: 4.0,
      weightedGPA: 4.3,
      classRank: 5,
      totalStudents: 300,
      standardizedTests: {},
      advancedCourses: [],
      activities: [],
      leadershipRoles: [],
      communityService: [],
      awards: [],
      researchExperience: [],
      internships: [],
      koreanCulturalActivities: [],
      academicStrengths: [],
      areasForImprovement: [],
      recommendations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  /**
   * Get academic profile by user ID
   */
  async getAcademicProfile(_userId: string): Promise<AcademicProfile | null> {
    // This would typically fetch from database
    // For now, return null to indicate no profile exists
    return null;
  }
}

// Export singleton instance
export const academicProfileService = new AcademicProfileService(); 