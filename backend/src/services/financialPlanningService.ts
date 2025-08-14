// import { logger } from '../utils/logger';

export interface FamilyFinancialData {
  // Parent Information
  parentIncome: number;
  parentAssets: number;
  parentAge: number;
  parentRetirementAccounts: number;
  
  // Student Information
  studentIncome: number;
  studentAssets: number;
  studentAge: number;
  
  // Family Information
  familySize: number;
  siblingsInCollege: number;
  otherDependents: number;
  
  // Additional Information
  homeValue: number;
  mortgageBalance: number;
  businessValue: number;
  farmValue: number;
  investmentAccounts: number;
  savingsAccounts: number;
  checkingAccounts: number;
  
  // Korean-Specific Factors
  koreanAssets: number; // Assets in Korea
  koreanIncome: number; // Income from Korean sources
  exchangeRate: number; // USD to KRW exchange rate
}

export interface FinancialAidCalculation {
  // Expected Family Contribution (EFC)
  efc: number;
  efcBreakdown: {
    parentContribution: number;
    studentContribution: number;
    assetContribution: number;
  };
  
  // Financial Need
  totalCost: number;
  financialNeed: number;
  
  // Aid Eligibility
  needBasedAidEligible: boolean;
  meritBasedAidEligible: boolean;
  
  // Estimated Aid
  estimatedNeedBasedAid: number;
  estimatedMeritBasedAid: number;
  estimatedTotalAid: number;
  
  // Net Cost
  netCost: number;
  monthlyPayment: number;
}

export interface Scholarship {
  id: string;
  name: string;
  nameKo: string;
  organization: string;
  amount: number;
  type: 'merit' | 'need' | 'ethnic' | 'major' | 'leadership' | 'community-service';
  eligibility: {
    gpa: number;
    satScore?: number;
    actScore?: number;
    major?: string;
    ethnicity?: string;
    citizenship?: string;
    residency?: string;
  };
  requirements: string[];
  requirementsKo: string[];
  deadline: string;
  applicationUrl: string;
  koreanStudentFriendly: boolean;
  successRate: number; // 0-100
}

export interface Loan {
  id: string;
  name: string;
  type: 'federal' | 'private' | 'parent-plus' | 'international';
  lender: string;
  interestRate: number;
  originationFee: number;
  maxAmount: number;
  repaymentTerm: number; // in years
  gracePeriod: number; // in months
  eligibility: string[];
  pros: string[];
  cons: string[];
  koreanStudentEligible: boolean;
}

export interface PaymentPlan {
  id: string;
  universityId: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'semester';
  numberOfPayments: number;
  paymentAmount: number;
  totalAmount: number;
  interestRate: number;
  enrollmentFee: number;
  lateFee: number;
  description: string;
}

export class FinancialPlanningService {
  
  /**
   * Calculate Expected Family Contribution (EFC)
   */
  calculateEFC(familyData: FamilyFinancialData): FinancialAidCalculation {
    // Simplified EFC calculation based on FAFSA methodology
    // In practice, this would be much more complex
    
    // Parent contribution calculation
    const parentIncomeContribution = Math.max(0, familyData.parentIncome - 25000) * 0.22;
    const parentAssetContribution = Math.max(0, familyData.parentAssets - 50000) * 0.05;
    const parentContribution = parentIncomeContribution + parentAssetContribution;
    
    // Student contribution calculation
    const studentIncomeContribution = Math.max(0, familyData.studentIncome - 7000) * 0.5;
    const studentAssetContribution = familyData.studentAssets * 0.2;
    const studentContribution = studentIncomeContribution + studentAssetContribution;
    
    // Total EFC
    const efc = parentContribution + studentContribution;
    
    // Adjust for family size and siblings in college
    const adjustedEFC = efc / (familyData.familySize + familyData.siblingsInCollege * 0.5);
    
    return {
      efc: Math.round(adjustedEFC),
      efcBreakdown: {
        parentContribution: Math.round(parentContribution),
        studentContribution: Math.round(studentContribution),
        assetContribution: Math.round(parentAssetContribution + studentAssetContribution)
      },
      totalCost: 0, // Will be set by university
      financialNeed: 0, // Will be calculated
      needBasedAidEligible: adjustedEFC < 50000,
      meritBasedAidEligible: true, // Most students are eligible for merit aid
      estimatedNeedBasedAid: 0,
      estimatedMeritBasedAid: 0,
      estimatedTotalAid: 0,
      netCost: 0,
      monthlyPayment: 0
    };
  }
  
  /**
   * Calculate financial need for a specific university
   */
  calculateFinancialNeed(efcCalculation: FinancialAidCalculation, universityCost: number): FinancialAidCalculation {
    const financialNeed = Math.max(0, universityCost - efcCalculation.efc);
    
    // Estimate need-based aid (typically 80-90% of need)
    const estimatedNeedBasedAid = financialNeed * 0.85;
    
    // Estimate merit-based aid (varies by university)
    const estimatedMeritBasedAid = universityCost * 0.15; // 15% average merit aid
    
    const estimatedTotalAid = estimatedNeedBasedAid + estimatedMeritBasedAid;
    const netCost = Math.max(0, universityCost - estimatedTotalAid);
    const monthlyPayment = netCost / 12; // Assuming 12-month payment plan
    
    return {
      ...efcCalculation,
      totalCost: universityCost,
      financialNeed,
      estimatedNeedBasedAid: Math.round(estimatedNeedBasedAid),
      estimatedMeritBasedAid: Math.round(estimatedMeritBasedAid),
      estimatedTotalAid: Math.round(estimatedTotalAid),
      netCost: Math.round(netCost),
      monthlyPayment: Math.round(monthlyPayment)
    };
  }
  
  /**
   * Get scholarships for Korean students
   */
  async getKoreanStudentScholarships(): Promise<Scholarship[]> {
    return [
      {
        id: 'korean-american-foundation',
        name: 'Korean American Foundation Scholarship',
        nameKo: '한국계 미국인 재단 장학금',
        organization: 'Korean American Foundation',
        amount: 5000,
        type: 'ethnic',
        eligibility: {
          gpa: 3.5,
          ethnicity: 'Korean',
          citizenship: 'US Citizen or Permanent Resident'
        },
        requirements: [
          'Korean heritage',
          'Minimum 3.5 GPA',
          'Demonstrated leadership',
          'Community service involvement'
        ],
        requirementsKo: [
          '한국계 혈통',
          '최소 3.5 GPA',
          '리더십 증명',
          '봉사활동 참여'
        ],
        deadline: '2025-03-01',
        applicationUrl: 'https://koreanamericanfoundation.org/scholarships',
        koreanStudentFriendly: true,
        successRate: 25
      },
      {
        id: 'asian-pacific-american-institute',
        name: 'Asian Pacific American Institute Scholarship',
        nameKo: '아시아 태평양계 미국인 연구소 장학금',
        organization: 'Asian Pacific American Institute',
        amount: 3000,
        type: 'ethnic',
        eligibility: {
          gpa: 3.3,
          ethnicity: 'Asian American',
          citizenship: 'US Citizen'
        },
        requirements: [
          'Asian American heritage',
          'Minimum 3.3 GPA',
          'Academic excellence',
          'Community involvement'
        ],
        requirementsKo: [
          '아시아계 미국인 혈통',
          '최소 3.3 GPA',
          '학업 우수성',
          '지역사회 참여'
        ],
        deadline: '2025-02-15',
        applicationUrl: 'https://apa-institute.org/scholarships',
        koreanStudentFriendly: true,
        successRate: 30
      },
      {
        id: 'international-student-scholarship',
        name: 'International Student Excellence Scholarship',
        nameKo: '국제학생 우수 장학금',
        organization: 'International Education Foundation',
        amount: 10000,
        type: 'merit',
        eligibility: {
          gpa: 3.8,
          satScore: 1400,
          citizenship: 'International Student'
        },
        requirements: [
          'International student status',
          'Minimum 3.8 GPA',
          'SAT score 1400+',
          'Strong academic record',
          'Leadership experience'
        ],
        requirementsKo: [
          '국제학생 신분',
          '최소 3.8 GPA',
          'SAT 점수 1400+',
          '우수한 학업 성적',
          '리더십 경험'
        ],
        deadline: '2025-01-15',
        applicationUrl: 'https://ief-scholarships.org',
        koreanStudentFriendly: true,
        successRate: 15
      },
      {
        id: 'stem-scholarship',
        name: 'STEM Excellence Scholarship',
        nameKo: 'STEM 우수 장학금',
        organization: 'National Science Foundation',
        amount: 8000,
        type: 'major',
        eligibility: {
          gpa: 3.7,
          major: 'STEM',
          citizenship: 'US Citizen or Permanent Resident'
        },
        requirements: [
          'STEM major',
          'Minimum 3.7 GPA',
          'Research experience',
          'Innovation projects'
        ],
        requirementsKo: [
          'STEM 전공',
          '최소 3.7 GPA',
          '연구 경험',
          '혁신 프로젝트'
        ],
        deadline: '2025-02-01',
        applicationUrl: 'https://nsf.gov/stem-scholarships',
        koreanStudentFriendly: true,
        successRate: 20
      }
    ];
  }
  
  /**
   * Get loans available for Korean students
   */
  async getKoreanStudentLoans(): Promise<Loan[]> {
    return [
      {
        id: 'federal-direct',
        name: 'Federal Direct Student Loan',
        type: 'federal',
        lender: 'US Department of Education',
        interestRate: 5.5,
        originationFee: 1.057,
        maxAmount: 5500,
        repaymentTerm: 10,
        gracePeriod: 6,
        eligibility: ['US Citizen or Permanent Resident', 'Enrolled at least half-time'],
        pros: ['Low interest rate', 'No credit check', 'Income-driven repayment', 'Loan forgiveness options'],
        cons: ['Limited amounts', 'Must be US citizen/permanent resident'],
        koreanStudentEligible: false // International students not eligible
      },
      {
        id: 'private-international',
        name: 'International Student Private Loan',
        type: 'private',
        lender: 'Sallie Mae',
        interestRate: 8.5,
        originationFee: 4,
        maxAmount: 50000,
        repaymentTerm: 15,
        gracePeriod: 6,
        eligibility: ['International student', 'US cosigner required', 'Good credit history'],
        pros: ['Available to international students', 'Higher loan amounts', 'Flexible terms'],
        cons: ['Higher interest rate', 'Requires US cosigner', 'Credit check required'],
        koreanStudentEligible: true
      },
      {
        id: 'korean-bank-loan',
        name: 'Korean Bank Education Loan',
        type: 'private',
        lender: 'Shinhan Bank',
        interestRate: 6.5,
        originationFee: 2,
        maxAmount: 100000,
        repaymentTerm: 10,
        gracePeriod: 12,
        eligibility: ['Korean citizen', 'Admitted to US university', 'Korean cosigner'],
        pros: ['Lower interest rate', 'No US cosigner needed', 'Higher amounts', 'Korean language support'],
        cons: ['Must be Korean citizen', 'Korean cosigner required', 'Currency risk'],
        koreanStudentEligible: true
      }
    ];
  }
  
  /**
   * Get payment plans for universities
   */
  async getUniversityPaymentPlans(universityId: string): Promise<PaymentPlan[]> {
    // Mock payment plans - in practice, this would come from university data
    return [
      {
        id: 'monthly-plan',
        universityId,
        name: 'Monthly Payment Plan',
        type: 'monthly',
        numberOfPayments: 10,
        paymentAmount: 7500,
        totalAmount: 75000,
        interestRate: 0,
        enrollmentFee: 50,
        lateFee: 25,
        description: 'Pay tuition in 10 monthly installments with no interest'
      },
      {
        id: 'semester-plan',
        universityId,
        name: 'Semester Payment Plan',
        type: 'semester',
        numberOfPayments: 2,
        paymentAmount: 37500,
        totalAmount: 75000,
        interestRate: 0,
        enrollmentFee: 25,
        lateFee: 50,
        description: 'Pay tuition in 2 semester installments'
      }
    ];
  }
  
  /**
   * Calculate loan repayment
   */
  calculateLoanRepayment(loanAmount: number, interestRate: number, termYears: number): {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    amortizationSchedule: {
      month: number;
      payment: number;
      principal: number;
      interest: number;
      remainingBalance: number;
    }[];
  } {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = termYears * 12;
    
    // Calculate monthly payment using amortization formula
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    // Generate amortization schedule
    const amortizationSchedule = [];
    let remainingBalance = loanAmount;
    
    for (let month = 1; month <= numberOfPayments; month++) {
      const interest = remainingBalance * monthlyRate;
      const principal = monthlyPayment - interest;
      remainingBalance -= principal;
      
      amortizationSchedule.push({
        month,
        payment: Math.round(monthlyPayment * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        remainingBalance: Math.max(0, Math.round(remainingBalance * 100) / 100)
      });
    }
    
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      amortizationSchedule
    };
  }
  
  /**
   * Get FAFSA application guidance
   */
  getFAFSAGuidance(): {
    steps: string[];
    requirements: string[];
    tips: string[];
    commonMistakes: string[];
    koreanStudentTips: string[];
  } {
    return {
      steps: [
        'Create FSA ID for student and parent',
        'Gather required documents (tax returns, W-2s, bank statements)',
        'Complete FAFSA form online at fafsa.gov',
        'Add colleges to receive FAFSA information',
        'Review Student Aid Report (SAR)',
        'Make corrections if needed',
        'Submit by deadline (October 1 for following academic year)'
      ],
      requirements: [
        'US Citizen or Permanent Resident',
        'Valid Social Security Number',
        'High school diploma or GED',
        'Enrollment in eligible degree program',
        'Satisfactory academic progress',
        'No defaulted federal student loans'
      ],
      tips: [
        'Submit FAFSA as early as possible',
        'Use IRS Data Retrieval Tool for accuracy',
        'Include all colleges you\'re considering',
        'Keep copies of all documents',
        'Update information if circumstances change'
      ],
      commonMistakes: [
        'Missing deadline',
        'Incorrect income information',
        'Not including all colleges',
        'Forgetting to sign electronically',
        'Not reporting all income sources'
      ],
      koreanStudentTips: [
        'Ensure all Korean income is converted to USD',
        'Report all Korean assets and investments',
        'Include Korean bank accounts and properties',
        'Consider exchange rate fluctuations',
        'Document all income sources thoroughly'
      ]
    };
  }
  
  /**
   * Get CSS Profile guidance
   */
  getCSSProfileGuidance(): {
    steps: string[];
    requirements: string[];
    tips: string[];
    differencesFromFAFSA: string[];
  } {
    return {
      steps: [
        'Create College Board account',
        'Complete CSS Profile online',
        'Add colleges that require CSS Profile',
        'Submit by college-specific deadlines',
        'Provide additional documentation if requested',
        'Review Institutional Student Information Report (ISIR)'
      ],
      requirements: [
        'Required by many private colleges',
        'More detailed financial information',
        'Non-custodial parent information',
        'Business and farm information',
        'Home equity information'
      ],
      tips: [
        'Submit early - deadlines vary by college',
        'Be prepared for detailed questions',
        'Have all financial documents ready',
        'Include non-custodial parent if applicable',
        'Be honest and accurate'
      ],
      differencesFromFAFSA: [
        'More detailed financial analysis',
        'Includes home equity in calculations',
        'Considers non-custodial parent income',
        'Different asset protection allowances',
        'College-specific questions and requirements'
      ]
    };
  }
}

// Export singleton instance
export const financialPlanningService = new FinancialPlanningService(); 