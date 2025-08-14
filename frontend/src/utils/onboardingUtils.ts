export interface OnboardingData {
  goals?: {
    academicLevel: string;
    targetYear: string;
    academicInterests: string[];
    careerGoals: string[];
    universityPreferences: string[];
    locationPreferences: string[];
  };
  universities?: string[];
  profile?: {
    name: string;
    school: string;
    gpa: string;
    testScores: string;
    extracurriculars: string;
    awards: string;
    languages: string;
  };
}

export const saveOnboardingData = (key: string, data: any): void => {
  try {
    localStorage.setItem(`onboarding-${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save onboarding data:', error);
  }
};

export const loadOnboardingData = (key: string): any => {
  try {
    const data = localStorage.getItem(`onboarding-${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load onboarding data:', error);
    return null;
  }
};

export const clearOnboardingData = (): void => {
  try {
    localStorage.removeItem('onboarding-goals');
    localStorage.removeItem('onboarding-universities');
    localStorage.removeItem('onboarding-profile');
  } catch (error) {
    console.error('Failed to clear onboarding data:', error);
  }
};

export const getOnboardingProgress = (): { currentStep: string; completedSteps: string[] } => {
  const goals = loadOnboardingData('goals');
  const universities = loadOnboardingData('universities');
  const profile = loadOnboardingData('profile');

  const completedSteps: string[] = [];
  if (goals) completedSteps.push('goals');
  if (universities) completedSteps.push('universities');
  if (profile) completedSteps.push('profile');

  let currentStep = 'welcome';
  if (!goals) currentStep = 'goals';
  else if (!universities) currentStep = 'universities';
  else if (!profile) currentStep = 'profile';
  else currentStep = 'complete';

  return { currentStep, completedSteps };
};

export const validateGoals = (goals: any): boolean => {
  return !!(
    goals?.academicLevel &&
    goals?.targetYear &&
    goals?.academicInterests?.length > 0
  );
};

export const validateUniversities = (universities: string[]): boolean => {
  return universities && universities.length > 0;
};

export const validateProfile = (profile: any): boolean => {
  return !!(
    profile?.name &&
    profile?.school &&
    profile?.gpa
  );
}; 