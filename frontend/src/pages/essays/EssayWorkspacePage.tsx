import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { essaysAPI, feedbackAPI, analysisAPI } from '../../services/api';
import { useCoachPersona, CoachPersonaThemes } from '../../stores/useCoachPersona';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  AcademicCapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import AccessibleButton from '../../components/common/AccessibleButton';
import CulturalAdaptationGuide from '../../components/common/CulturalAdaptationGuide';
import ProgressTracker from '../../components/common/ProgressTracker';
import UniversityWeatherAnalysis from '../../components/analysis/UniversityWeatherAnalysis';
import RequireSubscription from '../../components/auth/RequireSubscription';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { useAuth } from '../../contexts/AuthContext';

interface Essay {
  id: string;
  title: string;
  content: string;
  type: string;
  targetSchool?: string;
  prompt?: string;
  status: 'draft' | 'submitted' | 'reviewing' | 'feedback-ready' | 'revised' | 'final';
  wordCount: number;
  feedback: any[];
  createdAt: string;
  updatedAt: string;
}

const EssayWorkspacePage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { persona } = useCoachPersona();
  
  const [activeTab, setActiveTab] = useState<'editor' | 'feedback' | 'cultural' | 'progress' | 'university'>('editor');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showCulturalGuide, setShowCulturalGuide] = useState(false);
  const [targetWordLimit, setTargetWordLimit] = useState<number | null>(null);
  const [schoolDeadline, setSchoolDeadline] = useState<{ label: string; date: string } | null>(null);
  const [schoolInfo, setSchoolInfo] = useState<any | null>(null);
  const [showSchoolMenu, setShowSchoolMenu] = useState(false);
  const [showEarlyTip, setShowEarlyTip] = useState(false);

  // Fetch essay data
  const { data: essayResponse, isLoading, error } = useQuery({
    queryKey: ['essay', id],
    queryFn: () => essaysAPI.getById(id!),
    enabled: !!id,
  });

  // Generate feedback mutation
  const generateFeedbackMutation = useMutation({
    mutationFn: async (essayId: string) => {
      const res = await fetch(`/api/feedback/generate/${essayId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}` },
        body: JSON.stringify({ persona }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essay', id] });
      setActiveTab('feedback');
    },
  });

  // Save essay mutation
  const saveMutation = useMutation({
    mutationFn: (essayData: Partial<Essay>) => essaysAPI.saveEssay(essayData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essay', id] });
      setLastSaved(new Date());
      setIsSaving(false);
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  const essay = essayResponse?.data?.essay;

  // Update local state when essay data is loaded
  useEffect(() => {
    if (essay) {
      setTitle(essay.title || '');
      setContent(essay.content || '');
      // pull stored limit if present in essay
      const anyEssay: any = essay as any;
      if (typeof anyEssay.targetWordLimit === 'number') setTargetWordLimit(anyEssay.targetWordLimit);
    }
  }, [essay]);

  // Load university quick info for selected school to show nearest deadline
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (!essay?.targetSchool) return;
        const res = await analysisAPI.getUniversityQuickInfo();
        const all = (res.data as any)?.data || res.data || [];
        const found = all.find((u: any) => u.shortName === essay.targetSchool || u.name === essay.targetSchool);
        if (found && mounted) {
          setSchoolInfo(found);
          const d = found.deadlines || {};
          const entries: Array<{ label: string; date: string }> = [];
          if (d.earlyDecision) entries.push({ label: 'ED', date: d.earlyDecision });
          if (d.earlyAction) entries.push({ label: 'EA', date: d.earlyAction });
          if (d.regularDecision) entries.push({ label: 'RD', date: d.regularDecision });
          const nearest = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
          if (nearest) setSchoolDeadline(nearest);
          // Early-start tip
          const days = nearest ? Math.ceil((new Date(nearest.date).getTime() - Date.now()) / 86400000) : null;
          if (days !== null && days > 45 && essay?.id) {
            const key = `earlyTip_shown_${essay.id}`;
            if (!localStorage.getItem(key)) {
              setShowEarlyTip(true);
              localStorage.setItem(key, '1');
            }
          }
        }
      } catch {}
    }
    load();
    return () => { mounted = false; };
  }, [essay?.targetSchool]);

  // Auto-save functionality
  const debouncedSave = useCallback(
    (data: Partial<Essay>) => {
      const timeoutId = setTimeout(() => {
        setIsSaving(true);
        saveMutation.mutate(data);
      }, 2000);
      return () => clearTimeout(timeoutId);
    },
    [saveMutation]
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSave({ title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedSave({ content: newContent });
  };

  const handleGenerateFeedback = () => {
    if (id) {
      generateFeedbackMutation.mutate(id);
    }
  };

  const handleSubmitEssay = () => {
    if (id) {
      saveMutation.mutate({ status: 'submitted' });
    }
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = content.length;
  const overLimit = targetWordLimit ? Math.max(0, wordCount - targetWordLimit) : 0;

  // Mobile tab navigation
  const mobileTabs = [
    { id: 'editor', label: t('essays.tabs.editor'), icon: DocumentTextIcon },
    { id: 'feedback', label: t('essays.tabs.feedback'), icon: ChatBubbleLeftRightIcon },
    { id: 'cultural', label: t('essays.tabs.cultural'), icon: GlobeAltIcon },
    { id: 'progress', label: t('essays.tabs.progress'), icon: ChartBarIcon },
    { id: 'university', label: 'Admissions outlook', icon: AcademicCapIcon },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="h-96 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-korean">
            {t('essays.errors.loadError')}
          </h2>
          <p className="text-gray-600 text-korean mb-4">
            {t('essays.errors.loadErrorDescription')}
          </p>
          <AccessibleButton onClick={() => navigate('/essays')}>
            {t('common.back')}
          </AccessibleButton>
        </div>
      </div>
    );
  }

  return (
    <>
      <PrivateSEO title="에세이 작성 도구 | AdmitAI Korea" language="ko" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/essays')}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 text-korean">
                    {essay?.title || t('essays.newEssay')}
                  </h1>
                  {/* School indicator + quick links */}
                  {essay?.targetSchool && (
                    <div className="mt-1 flex items-center gap-2 relative">
                      <button
                        onClick={() => setShowSchoolMenu(!showSchoolMenu)}
                        className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                      >
                        {essay.targetSchool}
                      </button>
                      {showSchoolMenu && schoolInfo && (
                        <div className="absolute top-6 left-0 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                          <div className="text-xs text-gray-600 mb-2">Quick links</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {schoolInfo.links?.admissions && <a className="px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 text-center" href={schoolInfo.links.admissions} target="_blank" rel="noreferrer">Admissions</a>}
                            {schoolInfo.links?.prompts && <a className="px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 text-center" href={schoolInfo.links.prompts} target="_blank" rel="noreferrer">Prompts</a>}
                            {schoolInfo.links?.apply && <a className="px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 text-center" href={schoolInfo.links.apply} target="_blank" rel="noreferrer">Apply</a>}
                            {schoolInfo.links?.financialAid && <a className="px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 text-center" href={schoolInfo.links.financialAid} target="_blank" rel="noreferrer">Aid</a>}
                            {schoolInfo.links?.deadlines && <a className="px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 text-center" href={schoolInfo.links.deadlines} target="_blank" rel="noreferrer">Deadlines</a>}
                            {schoolInfo.links?.international && <a className="px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 text-center" href={schoolInfo.links.international} target="_blank" rel="noreferrer">International</a>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500 text-korean">
                      {t('essays.wordCount')}: {wordCount}
                    </span>
                    <span className="text-sm text-gray-500 text-korean">
                      {t('essays.characterCount')}: {characterCount}
                    </span>
                    {lastSaved && (
                      <span className="text-sm text-gray-500 text-korean">
                        {t('essays.lastSaved')}: {lastSaved.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isSaving && (
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4 mr-1 animate-spin" />
                    <span className="text-korean">{t('essays.saving')}</span>
                  </div>
                )}
                {/* Word limit guardrail */}
                {typeof targetWordLimit === 'number' && (
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${wordCount > targetWordLimit ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    {wordCount}/{targetWordLimit} {wordCount > targetWordLimit ? `(+${wordCount - targetWordLimit})` : ''}
                  </div>
                )}
                {/* Deadline risk chip */}
                {schoolDeadline && (
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${(() => { const days = Math.ceil((new Date(schoolDeadline.date).getTime()-Date.now())/86400000); return days <= 7 ? 'bg-red-50 text-red-700 border border-red-200' : days <= 21 ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : 'bg-gray-100 text-gray-700 border border-gray-200'; })()}`}> 
                    {schoolDeadline.label}: {new Date(schoolDeadline.date).toLocaleDateString()}
                  </div>
                )}
                <AccessibleButton
                  variant="outline"
                  onClick={() => setShowCulturalGuide(!showCulturalGuide)}
                >
                  <GlobeAltIcon className="w-4 h-4 mr-2" />
                  {t('essays.culturalGuide')}
                </AccessibleButton>
                <AccessibleButton
                  onClick={handleGenerateFeedback}
                  loading={generateFeedbackMutation.isPending}
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  {t('essays.generateFeedback')}
                </AccessibleButton>
                <AccessibleButton
                  variant="secondary"
                  onClick={handleSubmitEssay}
                  disabled={!content.trim()}
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  {t('essays.submit')}
                </AccessibleButton>
              </div>
            </div>
          </div>

        {/* Early-start onboarding tip */}
        {showEarlyTip && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0 -mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start justify-between">
              <div className="text-sm text-blue-800">
                Starting early? Do you already have a rough draft or outline to import? You can paste it into the editor, or create a quick outline using our coach.
              </div>
              <div className="flex gap-2">
                <AccessibleButton variant="outline" onClick={() => setActiveTab('editor')}>Paste draft</AccessibleButton>
                <AccessibleButton onClick={() => setActiveTab('cultural')}>Create outline</AccessibleButton>
                <button className="text-xs text-blue-700" onClick={() => setShowEarlyTip(false)}>Dismiss</button>
              </div>
            </div>
          </div>
        )}

          {/* Mobile Tab Navigation */}
          <div className="sm:hidden mb-6">
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
              {mobileTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-korean">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden sm:block mb-6">
            <nav className="flex space-x-8">
              {mobileTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
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

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'editor' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6">
                    {/* Title Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-korean">
                        {t('essays.title')}
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder={t('essays.titlePlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-korean"
                      />
                    </div>

                    {/* Content Editor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-korean">
                        {t('essays.content')}
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder={t('essays.contentPlaceholder')}
                        rows={20}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-korean"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'feedback' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                      {t('essays.feedback.title')}
                    </h3>
                    {essay?.feedback && essay.feedback.length > 0 ? (
                      <div className="space-y-4">
                        {essay.feedback.map((feedback: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                feedback.severity === 'high' ? 'bg-red-100 text-red-800' :
                                feedback.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {t(`essays.feedback.severity.${feedback.severity}`)}
                              </span>
                              <span className="text-sm font-medium text-gray-900 text-korean">
                                {feedback.title}
                              </span>
                            </div>
                            <p className="text-gray-600 text-korean mb-2">{feedback.description}</p>
                            {feedback.suggestions && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium text-gray-900 mb-2 text-korean">
                                  {t('essays.feedback.suggestions')}:
                                </h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {feedback.suggestions.map((suggestion: string, idx: number) => (
                                    <li key={idx} className="text-sm text-gray-600 text-korean">
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2 text-korean">
                          {t('essays.feedback.noFeedback')}
                        </h3>
                        <p className="text-gray-600 text-korean mb-4">
                          {t('essays.feedback.generatePrompt')}
                        </p>
                        <AccessibleButton onClick={handleGenerateFeedback}>
                          {t('essays.generateFeedback')}
                        </AccessibleButton>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'cultural' && (
                <CulturalAdaptationGuide />
              )}

              {activeTab === 'progress' && (
                <ProgressTracker userId={user?.id || ''} />
              )}

              {activeTab === 'university' && (
                <RequireSubscription>
                  <UniversityWeatherAnalysis
                    universityName={essay?.targetSchool || 'Harvard University'}
                    essayContent={content}
                    onRecommendationClick={(recommendation) => {
                      console.log('Applying recommendation:', recommendation);
                    }}
                  />
                </RequireSubscription>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Essay Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                  {t('essays.stats.title')}
                </h3>
                <div className="space-y-3">
                  {/* Target word limit selector */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600 text-korean">Target word limit</label>
                    <select
                      value={targetWordLimit ?? ''}
                      onChange={async (e) => {
                        const val = e.target.value ? parseInt(e.target.value, 10) : null;
                        setTargetWordLimit(val as number | null);
                        if (essay?.id) {
                          await essaysAPI.update(essay.id, { targetWordLimit: val ?? undefined });
                        }
                      }}
                      className="px-2 py-1 rounded border border-gray-300 text-sm"
                    >
                      <option value="">None</option>
                      <option value="150">150</option>
                      <option value="250">250</option>
                      <option value="300">300</option>
                      <option value="500">500</option>
                      <option value="650">650</option>
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 text-korean">{t('essays.stats.wordCount')}</span>
                    <span className="text-sm font-medium text-gray-900">{wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 text-korean">{t('essays.stats.characterCount')}</span>
                    <span className="text-sm font-medium text-gray-900">{characterCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 text-korean">{t('essays.stats.feedbackCount')}</span>
                    <span className="text-sm font-medium text-gray-900">{essay?.feedback?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 text-korean">{t('essays.stats.status')}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      essay?.status === 'submitted' ? 'bg-green-100 text-green-800' :
                      essay?.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t(`essays.status.${essay?.status}`)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                  {t('essays.quickActions.title')}
                </h3>
                <div className="space-y-3">
                  <AccessibleButton
                    variant="outline"
                    fullWidth
                    onClick={() => setActiveTab('cultural')}
                  >
                    <AcademicCapIcon className="w-4 h-4 mr-2" />
                    {t('essays.quickActions.culturalGuide')}
                  </AccessibleButton>
                  <AccessibleButton
                    variant="outline"
                    fullWidth
                    onClick={handleGenerateFeedback}
                    loading={generateFeedbackMutation.isPending}
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    {t('essays.quickActions.generateFeedback')}
                  </AccessibleButton>
                  <AccessibleButton
                    variant="outline"
                    fullWidth
                    onClick={() => setActiveTab('progress')}
                  >
                    <ChartBarIcon className="w-4 h-4 mr-2" />
                    {t('essays.quickActions.viewProgress')}
                  </AccessibleButton>
                </div>
              </div>

              {/* Cultural Tips */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                  {t('essays.culturalTips.title')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <GlobeAltIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 text-korean">
                      {t('essays.culturalTips.tip1')}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AcademicCapIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 text-korean">
                      {t('essays.culturalTips.tip2')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



export default EssayWorkspacePage; 