// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  language: 'ko' | 'en';
  phone?: string;
  avatar?: string;
  profile: UserProfile;
  subscription: Subscription;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'student' | 'parent' | 'mentor' | 'admin';

export interface UserProfile {
  avatar?: string;
  bio?: string;
  targetSchools: string[];
  academicBackground: AcademicBackground;
  preferences: UserPreferences;
}

export interface AcademicBackground {
  gpa: number;
  satScore?: number;
  actScore?: number;
  toeflScore?: number;
  ieltsScore?: number;
  schoolName: string;
  graduationYear: number;
  extracurriculars: Extracurricular[];
}

export interface Extracurricular {
  id: string;
  name: string;
  description: string;
  role: string;
  duration: string;
  impact: string;
}

export interface UserPreferences {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  essayGoals: string[];
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'mentors-only';
  essaySharing: boolean;
  analyticsSharing: boolean;
}

// Essay Types
export interface Essay {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: EssayType;
  targetSchool?: string;
  targetCollege?: string; // Added for compatibility
  prompt?: string;
  wordCount: number;
  targetWordLimit?: number;
  status: EssayStatus;
  feedback: EssayFeedback[];
  versions: EssayVersion[];
  createdAt: string;
  updatedAt: string;
}

export type EssayType = 'personal-statement' | 'supplemental' | 'common-app' | 'scholarship' | 'other';

export type EssayStatus = 'draft' | 'submitted' | 'reviewing' | 'feedback-ready' | 'revised' | 'final';

export interface EssayVersion {
  id: string;
  version: number;
  content: string;
  wordCount: number;
  feedback: EssayFeedback[];
  createdAt: string;
}

// AI Feedback Types
export interface EssayFeedback {
  id: string;
  essayId: string;
  type: FeedbackType;
  category: FeedbackCategory;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  suggestions: string[];
  examples?: string[];
  culturalContext?: string;
  score?: number; // Added for compatibility
  position: {
    start: number;
    end: number;
  };
  createdAt: string;
}

export type FeedbackType = 'grammar' | 'style' | 'content' | 'structure' | 'cultural' | 'clarity';

export type FeedbackCategory = 
  | 'grammar-error'
  | 'style-improvement'
  | 'content-suggestion'
  | 'structure-recommendation'
  | 'cultural-adaptation'
  | 'clarity-enhancement'
  | 'authenticity'
  | 'specificity';

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  features: SubscriptionFeature[];
  paymentMethod?: PaymentMethod;
}

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export interface SubscriptionFeature {
  name: string;
  description: string;
  limit?: number;
  used?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

// Mentor Types
export interface Mentor {
  id: string;
  userId: string;
  profile: MentorProfile;
  availability: Availability[];
  specialties: string[];
  students: string[];
  reviews: MentorReview[];
}

export interface MentorProfile {
  university: string;
  major: string;
  graduationYear: number;
  experience: number;
  bio: string;
  achievements: string[];
  languages: string[];
}

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface MentorReview {
  id: string;
  studentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Community Types
export interface CommunityPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  category: PostCategory;
  tags: string[];
  likes: number;
  comments: CommunityComment[];
  createdAt: string;
  updatedAt: string;
}

export type PostCategory = 'general' | 'essay-help' | 'application-tips' | 'cultural-advice' | 'mentorship' | 'success-stories';

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  likes: number;
  createdAt: string;
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  url: string;
  thumbnail?: string;
  language: 'ko' | 'en' | 'both';
  tags: string[];
  downloads: number;
  rating: number;
  createdAt: string;
}

export type ResourceType = 'guide' | 'sample-essay' | 'video' | 'template' | 'checklist' | 'worksheet';

export type ResourceCategory = 
  | 'personal-statement'
  | 'supplemental-essays'
  | 'common-app'
  | 'scholarship'
  | 'cultural-adaptation'
  | 'general-writing';

// Analytics Types
export interface UserAnalytics {
  userId: string;
  essaysSubmitted: number;
  totalFeedback: number;
  averageScore: number;
  improvementRate: number;
  goals: AnalyticsGoal[];
  progress: ProgressData[];
}

export interface AnalyticsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  status: 'on-track' | 'behind' | 'completed';
}

export interface ProgressData {
  date: string;
  essaysSubmitted: number;
  averageScore: number;
  timeSpent: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Response Types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface VerifyResponse {
  user: User;
}

// Essay Response Types
export interface EssaysResponse {
  essays: Essay[];
}

export interface EssayResponse {
  essay: Essay;
}

export interface FeedbackResponse {
  feedback: EssayFeedback;
}

// Analytics Response Types
export interface AnalyticsResponse {
  analytics: UserAnalytics;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  language: 'ko' | 'en';
  agreeToTerms: boolean;
}

export interface EssayForm {
  title: string;
  content: string;
  type: EssayType;
  targetSchool?: string;
  prompt?: string;
}

export interface FeedbackForm {
  essayId: string;
  feedback: string;
  category: FeedbackCategory;
  severity: 'low' | 'medium' | 'high';
}

// UI Types
export interface UIState {
  language: 'ko' | 'en';
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  createdAt: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  completed: boolean;
}

export interface OnboardingData {
  userId: string;
  currentStep: number;
  steps: OnboardingStep[];
  completed: boolean;
}

export interface SearchFilters {
  query: string;
  category?: string;
  type?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
} 