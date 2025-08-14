import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Timeline, { TimelineTask } from '../../components/common/Timeline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const API = '/api/timeline';

const ApplicationTimelinePage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [timelineId, setTimelineId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TimelineTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from auth context
  const userId = user?.id;

  // Fetch timeline and tasks
  const fetchTimeline = async () => {
    if (!userId) {
      setError(language === 'ko' ? '로그인이 필요합니다.' : 'Please log in to access your timeline.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API}?userId=${userId}`);
      if (res.status === 404) {
        setTimelineId(null);
        setTasks([]);
        return;
      }
      
      if (!res.ok) {
        throw new Error('Failed to fetch timeline');
      }
      
      const data = await res.json();
      setTimelineId(data.data.id);
      setTasks(data.data.tasks);
    } catch (err) {
      setError(language === 'ko' ? '타임라인을 불러오는데 실패했습니다.' : 'Failed to load timeline.');
      console.error('Timeline fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (userId) {
      fetchTimeline(); 
    }
  }, [userId]);

  // Add, edit, complete, delete handlers
  const handleAddTask = async () => {
    if (!timelineId || !userId) return;
    
    const title = prompt(language === 'ko' ? '작업 제목을 입력하세요:' : 'Enter task title:');
    if (!title) return;
    
    const type = prompt(language === 'ko' ? '작업 유형을 입력하세요 (ESSAY, TEST 등):' : 'Enter task type (ESSAY, TEST, etc):') || 'ESSAY';
    const dueDate = prompt(language === 'ko' ? '마감일을 입력하세요 (YYYY-MM-DD):' : 'Enter due date (YYYY-MM-DD):');
    if (!dueDate) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API}/${timelineId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title, dueDate })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      
      await fetchTimeline();
    } catch (err) {
      setError(language === 'ko' ? '작업 추가에 실패했습니다.' : 'Failed to add task.');
      console.error('Add task error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = async (task: TimelineTask) => {
    const title = prompt(language === 'ko' ? '제목을 수정하세요:' : 'Edit title:', task.title);
    if (!title) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      
      if (!response.ok) {
        throw new Error('Failed to edit task');
      }
      
      await fetchTimeline();
    } catch (err) {
      setError(language === 'ko' ? '작업 수정에 실패했습니다.' : 'Failed to edit task.');
      console.error('Edit task error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm(language === 'ko' ? '이 작업을 삭제하시겠습니까?' : 'Delete this task?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      await fetchTimeline();
    } catch (err) {
      setError(language === 'ko' ? '작업 삭제에 실패했습니다.' : 'Failed to delete task.');
      console.error('Delete task error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      await fetchTimeline();
    } catch (error) {
      setError(language === 'ko' ? '작업 업데이트에 실패했습니다.' : 'Failed to update task.');
      console.error('Task toggle error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTimeline = async () => {
    if (!userId) {
      setError(language === 'ko' ? '로그인이 필요합니다.' : 'Please log in to create a timeline.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create timeline');
      }
      
      await fetchTimeline();
    } catch (err) {
      setError(language === 'ko' ? '타임라인 생성에 실패했습니다.' : 'Failed to create timeline.');
      console.error('Create timeline error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="bg-yellow-50 border-yellow-200 text-center p-6">
            <p className="text-yellow-800">
              {language === 'ko' 
                ? '로그인이 필요합니다. 타임라인에 접근하려면 로그인해주세요.'
                : 'Please log in to access your personalized application timeline.'
              }
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">
          {language === 'ko' ? '개인화된 지원 일정' : 'Personalized Application Timeline'}
        </h1>
        
        {error && (
          <Card className="mb-4 bg-red-50 border-red-200 p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </Card>
        )}
        
        {!timelineId ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {language === 'ko' 
                ? '개인화된 지원 일정을 생성하여 체계적으로 준비하세요.'
                : 'Create a personalized application timeline to stay organized.'
              }
            </p>
            <Button onClick={handleCreateTimeline} disabled={loading}>
              {loading 
                ? (language === 'ko' ? '생성 중...' : 'Creating...') 
                : (language === 'ko' ? '내 타임라인 생성' : 'Create My Timeline')}
            </Button>
          </div>
        ) : (
          <>
            <Button className="mb-4" variant="primary" onClick={handleAddTask} disabled={loading}>
              + {language === 'ko' ? '작업 추가' : 'Add Task'}
            </Button>
            <Timeline
              tasks={tasks}
              onTaskToggle={handleTaskToggle}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
              onTaskAdd={handleAddTask}
              loading={loading}
            />
          </>
        )}
        
        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              {language === 'ko' ? '로딩 중...' : 'Loading...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTimelinePage; 