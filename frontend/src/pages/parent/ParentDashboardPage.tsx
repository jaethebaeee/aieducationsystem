import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  UserGroupIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  GlobeAltIcon,
  BellIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import AccessibleButton from '../../components/common/AccessibleButton';
import ResponsiveContainer from '../../components/layout/ResponsiveContainer';
import ProgressTracker from '../../components/common/ProgressTracker';
import { useAuth } from '../../contexts/AuthContext';

interface Child {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  grade: string;
  targetSchools: string[];
  essaysCount: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'needs-attention';
  progress: number;
  gpa: number;
  satScore?: number;
  actScore?: number;
}

interface Notification {
  id: string;
  type: 'essay' | 'deadline' | 'progress' | 'mentor' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface ParentStats {
  totalChildren: number;
  activeChildren: number;
  upcomingDeadlines: number;
  completedEssays: number;
  averageProgress: number;
  mentorSessions: number;
}

const ParentDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'children' | 'progress' | 'communication' | 'resources'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  const mockChildren: Child[] = [
    {
      id: '1',
      name: '김민수',
      email: 'kim.minsu@email.com',
      grade: '12학년',
      targetSchools: ['Harvard', 'Stanford', 'MIT'],
      essaysCount: 5,
      lastActivity: '2024-01-15T10:30:00Z',
      status: 'active',
      progress: 75,
      gpa: 3.9,
      satScore: 1500
    },
    {
      id: '2',
      name: '김지은',
      email: 'kim.jieun@email.com',
      grade: '11학년',
      targetSchools: ['Yale', 'Princeton'],
      essaysCount: 3,
      lastActivity: '2024-01-14T15:45:00Z',
      status: 'needs-attention',
      progress: 45,
      gpa: 3.7,
      satScore: 1450
    }
  ];

  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'deadline',
      title: 'Harvard 지원 마감일 임박',
      message: '김민수의 Harvard 지원서 제출 마감일이 2일 남았습니다.',
      timestamp: '2024-01-15T08:00:00Z',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'essay',
      title: '새 에세이 피드백 완료',
      message: '김민수의 Personal Statement에 대한 AI 피드백이 준비되었습니다.',
      timestamp: '2024-01-14T16:30:00Z',
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'mentor',
      title: '멘토 상담 예약',
      message: '김지은의 문화적 멘토링 상담이 내일 오후 2시에 예약되었습니다.',
      timestamp: '2024-01-14T12:00:00Z',
      read: true,
      priority: 'low'
    }
  ];

  const mockStats: ParentStats = {
    totalChildren: 2,
    activeChildren: 2,
    upcomingDeadlines: 3,
    completedEssays: 8,
    averageProgress: 60,
    mentorSessions: 5
  };

  // Filter children based on search query
  const filteredChildren = mockChildren.filter(child =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    child.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkNotificationRead = (notificationId: string) => {
    // Mark notification as read
    console.log('Marking notification as read:', notificationId);
  };

  const handleContactMentor = (childId: string) => {
    // Open mentor contact form
    console.log('Contacting mentor for child:', childId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <CalendarIcon className="w-4 h-4" />;
      case 'essay': return <DocumentTextIcon className="w-4 h-4" />;
      case 'progress': return <ChartBarIcon className="w-4 h-4" />;
      case 'mentor': return <AcademicCapIcon className="w-4 h-4" />;
      default: return <BellIcon className="w-4 h-4" />;
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

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 text-korean">
              {t('parent.dashboard.title')}
            </h1>
            <p className="text-gray-600 text-korean mt-1">
              {t('parent.dashboard.subtitle')}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <AccessibleButton variant="outline">
              <BellIcon className="w-4 h-4 mr-2" />
              {t('parent.dashboard.notifications')}
            </AccessibleButton>
            <AccessibleButton>
              <PlusIcon className="w-4 h-4 mr-2" />
              {t('parent.dashboard.addChild')}
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
                  {t('parent.stats.totalChildren')}
                </p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalChildren}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 text-korean">
                  {t('parent.stats.completedEssays')}
                </p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.completedEssays}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 text-korean">
                  {t('parent.stats.upcomingDeadlines')}
                </p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.upcomingDeadlines}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 text-korean">
                  {t('parent.stats.averageProgress')}
                </p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.averageProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: t('parent.tabs.overview'), icon: ChartBarIcon },
                { id: 'children', label: t('parent.tabs.children'), icon: UserGroupIcon },
                { id: 'progress', label: t('parent.tabs.progress'), icon: AcademicCapIcon },
                { id: 'communication', label: t('parent.tabs.communication'), icon: ChatBubbleLeftRightIcon },
                { id: 'resources', label: t('parent.tabs.resources'), icon: GlobeAltIcon }
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
                  placeholder={t('parent.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-korean"
                />
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Notifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                    {t('parent.overview.recentNotifications')}
                  </h3>
                  <div className="space-y-3">
                    {mockNotifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <p className={`font-medium text-gray-900 text-korean ${notification.read ? '' : 'font-semibold'}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 text-korean">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 text-korean">
                              {new Date(notification.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {t(`parent.priority.${notification.priority}`)}
                          </span>
                          {!notification.read && (
                            <AccessibleButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkNotificationRead(notification.id)}
                            >
                              {t('parent.notifications.markRead')}
                            </AccessibleButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                    {t('parent.overview.quickActions')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AccessibleButton variant="outline" fullWidth>
                      <EyeIcon className="w-4 h-4 mr-2" />
                      {t('parent.actions.viewProgress')}
                    </AccessibleButton>
                    <AccessibleButton variant="outline" fullWidth>
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                      {t('parent.actions.contactMentor')}
                    </AccessibleButton>
                    <AccessibleButton variant="outline" fullWidth>
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {t('parent.actions.viewDeadlines')}
                    </AccessibleButton>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'children' && (
              <div className="space-y-4">
                {filteredChildren.map((child) => (
                  <div key={child.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-xl text-korean">
                            {child.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 text-korean">{child.name}</h4>
                          <p className="text-sm text-gray-500 text-korean">{child.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-600 text-korean">{child.grade}</span>
                            <span className="text-sm text-gray-600 text-korean">GPA: {child.gpa}</span>
                            {child.satScore && (
                              <span className="text-sm text-gray-600 text-korean">SAT: {child.satScore}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-900">{child.progress}%</p>
                          <p className="text-sm text-gray-500 text-korean">{t('parent.children.progress')}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <AccessibleButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactMentor(child.id)}
                          >
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                            {t('parent.children.contactMentor')}
                          </AccessibleButton>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 text-korean">{t('parent.children.essays')}:</span>
                        <span className="text-sm font-medium text-gray-900">{child.essaysCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 text-korean">{t('parent.children.status')}:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(child.status)}`}>
                          {t(`parent.children.status.${child.status}`)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 text-korean">{t('parent.children.targetSchools')}:</span>
                        <div className="flex flex-wrap gap-1">
                          {child.targetSchools.map((school, index) => (
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

            {activeTab === 'progress' && (
              <ProgressTracker userId={user?.id || ''} />
            )}

            {activeTab === 'communication' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                    {t('parent.communication.title')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4 text-korean">
                        {t('parent.communication.mentorContact')}
                      </h4>
                      <div className="space-y-3">
                        <AccessibleButton variant="outline" fullWidth>
                          <PhoneIcon className="w-4 h-4 mr-2" />
                          {t('parent.communication.callMentor')}
                        </AccessibleButton>
                        <AccessibleButton variant="outline" fullWidth>
                          <EnvelopeIcon className="w-4 h-4 mr-2" />
                          {t('parent.communication.emailMentor')}
                        </AccessibleButton>
                        <AccessibleButton variant="outline" fullWidth>
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                          {t('parent.communication.chatMentor')}
                        </AccessibleButton>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4 text-korean">
                        {t('parent.communication.childCommunication')}
                      </h4>
                      <div className="space-y-3">
                        <AccessibleButton variant="outline" fullWidth>
                          <EyeIcon className="w-4 h-4 mr-2" />
                          {t('parent.communication.viewProgress')}
                        </AccessibleButton>
                        <AccessibleButton variant="outline" fullWidth>
                          <DocumentTextIcon className="w-4 h-4 mr-2" />
                          {t('parent.communication.viewEssays')}
                        </AccessibleButton>
                        <AccessibleButton variant="outline" fullWidth>
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {t('parent.communication.viewSchedule')}
                        </AccessibleButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                    {t('parent.resources.title')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-2 text-korean">
                        {t('parent.resources.culturalGuide')}
                      </h4>
                      <p className="text-sm text-gray-600 text-korean mb-4">
                        {t('parent.resources.culturalGuideDesc')}
                      </p>
                      <AccessibleButton variant="outline" fullWidth>
                        {t('parent.resources.view')}
                      </AccessibleButton>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-2 text-korean">
                        {t('parent.resources.applicationGuide')}
                      </h4>
                      <p className="text-sm text-gray-600 text-korean mb-4">
                        {t('parent.resources.applicationGuideDesc')}
                      </p>
                      <AccessibleButton variant="outline" fullWidth>
                        {t('parent.resources.view')}
                      </AccessibleButton>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-2 text-korean">
                        {t('parent.resources.financialAid')}
                      </h4>
                      <p className="text-sm text-gray-600 text-korean mb-4">
                        {t('parent.resources.financialAidDesc')}
                      </p>
                      <AccessibleButton variant="outline" fullWidth>
                        {t('parent.resources.view')}
                      </AccessibleButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default ParentDashboardPage; 