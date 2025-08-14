import React, { useState, useEffect, useCallback, useRef } from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Essay, EssayFeedback } from '../../types';
import { essaysAPI } from '../../services/api';
import { 
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const Preview: React.FC<{ content: string }> = ({ content }) => {
  // Super-light parser: lines starting with '#' become headings; blank lines split paragraphs
  const lines = content.split(/\n\n+/);
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800">
        <div className="text-xs text-gray-400">Preview</div>
      </div>
      <div className="p-6 prose prose-sm md:prose-base prose-invert max-w-none">
        {lines.map((block, idx) => {
          const trimmed = block.trim();
          if (trimmed.startsWith('# ')) {
            return (
              <h3 key={idx} className="mt-0">{trimmed.replace(/^#\s+/, '')}</h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h4 key={idx} className="mt-0">{trimmed.replace(/^##\s+/, '')}</h4>
            );
          }
          return (
            <p key={idx} className="leading-8 tracking-[0.005em] text-gray-100 whitespace-pre-wrap">{trimmed}</p>
          );
        })}
      </div>
    </div>
  );
};

const Editor: React.FC<EditorProps> = ({ content, onChange, placeholder }) => {
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const surroundSelection = (prefix: string, suffix: string = prefix) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const before = content.slice(0, start);
    const selected = content.slice(start, end);
    const after = content.slice(end);
    const next = `${before}${prefix}${selected}${suffix}${after}`;
    onChange(next);
    // restore selection roughly after formatting
    setTimeout(() => {
      const pos = start + prefix.length + selected.length + suffix.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    }, 0);
  };

  const insertAtLineStart = (marker: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    // find line start
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const next = content.slice(0, lineStart) + marker + content.slice(lineStart);
    onChange(next);
    setTimeout(() => {
      const pos = start + marker.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    }, 0);
  };

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  return (
    <div className="flex-1 flex flex-col relative"
         onDragOver={(e)=>{e.preventDefault(); setIsDragging(true);}}
         onDragLeave={()=>setIsDragging(false)}
         onDrop={(e)=>{ e.preventDefault(); setIsDragging(false); const f = e.dataTransfer?.files?.[0]; if (!f) return; const reader = new FileReader(); reader.onload = () => { const text = typeof reader.result === 'string' ? reader.result : ''; onChange((content ? content + '\n\n' : '') + text); }; reader.readAsText(f); }}>
      {/* Floating counters */}
      <div className="absolute right-3 -top-3 z-10">
        <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-800/80 border border-neutral-700 text-gray-200 shadow-sm">
          {wordCount} words • {content.length} chars
        </div>
      </div>

      {/* Editor surface */}
      <div className={`rounded-xl border ${isDragging ? 'border-blue-500' : 'border-neutral-800'} bg-neutral-900 shadow-sm overflow-hidden`}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800">
          <div className="text-xs text-gray-400">Drafting surface</div>
          <div className="flex items-center gap-1.5">
            <button className="p-2 text-gray-400 hover:text-gray-200 rounded-md hover:bg-neutral-800">
            <BookmarkIcon className="w-5 h-5" />
          </button>
            <button className="p-2 text-gray-400 hover:text-gray-200 rounded-md hover:bg-neutral-800">
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
        {/* Inline toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-neutral-800 bg-neutral-900">
          <button onClick={() => surroundSelection('**')} className="px-2 py-1 text-xs rounded-md border border-neutral-700 text-gray-200 hover:bg-neutral-800">Bold</button>
          <button onClick={() => surroundSelection('_')} className="px-2 py-1 text-xs rounded-md border border-neutral-700 text-gray-200 hover:bg-neutral-800">Italic</button>
          <button onClick={() => surroundSelection('`')} className="px-2 py-1 text-xs rounded-md border border-neutral-700 text-gray-200 hover:bg-neutral-800">Code</button>
          <span className="mx-1 h-4 w-px bg-neutral-800" />
          <button onClick={() => insertAtLineStart('# ')} className="px-2 py-1 text-xs rounded-md border border-neutral-700 text-gray-200 hover:bg-neutral-800">H1</button>
          <button onClick={() => insertAtLineStart('## ')} className="px-2 py-1 text-xs rounded-md border border-neutral-700 text-gray-200 hover:bg-neutral-800">H2</button>
          <button onClick={() => insertAtLineStart('> ')} className="px-2 py-1 text-xs rounded-md border border-neutral-700 text-gray-200 hover:bg-neutral-800">Quote</button>
        </div>
      <textarea
          ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
          className="w-full p-6 text-gray-100 bg-neutral-900 outline-none focus:outline-none focus:ring-0 resize-none font-medium text-[16px] md:text-[17px] leading-8 tracking-[0.005em] placeholder:text-gray-500"
          style={{ minHeight: '520px' }}
      />
      </div>
    </div>
  );
};

interface FeedbackPanelProps {
  feedback: EssayFeedback[];
  onApplySuggestion: (feedbackId: string, suggestion: string) => void;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback, onApplySuggestion }) => {
  const { t } = useLanguage();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      case 'medium': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'low': return <LightBulbIcon className="w-5 h-5 text-blue-600" />;
      default: return <LightBulbIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  if (feedback.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('essays.editor.noFeedback.title')}
        </h3>
        <p className="text-gray-600">
          {t('essays.editor.noFeedback.description')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <div
          key={item.id}
          className={`border rounded-lg p-4 ${getSeverityColor(item.severity)}`}
        >
          <div className="flex items-start space-x-3">
            {getSeverityIcon(item.severity)}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-700 mb-3">
                {item.description}
              </p>
              {item.suggestions && item.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900">
                    {t('essays.editor.suggestions')}:
                  </h5>
                  <div className="space-y-2">
                    {item.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => onApplySuggestion(item.id, suggestion)}
                        className="block w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EssayEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [essay, setEssay] = useState<Essay | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [tone, setTone] = useState<'KR' | 'EN'>('KR');
  const [reuseOpen, setReuseOpen] = useState(false);
  const [pastEssays, setPastEssays] = useState<Essay[] | null>(null);
  const [loadingReuse, setLoadingReuse] = useState(false);

  // Read optional prefills
  const prefillSchool = searchParams.get('school') || undefined;
  const prefillPrompt = searchParams.get('prompt') || undefined;
  const prefillStart = (searchParams.get('start') as 'blank' | 'outline' | 'reuse' | null) || null;
  const prefillDeadline = searchParams.get('deadline') || undefined; // YYYY-MM-DD
  const prefillWordLimit = Number(searchParams.get('limit') || '') || 650;
  const sourceEssayId = searchParams.get('sourceEssayId') || undefined;

  // Admissions URL map (extend as needed)
  const getAdmissionsUrl = (school?: string | null): string | null => {
    if (!school) return null;
    const key = school.toLowerCase();
    const map: Record<string, string> = {
      'stanford university': 'https://admission.stanford.edu/',
      'harvard university': 'https://college.harvard.edu/admissions',
      'massachusetts institute of technology': 'https://mitadmissions.org/',
      'mit': 'https://mitadmissions.org/',
      'yale university': 'https://admissions.yale.edu/',
      'princeton university': 'https://admission.princeton.edu/',
      'columbia university': 'https://undergrad.admissions.columbia.edu/',
      'university of pennsylvania': 'https://admissions.upenn.edu/',
      'duke university': 'https://admissions.duke.edu/',
      'university of california, berkeley': 'https://admissions.berkeley.edu/',
      'university of california, los angeles': 'https://admission.ucla.edu/',
      'ucla': 'https://admission.ucla.edu/',
      'uc berkeley': 'https://admissions.berkeley.edu/',
    };
    return map[key] || null;
  };

  // Mock data - replace with API call
  useEffect(() => {
    const mockEssay: Essay = {
      id: id || '1',
      userId: user?.id || '',
      title: id === 'new' ? '' : 'My Journey from Seoul to Stanford',
      content: 'Growing up in Seoul, I always dreamed of studying abroad. The bustling streets of Gangnam, filled with students rushing to hagwons, taught me the value of hard work and determination. But it was my grandmother\'s stories of her own struggles during the Korean War that truly shaped my perspective on education and opportunity.\n\nWhen I first visited Stanford University during a family trip to California, I was struck by the campus\'s beauty and the palpable sense of innovation in the air. The students I met were not just academically brilliant; they were passionate about making a difference in the world. I realized that Stanford wasn\'t just a place to learn—it was a place to grow, to challenge myself, and to contribute to something larger than myself.',
      type: 'personal-statement',
      targetSchool: prefillSchool || 'Stanford University',
      prompt: prefillPrompt || 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.',
      wordCount: prefillWordLimit,
      status: 'draft',
      feedback: [
        {
          id: 'f1',
          essayId: id || '1',
          type: 'content',
          category: 'cultural-adaptation',
          severity: 'medium',
          title: 'Strengthen Cultural Connection',
          description: 'Your Korean background is mentioned but could be more deeply integrated throughout the essay. Consider how your cultural identity influences your perspective and goals.',
          suggestions: [
            'Add specific examples of Korean cultural values that shaped your worldview',
            'Connect your cultural background to your academic and career goals',
            'Show how your Korean identity will contribute to Stanford\'s diverse community'
          ],
          position: { start: 0, end: 200 },
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          id: 'f2',
          essayId: id || '1',
          type: 'structure',
          category: 'clarity-enhancement',
          severity: 'low',
          title: 'Improve Transition',
          description: 'The transition between your background and Stanford visit could be smoother.',
          suggestions: [
            'Add a connecting sentence that bridges your Korean background to your interest in Stanford',
            'Consider using a metaphor or analogy to create a stronger connection'
          ],
          position: { start: 150, end: 250 },
          createdAt: '2024-01-20T10:00:00Z'
        }
      ],
      versions: [],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    };

    setTimeout(() => {
      setEssay(mockEssay);
      // For /essays/new: show quickstart and prefill accordingly
      if (id === 'new') {
        setShowQuickStart(true);
        // Start content based on prefillStart
        if (prefillStart === 'outline') {
          const outline = [
            '# Hook',
            '# Conflict / Turning point',
            '# What changed (actions)',
            '# Reflection (values, growth)',
            '# Why this school/program'
          ].join('\n\n');
          setContent(outline);
        } else if (prefillStart === 'reuse') {
          setContent('Reusing core paragraph from previous essay...\n\n[Paste your paragraph here and we\'ll adapt it to the prompt.]');
        } else {
          setContent('');
        }
        setTitle('');
      } else {
      setContent(mockEssay.content);
      setTitle(mockEssay.title);
      }
      setLoading(false);
    }, 600);
  }, [id, user?.id]);

  // Load past essays for reuse tray when opened first time
  useEffect(() => {
    if (!reuseOpen || pastEssays !== null) return;
    setLoadingReuse(true);
    essaysAPI
      .getAll()
      .then((resp) => {
        const list = (resp?.data as any)?.data || [];
        setPastEssays(Array.isArray(list) ? list : []);
      })
      .catch(() => setPastEssays([]))
      .finally(() => setLoadingReuse(false));
  }, [reuseOpen, pastEssays]);

  // Autosave functionality
  const saveEssay = useCallback(async (autoSave = false) => {
    if (!essay) return;
    
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedEssay = {
        ...essay,
        title,
        content,
        wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length,
        updatedAt: new Date().toISOString()
      };
      
      setEssay(updatedEssay);
      setLastSaved(new Date());
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1200);
      
      if (!autoSave) {
        // Show success message for manual save
        console.log('Essay saved successfully');
      }
    } catch (error) {
      console.error('Error saving essay:', error);
    } finally {
      setSaving(false);
    }
  }, [essay, title, content]);

  // Autosave every 30 seconds
  useEffect(() => {
    if (!essay) return;
    
    const interval = setInterval(() => {
      saveEssay(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [saveEssay, essay]);

  const handleApplySuggestion = (feedbackId: string, suggestion: string) => {
    // Simple implementation - in a real app, you'd want to apply the suggestion more intelligently
    setContent(prev => prev + '\n\n' + suggestion);
  };

  const handleSubmitForReview = async () => {
    if (!essay) return;
    
    setSaving(true);
    try {
      // Simulate API call to submit for review
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedEssay = {
        ...essay,
        status: 'submitted' as const,
        updatedAt: new Date().toISOString()
      };
      
      setEssay(updatedEssay);
      console.log('Essay submitted for review');
    } catch (error) {
      console.error('Error submitting essay:', error);
    } finally {
      setSaving(false);
    }
  };

  // Save shortcut: Cmd/Ctrl + S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveEssay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [saveEssay]);

  // Simple quality meter
  const meter = (() => {
    const text = content || '';
    const words = text.trim().split(/\s+/).filter(Boolean);
    const length = Math.min(words.length / (prefillWordLimit || 650), 1);
    const hasNumbers = /\d/.test(text) ? 0.8 : 0.5;
    const names = (text.match(/\b[A-Z][a-z]+\b/g) || []).length > 2 ? 0.8 : 0.5;
    const specificity = Math.min(1, 0.4 + (hasNumbers - 0.5) + (names - 0.5) + length * 0.6);
    const authenticity = /I\s+(learned|realized|changed|reflect)/i.test(text) ? 0.8 : 0.6;
    const contextFit = essay?.targetSchool && /program|lab|course|community|professor/i.test(text) ? 0.8 : 0.5;
    const clarity = text.length > 0 && text.length < 3000 ? 0.8 : 0.6;
    return { specificity, authenticity, contextFit, clarity };
  })();
  const [metricOpen, setMetricOpen] = useState<null | 'specificity' | 'authenticity' | 'contextFit' | 'clarity'>(null);
  const metricTips: Record<string, string> = {
    specificity: 'Add concrete outcomes (numbers, names, places) and cut generalities.',
    authenticity: 'Use first-person reflection and show cause→effect changes you chose.',
    contextFit: 'Name programs, labs, courses, or communities and link them to your arc.',
    clarity: 'Shorten sentences, prefer active verbs, and keep one idea per paragraph.',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!essay) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('essays.editor.notFound.title')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('essays.editor.notFound.description')}
          </p>
          <button
            onClick={() => navigate('/essays')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('common.backToEssays')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <PrivateSEO title={t('essays.editor.title') as string} language="ko" />
      {/* Header */}
      <div className="bg-neutral-900/80 backdrop-blur border-b border-neutral-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/essays')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>{t('common.back')}</span>
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl md:text-2xl font-semibold text-white bg-transparent border-none focus:outline-none focus:ring-0 tracking-tight placeholder:text-gray-500"
                  placeholder={t('essays.editor.titlePlaceholder')}
                />
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                  <span className="flex items-center space-x-1">
                    <AcademicCapIcon className="w-4 h-4" />
                    {essay.targetSchool ? (
                      (() => {
                        const url = getAdmissionsUrl(essay.targetSchool);
                        const href = url || `https://www.google.com/search?q=${encodeURIComponent(essay.targetSchool + ' admissions')}`;
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline text-blue-400"
                          >
                            {essay.targetSchool}
                          </a>
                        );
                      })()
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </span>
                  <span className="flex items-center space-x-1">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span className="text-gray-300">{t(`essays.types.${essay.type}`)}</span>
                  </span>
                  {lastSaved && (
                    <span className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-gray-400">{t('essays.editor.lastSaved', { time: lastSaved.toLocaleTimeString() })}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Context chips */}
              {essay?.targetSchool && (
                <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border border-neutral-700 text-gray-200">{essay.targetSchool}</span>
              )}
              <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border border-neutral-700 text-gray-200">{prefillWordLimit}w</span>
              {prefillDeadline && (
                <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border border-neutral-700 text-gray-200">Due {prefillDeadline}</span>
              )}
              <button onClick={()=>setTone(tone==='KR'?'EN':'KR')} className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border border-neutral-700 text-gray-200 hover:bg-neutral-800">{tone}</button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <EyeIcon className="w-5 h-5" />
                <span>{showPreview ? t('essays.editor.hidePreview') : t('essays.editor.showPreview')}</span>
              </button>
              <button
                onClick={() => saveEssay()}
                disabled={saving}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${justSaved ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>{saving ? t('common.saving') : justSaved ? 'Saved' : t('common.save')}</span>
              </button>
              <button
                onClick={() => setReuseOpen((v) => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors ${reuseOpen ? 'border-blue-400 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span>Reuse</span>
              </button>
              <button
                onClick={handleSubmitForReview}
                disabled={saving || essay.status === 'submitted'}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>{t('essays.editor.submitForReview')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor */}
          <div className="lg:col-span-2">
            {showPreview ? (
              <Preview content={content} />
            ) : (
              <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-6 leading-relaxed">
              <Editor
                content={content}
                onChange={setContent}
                placeholder={t('essays.editor.contentPlaceholder')}
              />
            </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-20 h-fit">
            {/* Reuse tray */}
            {reuseOpen && (
              <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-100">Reuse</h3>
                  <button onClick={()=>setReuseOpen(false)} className="text-sm text-gray-400 hover:text-gray-200">Close</button>
                </div>
                {loadingReuse && (
                  <div className="text-sm text-gray-400">Loading your essays…</div>
                )}
                {!loadingReuse && pastEssays && pastEssays.length === 0 && (
                  <div className="text-sm text-gray-400">No past essays yet.</div>
                )}
                {!loadingReuse && pastEssays && pastEssays.length > 0 && (
                  <div className="space-y-3 max-h-72 overflow-auto pr-1">
                    {pastEssays.slice(0, 10).map((e) => (
                      <div key={e.id} className="border border-neutral-800 rounded-lg p-3 hover:bg-neutral-800">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-100 line-clamp-1">{e.title || 'Untitled'}</div>
                            <div className="text-xs text-gray-400 line-clamp-2 mt-1">{e.content?.slice(0, 160)}</div>
                            <div className="text-[11px] text-gray-500 mt-1">{e.targetSchool || e.type}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setContent((prev) => `${prev}${prev ? '\n\n' : ''}${e.content || ''}`)}
                            className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-700 text-gray-200 hover:bg-neutral-800"
                          >
                            Insert
                          </button>
                          <button
                            onClick={() => setContent((prev) => `${prev}${prev ? '\n\n' : ''}${(e.content || '')}\n\n[Adapt the inserted paragraph(s) to this prompt: ${essay.prompt || ''}]`)}
                            className="px-2.5 py-1.5 text-xs rounded-md border border-blue-400 text-blue-300 hover:bg-blue-500/10"
                          >
                            Insert + adapt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Quality meter */}
            <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-100">Quality</h3>
                <span className="text-xs text-gray-500">auto-estimated</span>
              </div>
              {(['specificity','authenticity','contextFit','clarity'] as const).map((k) => (
                <div key={k} className="mb-3">
                  <button
                    onClick={() => setMetricOpen(metricOpen === k ? null : k)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between text-sm text-gray-300 mb-1 capitalize">
                      <span>{k.replace('contextFit','context fit')}</span>
                      <span>{Math.round((meter as any)[k]*100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${k==='specificity'?'bg-indigo-500':k==='authenticity'?'bg-emerald-500':k==='contextFit'?'bg-blue-500':'bg-purple-500'}`} style={{ width: `${Math.round((meter as any)[k]*100)}%` }} />
                    </div>
                  </button>
                  {metricOpen === k && (
                    <div className="mt-2 text-xs text-gray-300 bg-neutral-800 border border-neutral-700 rounded-md p-3">
                      {metricTips[k]}
                    </div>
                  )}
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-2">Tip: add concrete outcomes and program specifics to raise specificity and context fit.</p>
            </div>
            {/* Essay Info */}
            <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <span className="text-gray-100">{t('essays.editor.essayInfo')}</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('essays.editor.prompt')}
                  </label>
                  <p className="text-sm text-gray-300 bg-neutral-800 p-3 rounded-lg">
                    {essay.prompt}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('essays.editor.wordLimit')}
                  </label>
                  <p className="text-sm text-gray-300">
                    {content.trim().split(/\s+/).filter(word => word.length > 0).length} / 650
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('essays.editor.status')}
                  </label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    essay.status === 'draft' ? 'bg-neutral-800 text-gray-200' :
                    essay.status === 'submitted' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {t(`essays.status.${essay.status}`)}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <span className="text-gray-100">{t('essays.editor.aiFeedback')}</span>
              </h3>
              <FeedbackPanel
                feedback={essay.feedback}
                onApplySuggestion={handleApplySuggestion}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quickstart modal */}
      {showQuickStart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Start your draft</h3>
            <p className="text-sm text-gray-600 mb-4">Choose how to begin. You can switch anytime.</p>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={()=>{setContent('');setShowQuickStart(false);}} className="p-4 rounded-xl border hover:border-blue-300 hover:bg-blue-50 text-left">
                <div className="font-medium text-gray-900">Blank</div>
                <div className="text-sm text-gray-600">Start from scratch.</div>
              </button>
              <button onClick={()=>{setContent(['# Hook','\n# Conflict / Turning point','\n# What changed (actions)','\n# Reflection (values, growth)','\n# Why this school/program'].join('\n\n'));setShowQuickStart(false);}} className="p-4 rounded-xl border hover:border-blue-300 hover:bg-blue-50 text-left">
                <div className="font-medium text-gray-900">Outline scaffold</div>
                <div className="text-sm text-gray-600">We’ll lay out beats you can fill.</div>
              </button>
              <button onClick={()=>{setContent('Paste your reusable paragraph here → we\'ll adapt it to the prompt.');setShowQuickStart(false);}} className="p-4 rounded-xl border hover:border-blue-300 hover:bg-blue-50 text-left">
                <div className="font-medium text-gray-900">Reuse existing</div>
                <div className="text-sm text-gray-600">Bring a paragraph to adapt for this prompt.</div>
              </button>
            </div>
            <div className="mt-4 text-right">
              <button onClick={()=>setShowQuickStart(false)} className="px-4 py-2 text-sm rounded-lg border text-gray-700 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayEditorPage; 