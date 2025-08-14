import React from 'react';
import KoreanText from './KoreanText';

interface ProgressItem {
  id: string;
  title: string;
  koreanTitle: string;
  completed: number;
  total: number;
  description: string;
  nextStep?: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  priority: 'high' | 'medium' | 'low';
}

interface ProgressTrackerProps {
  userId: string;
  className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ userId, className = '' }) => {
  // Mock data - in real app, this would come from API
  const progressItems: ProgressItem[] = [
    {
      id: 'storytelling',
      title: 'Cultural Storytelling',
      koreanTitle: '문화적 스토리텔링',
      completed: 3,
      total: 5,
      description: 'Build your personal narrative with cultural insights',
      nextStep: 'Create your 4th story block',
      color: 'blue',
      priority: 'high'
    },
    {
      id: 'timeline',
      title: 'Application Timeline',
      koreanTitle: '지원 일정',
      completed: 8,
      total: 12,
      description: 'Track your application deadlines and tasks',
      nextStep: 'Complete SAT preparation task',
      color: 'green',
      priority: 'high'
    },
    {
      id: 'essays',
      title: 'Essay Development',
      koreanTitle: '에세이 작성',
      completed: 2,
      total: 4,
      description: 'Develop compelling personal statements',
      nextStep: 'Start your 3rd essay draft',
      color: 'purple',
      priority: 'medium'
    },
    {
      id: 'research',
      title: 'University Research',
      koreanTitle: '대학 조사',
      completed: 5,
      total: 8,
      description: 'Research and analyze target universities',
      nextStep: 'Complete Yale University profile',
      color: 'orange',
      priority: 'medium'
    },
    {
      id: 'mentorship',
      title: 'Mentor Sessions',
      koreanTitle: '멘토링 세션',
      completed: 1,
      total: 3,
      description: 'Connect with experienced mentors',
      nextStep: 'Schedule your next session',
      color: 'red',
      priority: 'low'
    }
  ];

  const getColorClasses = (color: ProgressItem['color']) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    };
    return colorMap[color];
  };

  const getPriorityIcon = (priority: ProgressItem['priority']) => {
    const iconMap = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return iconMap[priority];
  };

  const getPriorityText = (priority: ProgressItem['priority']) => {
    const textMap = {
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority'
    };
    return textMap[priority];
  };

  const overallProgress = progressItems.reduce((acc, item) => acc + (item.completed / item.total), 0) / progressItems.length * 100;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            <KoreanText>전체 진행 상황</KoreanText> / Overall Progress
          </h2>
          <p className="text-gray-600 text-sm">Track your application journey</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Individual Progress Items */}
      <div className="space-y-4">
        {progressItems.map((item) => {
          const percentage = (item.completed / item.total) * 100;
          return (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{getPriorityIcon(item.priority)}</span>
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <span className="text-xs text-gray-500">({item.koreanTitle})</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {item.completed} of {item.total} completed
                    </span>
                    <span className="font-medium text-gray-700">{Math.round(percentage)}%</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className={`${getColorClasses(item.color)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Next Step */}
              {item.nextStep && (
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Next:</span> {item.nextStep}
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {getPriorityText(item.priority)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">Quick Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {progressItems
            .filter(item => item.completed < item.total)
            .slice(0, 4)
            .map(item => (
              <button
                key={item.id}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => {
                  // Navigate to the specific feature
                  console.log(`Navigate to ${item.id}`);
                }}
              >
                <div className="font-medium text-sm text-gray-800">{item.title}</div>
                <div className="text-xs text-gray-500">{item.nextStep}</div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 