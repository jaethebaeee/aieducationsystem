import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import AccessibleButton from '../../components/common/AccessibleButton';
import ResponsiveContainer from '../../components/layout/ResponsiveContainer';
import CulturalAdaptationGuide from '../../components/common/CulturalAdaptationGuide';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  targetSchools: string[];
  essaysCount: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'needs-attention';
  progress: number;
}

interface FeedbackRequest {
  id: string;
  studentId: string;
  studentName: string;
  essayTitle: string;
  essayType: string;
  requestedAt: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

interface MentorStats {
  totalStudents: number;
  activeStudents: number;
  pendingFeedback: number;
  completedSessions: number;
  averageRating: number;
  totalHours: number;
}

const MentorDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'feedback' | 'cultural'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  const mockStudents: Student[] = [
    {
      id: '1',
      name: '김민수',
      email: 'kim.minsu@email.com',
      targetSchools: ['Harvard', 'Stanford', 'MIT'],
      essaysCount: 5,
      lastActivity: '2024-01-15T10:30:00Z',
      status: 'active',
      progress: 75
    },
    {
      id: '2',
      name: '이지은',
      email: 'lee.jieun@email.com',
      targetSchools: ['Yale', 'Princeton'],
      essaysCount: 3,
      lastActivity: '2024-01-14T15:45:00Z',
      status: 'needs-attention',
      progress: 45
    },
    {
      id: '3',
      name: '박준호',
      email: 'park.junho@email.com',
      targetSchools: ['Columbia', 'UPenn'],
      essaysCount: 7,
      lastActivity: '2024-01-15T09:15:00Z',
      status: 'active',
      progress: 90
    }
  ];

  const mockFeedbackRequests: FeedbackRequest[] = [
    {
      id: '1',
      studentId: '1',
      studentName: '김민수',
      essayTitle: 'Personal Statement - Cultural Identity',
      essayType: 'personal-statement',
      requestedAt: '2024-01-15T08:00:00Z',
      priority: 'high',
      status: 'pending'
    },
    {
      id: '2',
      studentId: '2',
      studentName: '이지은',
      essayTitle: 'Why Yale Supplement',
      essayType: 'supplemental',
      requestedAt: '2024-01-14T16:30:00Z',
      priority: 'medium',
      status: 'in-progress'
    }
  ];

  const mockStats: MentorStats = {
    totalStudents: 12,
    activeStudents: 8,
    pendingFeedback: 5,
    completedSessions: 45,
    averageRating: 4.8,
    totalHours: 120
  };

  // Filter students based on search query
  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter feedback requests
  const filteredFeedbackRequests = mockFeedbackRequests.filter(request =>
    request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.essayTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartFeedback = (requestId: string) => {
    // Navigate to feedback workspace
    console.log('Starting feedback for request:', requestId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'in-progress': return <DocumentTextIcon className="w-4 h-4" />;
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 text-korean">
              {t('mentor.dashboard.title')}
            </h1>
            <p className="text-gray-600 text-korean mt-1">
              {t('mentor.dashboard.subtitle')}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <AccessibleButton variant="outline">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {t('mentor.dashboard.schedule')}
            </AccessibleButton>
            <AccessibleButton>
              <PlusIcon className="w-4 h-4 mr-2" />
              {t('mentor.dashboard.newSession')}
            </AccessibleButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 text-korean">
                  {t('mentor.stats.totalStudents')}
                </p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 text-korean">
                  {t('mentor.stats.pendingFeedback')}
                </p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.pendingFeedback}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 text-korean">
                  {t('mentor.stats.averageRating')}
                </p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 text-korean">
                  {t('mentor.stats.totalHours')}
                </p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalHours}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: t('mentor.tabs.overview'), icon: ChartBarIcon },
                { id: 'students', label: t('mentor.tabs.students'), icon: UserGroupIcon },
                { id: 'feedback', label: t('mentor.tabs.feedback'), icon: ChatBubbleLeftRightIcon },
                { id: 'cultural', label: t('mentor.tabs.cultural'), icon: GlobeAltIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-korean">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('mentor.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-korean"
                />
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                    {t('mentor.overview.recentActivity')}
                  </h3>
                  <div className="space-y-3">
                    {mockFeedbackRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-korean">
                              {request.studentName} - {request.essayTitle}
                            </p>
                            <p className="text-sm text-gray-500 text-korean">
                              {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {t(`mentor.priority.${request.priority}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                    {t('mentor.overview.quickActions')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AccessibleButton variant="outline" fullWidth>
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                      {t('mentor.actions.reviewFeedback')}
                    </AccessibleButton>
                    <AccessibleButton variant="outline" fullWidth>
                      <UserGroupIcon className="w-4 h-4 mr-2" />
                      {t('mentor.actions.viewStudents')}
                    </AccessibleButton>
                    <AccessibleButton variant="outline" fullWidth>
                      <GlobeAltIcon className="w-4 h-4 mr-2" />
                      {t('mentor.actions.culturalGuide')}
                    </AccessibleButton>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-korean">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-korean">{student.name}</h4>
                          <p className="text-sm text-gray-500 text-korean">{student.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500 text-korean">
                              {t('mentor.students.essays')}: {student.essaysCount}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                              {t(`mentor.students.status.${student.status}`)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{student.progress}%</p>
                          <p className="text-xs text-gray-500 text-korean">{t('mentor.students.progress')}</p>
                        </div>
                        <AccessibleButton variant="outline" size="sm">
                          {t('mentor.students.view')}
                        </AccessibleButton>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 text-korean">{t('mentor.students.targetSchools')}:</span>
                        <div className="flex flex-wrap gap-1">
                          {student.targetSchools.map((school, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 text-korean">
                              {school}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-4">
                {filteredFeedbackRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getStatusIcon(request.status)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-korean">
                            {request.studentName} - {request.essayTitle}
                          </h4>
                          <p className="text-sm text-gray-500 text-korean">
                            {t('mentor.feedback.requested')}: {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                              {t(`mentor.priority.${request.priority}`)}
                            </span>
                            <span className="text-xs text-gray-500 text-korean">
                              {t(`mentor.feedback.status.${request.status}`)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {request.status === 'pending' && (
                          <AccessibleButton
                            onClick={() => handleStartFeedback(request.id)}
                            size="sm"
                          >
                            {t('mentor.feedback.start')}
                          </AccessibleButton>
                        )}
                        {request.status === 'in-progress' && (
                          <AccessibleButton
                            variant="outline"
                            size="sm"
                          >
                            {t('mentor.feedback.continue')}
                          </AccessibleButton>
                        )}
                        {request.status === 'completed' && (
                          <AccessibleButton
                            variant="outline"
                            size="sm"
                          >
                            {t('mentor.feedback.view')}
                          </AccessibleButton>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'cultural' && (
              <CulturalAdaptationGuide />
            )}
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default MentorDashboardPage; 