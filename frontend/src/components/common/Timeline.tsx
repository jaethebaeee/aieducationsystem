import React, { useState } from 'react';
import KoreanText from './KoreanText';

export interface TimelineTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'essay' | 'test' | 'recommendation' | 'financial' | 'research' | 'application';
  university?: string;
  estimatedHours?: number;
  tags?: string[];
}

interface TimelineProps {
  tasks: TimelineTask[];
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onTaskEdit: (task: TimelineTask) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskAdd: (task: Omit<TimelineTask, 'id'>) => void;
  loading?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
  tasks,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  onTaskAdd,
  loading = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'category'>('dueDate');

  const categories = [
    { id: 'all', name: 'All Tasks', korean: '모든 작업', color: 'gray' },
    { id: 'essay', name: 'Essays', korean: '에세이', color: 'blue' },
    { id: 'test', name: 'Tests', korean: '시험', color: 'green' },
    { id: 'recommendation', name: 'Recommendations', korean: '추천서', color: 'purple' },
    { id: 'financial', name: 'Financial Aid', korean: '장학금', color: 'orange' },
    { id: 'research', name: 'Research', korean: '조사', color: 'red' },
    { id: 'application', name: 'Applications', korean: '지원서', color: 'indigo' }
  ];

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    const colorMap: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      red: 'bg-red-100 text-red-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    };
    return colorMap[cat?.color || 'gray'];
  };

  const getPriorityColor = (priority: string) => {
    const colorMap = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colorMap[priority as keyof typeof colorMap] || 'text-gray-600';
  };

  const getPriorityIcon = (priority: string) => {
    const iconMap = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return iconMap[priority as keyof typeof iconMap] || '⚪';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateStatus = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return { text: 'Overdue', color: 'text-red-600', bg: 'bg-red-50' };
    if (days === 0) return { text: 'Due today', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (days <= 3) return { text: `Due in ${days} days`, color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: `Due in ${days} days`, color: 'text-green-600', bg: 'bg-green-50' };
  };

  const filteredTasks = tasks
    .filter(task => selectedCategory === 'all' || task.category === selectedCategory)
    .filter(task => showCompleted || !task.completed)
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const overdueTasks = pendingTasks.filter(task => getDaysUntilDue(task.dueDate) < 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            <KoreanText>지원 일정</KoreanText> / Application Timeline
          </h2>
          <p className="text-gray-600 text-sm">Track your application progress</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-blue-600">{pendingTasks.length}</div>
            <div className="text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-gray-500">Completed</div>
          </div>
          {overdueTasks.length > 0 && (
            <div className="text-center">
              <div className="font-bold text-red-600">{overdueTasks.length}</div>
              <div className="text-gray-500">Overdue</div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Completion Rate</div>
          <div className="text-lg font-bold text-blue-800">
            {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600 font-medium">On Track</div>
          <div className="text-lg font-bold text-green-800">
            {pendingTasks.filter(task => getDaysUntilDue(task.dueDate) >= 0).length}
          </div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-sm text-yellow-600 font-medium">Due Soon</div>
          <div className="text-lg font-bold text-yellow-800">
            {pendingTasks.filter(task => {
              const days = getDaysUntilDue(task.dueDate);
              return days >= 0 && days <= 7;
            }).length}
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Categories</div>
          <div className="text-lg font-bold text-purple-800">
            {new Set(tasks.map(t => t.category)).size}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center gap-4 ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="category">Sort by Category</option>
          </select>
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded"
            />
            Show completed
          </label>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg font-medium mb-2">No tasks found</div>
            <div className="text-sm">Try adjusting your filters or add a new task</div>
          </div>
        ) : (
          filteredTasks.map(task => {
            const dueStatus = getDueDateStatus(task.dueDate);
            return (
              <div
                key={task.id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  task.completed
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => onTaskToggle(task.id, e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                          {categories.find(c => c.id === task.category)?.name}
                        </span>
                        <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                          {getPriorityIcon(task.priority)} {task.priority}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onTaskEdit(task)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onTaskDelete(task.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className={`text-sm mb-2 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                    )}

                    {/* Task Details */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className={`px-2 py-1 rounded ${dueStatus.bg} ${dueStatus.color}`}>
                        {dueStatus.text}
                      </div>
                      {task.university && (
                        <span>🏫 {task.university}</span>
                      )}
                      {task.estimatedHours && (
                        <span>⏱️ {task.estimatedHours}h</span>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex gap-1">
                          {task.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                          {task.tags.length > 2 && (
                            <span className="text-xs">+{task.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Calendar Integration Hint */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium text-blue-800">Calendar Integration</span>
        </div>
        <p className="text-sm text-blue-700 mb-2">
          Sync your timeline with Google Calendar or Apple Calendar to never miss a deadline.
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-800 underline">
          Connect Calendar →
        </button>
      </div>
    </div>
  );
};

export default Timeline; 