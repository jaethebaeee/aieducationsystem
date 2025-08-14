import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  AcademicCapIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import AccessibleButton from '../../components/common/AccessibleButton';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  applications: {
    total: number;
    submitted: number;
    inProgress: number;
    accepted: number;
    rejected: number;
    waitlisted: number;
    overallProgress: number;
  };
  universities: {
    researched: number;
    shortlisted: number;
    applied: number;
  };
  essays: {
    total: number;
    completed: number;
    inProgress: number;
    averageScore: number;
  };
  financial: {
    totalCost: number;
    estimatedAid: number;
    netCost: number;
    scholarshipsApplied: number;
  };
}

interface UpcomingDeadline {
  applicationId: string;
  universityName: string;
  deadline: string;
  daysRemaining: number;
  applicationType: string;
  status: string;
}

const translations = {
  en: {
    title: 'Application Dashboard',
    subtitle: 'Track your complete U.S. university application journey',
    
    // Stats Cards
    stats: {
      applications: 'Applications',
      universities: 'Universities',
      essays: 'Essays',
      financial: 'Financial Aid',
      progress: 'Progress',
      submitted: 'Submitted',
      inProgress: 'In Progress',
      accepted: 'Accepted',
      rejected: 'Rejected',
      waitlisted: 'Waitlisted',
      researched: 'Researched',
      shortlisted: 'Shortlisted',
      applied: 'Applied',
      completed: 'Completed',
      averageScore: 'Avg Score',
      totalCost: 'Total Cost',
      estimatedAid: 'Est. Aid',
      netCost: 'Net Cost',
      scholarshipsApplied: 'Scholarships'
    },

    // Quick Actions
    quickActions: {
      title: 'Quick Actions',
      researchUniversities: 'Research Universities',
      createApplication: 'Create Application',
      writeEssay: 'Write Essay',
      calculateFinancialAid: 'Calculate Financial Aid',
      uploadDocuments: 'Upload Documents',
      checkDeadlines: 'Check Deadlines'
    },

    // Sections
    sections: {
      upcomingDeadlines: 'Upcoming Deadlines',
      recentActivity: 'Recent Activity',
      recommendations: 'Recommendations',
      universityWeather: 'University Weather',
      financialSummary: 'Financial Summary'
    },

    // Navigation
    navigation: {
      overview: 'Overview',
      universities: 'Universities',
      applications: 'Applications',
      essays: 'Essays',
      financial: 'Financial',
      documents: 'Documents',
      timeline: 'Timeline'
    }
  },
  ko: {
    title: '지원서 대시보드',
    subtitle: '미국 대학 지원 과정을 완전히 추적하세요',
    
    // Stats Cards
    stats: {
      applications: '지원서',
      universities: '대학',
      essays: '에세이',
      financial: '장학금',
      progress: '진행률',
      submitted: '제출됨',
      inProgress: '진행 중',
      accepted: '합격',
      rejected: '불합격',
      waitlisted: '대기',
      researched: '조사됨',
      shortlisted: '후보',
      applied: '지원됨',
      completed: '완료',
      averageScore: '평균 점수',
      totalCost: '총 비용',
      estimatedAid: '예상 장학금',
      netCost: '순 비용',
      scholarshipsApplied: '장학금'
    },

    // Quick Actions
    quickActions: {
      title: '빠른 작업',
      researchUniversities: '대학 조사',
      createApplication: '지원서 작성',
      writeEssay: '에세이 작성',
      calculateFinancialAid: '장학금 계산',
      uploadDocuments: '서류 업로드',
      checkDeadlines: '마감일 확인'
    },

    // Sections
    sections: {
      upcomingDeadlines: '다가오는 마감일',
      recentActivity: '최근 활동',
      recommendations: '추천사항',
      universityWeather: '대학 날씨',
      financialSummary: '재정 요약'
    },

    // Navigation
    navigation: {
      overview: '개요',
      universities: '대학',
      applications: '지원서',
      essays: '에세이',
      financial: '재정',
      documents: '서류',
      timeline: '타임라인'
    }
  }
};

const ComprehensiveDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [stats, setStats] = useState<DashboardStats>({
    applications: {
      total: 0,
      submitted: 0,
      inProgress: 0,
      accepted: 0,
      rejected: 0,
      waitlisted: 0,
      overallProgress: 0
    },
    universities: {
      researched: 0,
      shortlisted: 0,
      applied: 0
    },
    essays: {
      total: 0,
      completed: 0,
      inProgress: 0,
      averageScore: 0
    },
    financial: {
      totalCost: 0,
      estimatedAid: 0,
      netCost: 0,
      scholarshipsApplied: 0
    }
  });

  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      setStats({
        applications: {
          total: 8,
          submitted: 3,
          inProgress: 4,
          accepted: 1,
          rejected: 0,
          waitlisted: 0,
          overallProgress: 45
        },
        universities: {
          researched: 25,
          shortlisted: 12,
          applied: 8
        },
        essays: {
          total: 15,
          completed: 8,
          inProgress: 7,
          averageScore: 85
        },
        financial: {
          totalCost: 320000,
          estimatedAid: 180000,
          netCost: 140000,
          scholarshipsApplied: 12
        }
      });

      setUpcomingDeadlines([
        {
          applicationId: 'app_1',
          universityName: 'Harvard University',
          deadline: '2025-01-01',
          daysRemaining: 15,
          applicationType: 'regular-decision',
          status: 'in-progress'
        },
        {
          applicationId: 'app_2',
          universityName: 'Stanford University',
          deadline: '2025-01-02',
          daysRemaining: 16,
          applicationType: 'regular-decision',
          status: 'not-started'
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    color: string;
    trend?: {
      value: number;
      direction: 'up' | 'down' | 'stable';
    };
  }> = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <ArrowTrendingUpIcon 
                className={`w-4 h-4 ${
                  trend.direction === 'up' ? 'text-green-500' : 
                  trend.direction === 'down' ? 'text-red-500' : 'text-gray-500'
                }`} 
              />
              <span className={`text-sm ml-1 ${
                trend.direction === 'up' ? 'text-green-600' : 
                trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionButton: React.FC<{
    title: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    color: string;
  }> = ({ title, icon: Icon, onClick, color }) => (
    <Button
      onClick={onClick}
      variant="outline"
      className={`flex items-center space-x-3 p-4 ${color}`}
    >
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">{title}</span>
    </Button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/settings')}>Settings</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t.stats.applications}
            value={`${stats.applications.submitted}/${stats.applications.total}`}
            subtitle={`${stats.applications.overallProgress}% complete`}
            icon={DocumentTextIcon}
            color="bg-blue-500"
            trend={{ value: 12, direction: 'up' }}
          />
          <StatCard
            title={t.stats.universities}
            value={stats.universities.applied}
            subtitle={`${stats.universities.shortlisted} shortlisted`}
            icon={BuildingLibraryIcon}
            color="bg-green-500"
          />
          <StatCard
            title={t.stats.essays}
            value={`${stats.essays.completed}/${stats.essays.total}`}
            subtitle={`${stats.essays.averageScore}% avg score`}
            icon={AcademicCapIcon}
            color="bg-purple-500"
          />
          <StatCard
            title={t.stats.financial}
            value={`$${(stats.financial.netCost / 1000).toFixed(0)}k`}
            subtitle={`$${(stats.financial.estimatedAid / 1000).toFixed(0)}k aid`}
            icon={CurrencyDollarIcon}
            color="bg-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.quickActions.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <QuickActionButton
                  title={t.quickActions.researchUniversities}
                  icon={GlobeAltIcon}
                  onClick={() => {/* Navigate to university research */}}
                  color="hover:bg-blue-50"
                />
                <QuickActionButton
                  title={t.quickActions.createApplication}
                  icon={DocumentTextIcon}
                  onClick={() => {/* Navigate to application creation */}}
                  color="hover:bg-green-50"
                />
                <QuickActionButton
                  title={t.quickActions.writeEssay}
                  icon={AcademicCapIcon}
                  onClick={() => {/* Navigate to essay editor */}}
                  color="hover:bg-purple-50"
                />
                <QuickActionButton
                  title={t.quickActions.calculateFinancialAid}
                  icon={CalculatorIcon}
                  onClick={() => {/* Navigate to financial planning */}}
                  color="hover:bg-yellow-50"
                />
                <QuickActionButton
                  title={t.quickActions.uploadDocuments}
                  icon={DocumentTextIcon}
                  onClick={() => {/* Navigate to document upload */}}
                  color="hover:bg-indigo-50"
                />
                <QuickActionButton
                  title={t.quickActions.checkDeadlines}
                  icon={ClockIcon}
                  onClick={() => {/* Navigate to timeline */}}
                  color="hover:bg-red-50"
                />
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.sections.upcomingDeadlines}</h2>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.applicationId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        deadline.daysRemaining <= 7 ? 'bg-red-100' : 
                        deadline.daysRemaining <= 14 ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <ClockIcon className={`w-5 h-5 ${
                          deadline.daysRemaining <= 7 ? 'text-red-600' : 
                          deadline.daysRemaining <= 14 ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{deadline.universityName}</h3>
                        <p className="text-sm text-gray-500">
                          {deadline.applicationType} • {deadline.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {deadline.daysRemaining} days
                      </p>
                      <p className="text-xs text-gray-500">{deadline.deadline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.sections.recentActivity}</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Essay submitted to Harvard</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Stanford deadline approaching</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Financial aid application completed</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Application Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span>{stats.applications.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.applications.overallProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Submitted</p>
                    <p className="font-semibold text-green-600">{stats.applications.submitted}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">In Progress</p>
                    <p className="font-semibold text-blue-600">{stats.applications.inProgress}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Accepted</p>
                    <p className="font-semibold text-green-600">{stats.applications.accepted}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Waitlisted</p>
                    <p className="font-semibold text-yellow-600">{stats.applications.waitlisted}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.sections.financialSummary}</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost</span>
                  <span className="font-semibold">${(stats.financial.totalCost / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Aid</span>
                  <span className="font-semibold text-green-600">${(stats.financial.estimatedAid / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Cost</span>
                  <span className="font-semibold">${(stats.financial.netCost / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scholarships Applied</span>
                  <span className="font-semibold">{stats.financial.scholarshipsApplied}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.sections.recommendations}</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Complete Stanford application by Dec 15</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Submit FAFSA application</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Apply for 3 more scholarships</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">Schedule interview preparation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveDashboard; 