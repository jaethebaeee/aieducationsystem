import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import KoreanText from '../../components/common/KoreanText';

const ParentPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  // Mock data
  const children = [
    { id: '1', name: '김민지', grade: '12th Grade', school: 'Seoul International School' },
    { id: '2', name: '박준호', grade: '11th Grade', school: 'Yongsan International School' }
  ];

  const mockProgress = {
    essays: { completed: 3, total: 5 },
    applications: { completed: 2, total: 8 },
    deadlines: [
      { name: 'Common App Deadline', date: '2024-01-01', status: 'pending' },
      { name: 'UC Application', date: '2024-11-30', status: 'completed' }
    ],
    recentActivity: [
      { type: 'essay', action: 'Essay submitted', date: '2024-01-15' },
      { type: 'application', action: 'Application started', date: '2024-01-14' }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <KoreanText>{t('parent.title')}</KoreanText>
        </h1>
        <p className="text-lg text-gray-600">
          <KoreanText>{t('parent.subtitle')}</KoreanText>
        </p>
      </div>

      {/* Child Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          <KoreanText>Select Child</KoreanText>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((child) => (
            <div
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedChild === child.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900">
                <KoreanText>{child.name}</KoreanText>
              </h3>
              <p className="text-sm text-gray-600">
                <KoreanText>{child.grade} • {child.school}</KoreanText>
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedChild && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <KoreanText>{t('parent.progress')}</KoreanText>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Essays Progress */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    <KoreanText>{t('parent.essays')}</KoreanText>
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      {mockProgress.essays.completed}/{mockProgress.essays.total}
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary-600 rounded-full"
                        style={{ width: `${(mockProgress.essays.completed / mockProgress.essays.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Applications Progress */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    <KoreanText>Applications</KoreanText>
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      {mockProgress.applications.completed}/{mockProgress.applications.total}
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary-600 rounded-full"
                        style={{ width: `${(mockProgress.applications.completed / mockProgress.applications.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <KoreanText>Recent Activity</KoreanText>
              </h3>
              <div className="space-y-3">
                {mockProgress.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full" />
                    <span className="text-sm text-gray-600">
                      <KoreanText>{activity.action}</KoreanText>
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <KoreanText>{t('parent.deadlines')}</KoreanText>
              </h3>
              <div className="space-y-3">
                {mockProgress.deadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        <KoreanText>{deadline.name}</KoreanText>
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(deadline.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      deadline.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <KoreanText>{deadline.status === 'completed' ? 'Completed' : 'Pending'}</KoreanText>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <KoreanText>Quick Actions</KoreanText>
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                  <KoreanText>View All Essays</KoreanText>
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                  <KoreanText>Check Application Status</KoreanText>
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                  <KoreanText>Schedule Meeting</KoreanText>
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                  <KoreanText>Download Progress Report</KoreanText>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedChild && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            <KoreanText>{t('parent.noChildren')}</KoreanText>
          </p>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <KoreanText>{t('parent.linkChild')}</KoreanText>
          </button>
        </div>
      )}
    </div>
  );
};

export default ParentPage; 