import React, { useState } from 'react';

interface EssayProgress {
  id: string;
  title: string;
  targetCollege: string;
  status: 'draft' | 'feedback_received' | 'completed';
  lastUpdated: Date;
  grammarScore?: number;
  contentScore?: number;
  storylineScore?: number;
  collegeFitScore?: number;
  overallScore?: number;
}

interface Child {
  id: string;
  name: string;
  grade: string;
  targetColleges: string[];
  essaysCompleted: number;
  totalEssays: number;
  averageScore: number;
}

const ParentalDashboardPage: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState('1');
  const [timeRange, setTimeRange] = useState('30');

  const children: Child[] = [
    {
      id: '1',
      name: 'Ji-Hoon Kim',
      grade: '12th Grade',
      targetColleges: ['Harvard University', 'Stanford University', 'MIT'],
      essaysCompleted: 3,
      totalEssays: 5,
      averageScore: 82
    },
    {
      id: '2',
      name: 'Min-Ji Park',
      grade: '11th Grade',
      targetColleges: ['Yale University', 'Columbia University'],
      essaysCompleted: 1,
      totalEssays: 3,
      averageScore: 78
    }
  ];

  const essayProgress: EssayProgress[] = [
    {
      id: '1',
      title: 'Personal Statement - Harvard',
      targetCollege: 'Harvard University',
      status: 'completed',
      lastUpdated: new Date('2024-01-15'),
      grammarScore: 88,
      contentScore: 85,
      storylineScore: 90,
      collegeFitScore: 92,
      overallScore: 89
    },
    {
      id: '2',
      title: 'Stanford Supplemental Essay',
      targetCollege: 'Stanford University',
      status: 'feedback_received',
      lastUpdated: new Date('2024-01-12'),
      grammarScore: 82,
      contentScore: 78,
      storylineScore: 85,
      collegeFitScore: 80,
      overallScore: 81
    },
    {
      id: '3',
      title: 'MIT Engineering Essay',
      targetCollege: 'MIT',
      status: 'draft',
      lastUpdated: new Date('2024-01-10')
    },
    {
      id: '4',
      title: 'Common App Personal Statement',
      targetCollege: 'Multiple',
      status: 'completed',
      lastUpdated: new Date('2024-01-08'),
      grammarScore: 90,
      contentScore: 87,
      storylineScore: 88,
      collegeFitScore: 85,
      overallScore: 88
    }
  ];

  const currentChild = children.find(child => child.id === selectedChild);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'feedback_received':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressPercentage = () => {
    if (!currentChild) return 0;
    return (currentChild.essaysCompleted / currentChild.totalEssays) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Dashboard</h1>
          <p className="text-gray-600">Monitor your child's college essay progress and achievements</p>
        </div>

        {/* Child Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name} - {child.grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {currentChild && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Essays Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentChild.essaysCompleted}/{currentChild.totalEssays}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{currentChild.averageScore}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Target Colleges</p>
                    <p className="text-2xl font-bold text-gray-900">{currentChild.targetColleges.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(getProgressPercentage())}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Overall Progress</h3>
                <span className="text-sm text-gray-600">
                  {currentChild.essaysCompleted} of {currentChild.totalEssays} essays completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            {/* Essay Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Essay Timeline</h3>
              <div className="space-y-4">
                {essayProgress.map((essay, index) => (
                  <div key={essay.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    {/* Timeline Dot */}
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        essay.status === 'completed' ? 'bg-green-500' :
                        essay.status === 'feedback_received' ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`}></div>
                      {index < essayProgress.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mx-auto mt-1"></div>
                      )}
                    </div>

                    {/* Essay Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{essay.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(essay.status)}`}>
                          {essay.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{essay.targetCollege}</p>
                      <p className="text-xs text-gray-500">
                        Last updated: {essay.lastUpdated.toLocaleDateString()}
                      </p>

                      {/* Scores */}
                      {essay.overallScore && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Overall</p>
                            <p className={`text-sm font-bold ${getScoreColor(essay.overallScore)}`}>
                              {essay.overallScore}%
                            </p>
                          </div>
                          {essay.grammarScore && (
                            <div className="text-center">
                              <p className="text-xs text-gray-600">Grammar</p>
                              <p className={`text-sm font-bold ${getScoreColor(essay.grammarScore)}`}>
                                {essay.grammarScore}%
                              </p>
                            </div>
                          )}
                          {essay.contentScore && (
                            <div className="text-center">
                              <p className="text-xs text-gray-600">Content</p>
                              <p className={`text-sm font-bold ${getScoreColor(essay.contentScore)}`}>
                                {essay.contentScore}%
                              </p>
                            </div>
                          )}
                          {essay.storylineScore && (
                            <div className="text-center">
                              <p className="text-xs text-gray-600">Storyline</p>
                              <p className={`text-sm font-bold ${getScoreColor(essay.storylineScore)}`}>
                                {essay.storylineScore}%
                              </p>
                            </div>
                          )}
                          {essay.collegeFitScore && (
                            <div className="text-center">
                              <p className="text-xs text-gray-600">College Fit</p>
                              <p className={`text-sm font-bold ${getScoreColor(essay.collegeFitScore)}`}>
                                {essay.collegeFitScore}%
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Colleges */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Target Colleges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentChild.targetColleges.map((college) => (
                  <div key={college} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{college}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Application Status</span>
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                        In Progress
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentalDashboardPage; 