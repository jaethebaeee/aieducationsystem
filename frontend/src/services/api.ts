import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { 
  User, 
  AuthResponse, 
  VerifyResponse, 
  EssaysResponse, 
  EssayResponse, 
  FeedbackResponse, 
  AnalyticsResponse 
} from '../types';

// Types
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

// API Client Configuration
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        if (error.response?.status === 403) {
          // Subscription required or forbidden
          try { toast.info('Upgrade required to access this feature'); } catch {}
          if (window.location.pathname !== '/pricing') {
            window.location.href = '/pricing';
          }
        }
        
        const message = error.response?.data?.error || error.message || 'An error occurred';
        toast.error(message);
        
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data);
    return response.data;
  }
}

// Create API instance
const api = new ApiClient();

// Export the api instance for direct use
export { api };

// Auth API
export const authAPI = {
  login: (email: string, password: string): Promise<ApiResponse<AuthResponse>> =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    language?: string;
  }): Promise<ApiResponse<AuthResponse>> => api.post<AuthResponse>('/auth/register', userData),

  verify: (): Promise<ApiResponse<VerifyResponse>> => api.get<VerifyResponse>('/auth/verify'),
};

// Essays API
export const essaysAPI = {
  getAll: (): Promise<ApiResponse<EssaysResponse>> => api.get<EssaysResponse>('/essays'),
  getGroupedBySchool: (): Promise<ApiResponse<Array<{ schoolId: string | null; schoolName: string; schoolShortName?: string | null; essays: Array<{ id: string; title: string; status: string; wordCount: number; prompt?: string | null; updatedAt: string }>; totals: { essaysCount: number; totalWords: number; byStatus: Record<string, number> } }>>> =>
    api.get('/essays/grouped/by-school'),
  getStatsSummary: (): Promise<ApiResponse<{ totalEssays: number; totalWords: number; byStatus: Record<string, number> }>> =>
    api.get('/essays/stats/summary'),
  
  getById: (id: string): Promise<ApiResponse<EssayResponse>> => api.get<EssayResponse>(`/essays/${id}`),
  
  getEssay: (id: string): Promise<ApiResponse<EssayResponse>> => api.get<EssayResponse>(`/essays/${id}`),
  
  create: (essayData: {
    title: string;
    content: string;
    type: string;
    targetSchool?: string;
    prompt?: string;
    targetWordLimit?: number;
  }): Promise<ApiResponse<EssayResponse>> => api.post<EssayResponse>('/essays', essayData),
  
  update: (id: string, essayData: {
    title?: string;
    content?: string;
    status?: string;
    targetWordLimit?: number;
  }): Promise<ApiResponse<EssayResponse>> => api.put<EssayResponse>(`/essays/${id}`, essayData),
  updateStatus: (id: string, status: string): Promise<ApiResponse<any>> =>
    api.patch(`/essays/${id}/status`, { status }),
  
  saveEssay: (essayData: Partial<{
    id?: string;
    title: string;
    content: string;
    type: string;
    targetSchool?: string;
    prompt?: string;
    status?: string;
  }>): Promise<ApiResponse<EssayResponse>> => {
    if (essayData.id) {
      return api.put<EssayResponse>(`/essays/${essayData.id}`, essayData);
    } else {
      return api.post<EssayResponse>('/essays', essayData);
    }
  },
  
  delete: (id: string): Promise<ApiResponse<void>> => api.delete<void>(`/essays/${id}`),
};

// Feedback API
export const feedbackAPI = {
  generate: (essayId: string): Promise<ApiResponse<FeedbackResponse>> => 
    api.post<FeedbackResponse>(`/feedback/generate/${essayId}`),
  
  getByEssay: (essayId: string): Promise<ApiResponse<FeedbackResponse>> => 
    api.get<FeedbackResponse>(`/feedback/${essayId}`),
};

// User API
export const userAPI = {
  getProfile: (): Promise<ApiResponse<{ user: User }>> => api.get<{ user: User }>('/users/profile'),
  
  updateProfile: (profileData: {
    firstName?: string;
    lastName?: string;
    language?: string;
  }): Promise<ApiResponse<{ user: User }>> => api.put<{ user: User }>('/users/profile', profileData),
  
  updateAcademic: (academicData: {
    gpa?: number;
    satScore?: number;
    actScore?: number;
    toeflScore?: number;
    ieltsScore?: number;
    schoolName?: string;
    graduationYear?: number;
    targetSchools?: string[];
  }): Promise<ApiResponse<{ user: User }>> => api.put<{ user: User }>('/users/profile/academic', academicData),
  
  addExtracurricular: (activityData: {
    name: string;
    description: string;
    role: string;
    duration: string;
    impact: string;
  }): Promise<ApiResponse<{ user: User }>> => api.post<{ user: User }>('/users/profile/extracurriculars', activityData),
};

// Onboarding API (maps onboarding flow to backend profile route)
export const onboardingAPI = {
  saveProfile: (data: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
    gpa?: number;
    satScore?: number;
    actScore?: number;
    toeflScore?: number;
    ieltsScore?: number;
    schoolName?: string;
    graduationYear?: number;
    // Accept array or JSON string; server stores string
    targetSchools?: any;
    extracurriculars?: Array<{
      name: string;
      description: string;
      role: string;
      duration: string;
      impact: string;
    }>;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    notificationFrequency?: 'daily' | 'weekly' | 'monthly';
    profileVisibility?: 'private' | 'public' | 'friends';
    essaySharing?: boolean;
    analyticsSharing?: boolean;
    essayGoals?: any[];
  }): Promise<ApiResponse<{ user: User }>> => api.put<{ user: User }>('/users/profile', data),
};

// Analysis API
export const analysisAPI = {
  getUniversityInsights: (universityName: string): Promise<ApiResponse<any>> =>
    api.get<any>(`/analysis/university/${encodeURIComponent(universityName)}`),
  getUniversityQuickInfo: (): Promise<ApiResponse<Array<any>>> =>
    api.get<Array<any>>('/analysis/universities/quick-info'),
  getTargetsBriefing: (): Promise<ApiResponse<{ targets: any[]; clusters: Record<string, any>; recommended: { ed: string | null; ea: string | null }; missing: string[] }>> =>
    api.get('/analysis/targets/briefing'),
  
  analyzeEssayForUniversity: (data: {
    essayContent: string;
    universityName: string;
    essayType?: string;
    studentProfile?: any;
  }): Promise<ApiResponse<any>> => api.post<any>('/analysis/essay/university', data),
  
  getUniversities: (): Promise<ApiResponse<string[]>> => api.get<string[]>('/analysis/universities'),
  
  getCulturalTips: (universityName: string): Promise<ApiResponse<any>> =>
    api.get<any>(`/analysis/cultural/${encodeURIComponent(universityName)}`),
  
  getMarketTrends: (params?: {
    universityName?: string;
    program?: string;
  }): Promise<ApiResponse<any>> => api.get<any>('/analysis/market-trends', params),
};

// Resources API
export const resourcesAPI = {
  getAll: (filters?: {
    category?: string;
    type?: string;
    language?: string;
  }): Promise<ApiResponse<{ resources: any[] }>> => api.get<{ resources: any[] }>('/resources', filters),
  
  getById: (id: string): Promise<ApiResponse<{ resource: any }>> => api.get<{ resource: any }>(`/resources/${id}`),
};

// Community API
export const communityAPI = {
  getPosts: (filters?: {
    category?: string;
    authorId?: string;
  }): Promise<ApiResponse<{ posts: any[] }>> => api.get<{ posts: any[] }>('/community/posts', filters),
  
  createPost: (postData: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
  }): Promise<ApiResponse<{ post: any }>> => api.post<{ post: any }>('/community/posts', postData),
  
  addComment: (postId: string, content: string): Promise<ApiResponse<{ comment: any }>> =>
    api.post<{ comment: any }>(`/community/posts/${postId}/comments`, { content }),
};

// Analytics API
export const analyticsAPI = {
  get: (): Promise<ApiResponse<AnalyticsResponse>> => api.get<AnalyticsResponse>('/analytics'),
  
  update: (analyticsData: {
    essaysSubmitted?: number;
    totalFeedback?: number;
    averageScore?: number;
    improvementRate?: number;
    timeSpent?: number;
  }): Promise<ApiResponse<AnalyticsResponse>> => api.put<AnalyticsResponse>('/analytics', analyticsData),
  
  addProgress: (progressData: {
    date: string;
    essaysSubmitted: number;
    averageScore: number;
    timeSpent: number;
  }): Promise<ApiResponse<AnalyticsResponse>> => api.post<AnalyticsResponse>('/analytics/progress', progressData),
};

// Recommendations API
export const recommendationsAPI = {
  getUniversities: (): Promise<ApiResponse<{ recommendations: Array<{ id: string; name: string; website: string; ranking?: number; appPlatform: string; nextDeadline: string | null; requires: string[]; score: number; badges: string[] }> }>> =>
    api.get('/recommendations/universities'),
};

// Universities API (new)
export const universitiesAPI = {
  search: (q: string): Promise<ApiResponse<any[]>> => api.get<any[]>('/universities/search', { q }),
  getCycle: (shortName: string, year: number): Promise<ApiResponse<any>> => api.get<any>(`/universities/${encodeURIComponent(shortName)}/cycles/${year}`),
  getWeather: (shortName: string, year: number): Promise<ApiResponse<{ pressureIndex: number; topSignals: Array<{ label: string; change: string; detail?: string }>; nextDeadline: string | null }>> =>
    api.get(`/universities/${encodeURIComponent(shortName)}/cycles/${year}/weather`),
  getScholarships: (shortName: string, year: number): Promise<ApiResponse<Array<{ id: string; name: string; deadline?: string | null; link?: string; external?: boolean }>>> =>
    api.get(`/universities/${encodeURIComponent(shortName)}/cycles/${year}/scholarships`),
  getPrompts: (shortName: string, year: number): Promise<ApiResponse<Array<{ id: string; promptType: string; program?: string; question: string; minWords?: number; maxWords?: number; required: boolean }>>> =>
    api.get(`/universities/${encodeURIComponent(shortName)}/cycles/${year}/prompts`),
};

// Timeline API (existing backend route)
export const timelineAPI = {
  get: (userId: string): Promise<ApiResponse<{ id: string; tasks: Array<{ id: string; title: string; dueDate: string; completed: boolean; category?: string }> }>> =>
    api.get('/timeline', { userId }),
};

// Plan API
export const planAPI = {
  bootstrap: (payload: {
    targets: Array<{ id?: string; name: string; plan?: string }>;
    profile?: any;
    generate?: { insights?: boolean; essays?: boolean; deadlines?: boolean; resources?: boolean };
    notify?: { alerts?: boolean; parent?: boolean };
  }): Promise<ApiResponse<void>> => api.post<void>('/plan/bootstrap', payload),
};

// Payments / Subscription API
export const paymentsAPI = {
  getSubscription: (): Promise<ApiResponse<any>> => api.get<any>('/payments/subscription'),
  createSubscription: (planId: 'basic' | 'premium' | 'enterprise'): Promise<ApiResponse<any>> =>
    api.post<any>('/payments/create-subscription', { planId }),
  checkAccess: (feature: string): Promise<ApiResponse<{ hasAccess: boolean; plan: string; features: string[] }>> =>
    api.get<{ hasAccess: boolean; plan: string; features: string[] }>(`/payments/check-access/${encodeURIComponent(feature)}`),
};

export default api; 