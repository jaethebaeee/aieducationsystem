import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  AcademicCapIcon,
  LightBulbIcon,
  PlayIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
  ArrowRightIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'sample_essay' | 'guide' | 'college_tip' | 'video';
  college?: string;
  theme?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  tags: string[];
  rating?: number;
  featured?: boolean;
}

const ResourcesHubPage: React.FC = () => {
  const { t, language } = useLanguage();
  const tr = useCallback((key: string, fallback: string) => {
    try {
      const val = (t as any)(key);
      if (typeof val === 'string' && val && val !== key) return val;
    } catch {}
    return fallback;
  }, [t]);
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [readingProgress, setReadingProgress] = useState<Record<string, { lastOpened: number }>>({});
  const [insightModal, setInsightModal] = useState<{ open: boolean; title: string; content: string }>({ open: false, title: '', content: '' });
  const [loadingInsightId, setLoadingInsightId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [achievements] = useState<Record<string, boolean>>({});
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiResults, setAiResults] = useState<Resource[] | null>(null);
  const [subWeekly, setSubWeekly] = useState<boolean>(() => {
    try { return localStorage.getItem('weekly_admission_feed') === '1'; } catch { return false; }
  });

  type Track = {
    id: string;
    title: string;
    titleKo: string;
    description: string;
    descriptionKo: string;
    criteria: {
      tags?: string[];
      types?: Array<Resource['type']>;
      colleges?: string[];
    };
    order: 'beginnerToAdvanced' | 'any';
  };

  const tracks: Track[] = [
    {
      id: 'personal-statement-track',
      title: 'Personal Statement Track',
      titleKo: '개인 에세이 트랙',
      description: 'From basics to strong drafts for your main essay.',
      descriptionKo: '기초부터 탄탄한 개인 에세이 초안까지.',
      criteria: { tags: ['structure', 'basics', 'values', 'leadership', 'personal growth'], types: ['guide', 'sample_essay'] },
      order: 'beginnerToAdvanced',
    },
    {
      id: 'stem-admissions-track',
      title: 'STEM Admissions Track',
      titleKo: 'STEM 지원 트랙',
      description: 'Engineer a compelling STEM application narrative.',
      descriptionKo: '설득력 있는 STEM 지원 스토리 만들기.',
      criteria: { tags: ['engineering', 'technical skills', 'innovation'], colleges: ['MIT'] },
      order: 'beginnerToAdvanced',
    },
    {
      id: 'ivy-essay-series',
      title: 'Ivy League Essay Series',
      titleKo: '아이비리그 에세이 시리즈',
      description: 'Analyze and model essays from top Ivies.',
      descriptionKo: '상위 아이비 에세이 분석 및 모델링.',
      criteria: { colleges: ['Harvard University', 'Yale University', 'Princeton University', 'Columbia University'] },
      order: 'any',
    },
  ];

  const difficultyOrder = ['beginner', 'intermediate', 'advanced'];

  const trackToResources = (track: Track): Resource[] => {
    const { tags = [], types = [], colleges = [] } = track.criteria;
    const list = resources.filter((r) => {
      const tagOk = tags.length === 0 || r.tags.some((t) => tags.includes(t));
      const typeOk = types.length === 0 || types.includes(r.type);
      const collegeOk = colleges.length === 0 || (r.college ? colleges.includes(r.college) : false);
      return tagOk && typeOk && collegeOk;
    });
    if (track.order === 'beginnerToAdvanced') {
      return list.sort((a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty));
    }
    return list;
  };

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Harvard Personal Statement Example',
      description: 'A successful Harvard application essay that demonstrates leadership and intellectual curiosity.',
      type: 'sample_essay',
      college: 'Harvard University',
      difficulty: 'advanced',
      readTime: '5 min read',
      tags: ['leadership', 'intellectual curiosity', 'personal growth'],
      rating: 4.8,
      featured: true
    },
    {
      id: '2',
      title: 'Stanford Supplemental Essay Guide',
      description: 'Complete guide to writing Stanford\'s "What matters to you and why?" essay.',
      type: 'guide',
      college: 'Stanford University',
      difficulty: 'intermediate',
      readTime: '8 min read',
      tags: ['supplemental essays', 'values', 'reflection'],
      rating: 4.6
    },
    {
      id: '3',
      title: 'MIT Engineering Essay Tips',
      description: 'How to showcase your technical skills while maintaining authenticity.',
      type: 'college_tip',
      college: 'MIT',
      difficulty: 'intermediate',
      readTime: '6 min read',
      tags: ['engineering', 'technical skills', 'authenticity'],
      rating: 4.7
    },
    {
      id: '4',
      title: 'Yale Personal Statement Analysis',
      description: 'Detailed breakdown of what makes Yale essays successful.',
      type: 'sample_essay',
      college: 'Yale University',
      difficulty: 'advanced',
      readTime: '7 min read',
      tags: ['academic focus', 'community', 'intellectual depth'],
      rating: 4.9,
      featured: true
    },
    {
      id: '5',
      title: 'Common App Essay Structure',
      description: 'Step-by-step guide to structuring your main personal statement.',
      type: 'guide',
      difficulty: 'beginner',
      readTime: '10 min read',
      tags: ['structure', 'common app', 'basics'],
      rating: 4.5
    },
    {
      id: '6',
      title: 'Princeton Values and Mission',
      description: 'Understanding Princeton\'s core values to align your essay.',
      type: 'college_tip',
      college: 'Princeton University',
      difficulty: 'intermediate',
      readTime: '4 min read',
      tags: ['values', 'mission', 'alignment'],
      rating: 4.4
    },
    {
      id: '7',
      title: 'Columbia Diversity Essay Example',
      description: 'How to write about your cultural background authentically.',
      type: 'sample_essay',
      college: 'Columbia University',
      difficulty: 'intermediate',
      readTime: '6 min read',
      tags: ['diversity', 'cultural background', 'authenticity'],
      rating: 4.6
    },
    {
      id: '8',
      title: 'UC Berkeley Personal Insight Questions',
      description: 'Complete guide to UC Berkeley\'s 8 personal insight questions.',
      type: 'guide',
      college: 'University of California, Berkeley',
      difficulty: 'intermediate',
      readTime: '12 min read',
      tags: ['UC system', 'personal insight', 'California'],
      rating: 4.3
    },
    {
      id: '9',
      title: 'NYU Creative Writing Tips',
      description: 'How to showcase creativity in your NYU application.',
      type: 'college_tip',
      college: 'New York University',
      difficulty: 'intermediate',
      readTime: '5 min read',
      tags: ['creativity', 'arts', 'New York'],
      rating: 4.2
    },
    {
      id: '10',
      title: 'Leadership Essay Examples',
      description: 'Multiple examples of successful leadership-focused essays.',
      type: 'sample_essay',
      difficulty: 'intermediate',
      readTime: '15 min read',
      tags: ['leadership', 'examples', 'multiple schools'],
      rating: 4.7
    },
    {
      id: '11',
      title: 'Essay Writing Fundamentals',
      description: 'Basic principles every college essay should follow.',
      type: 'guide',
      difficulty: 'beginner',
      readTime: '8 min read',
      tags: ['basics', 'fundamentals', 'principles'],
      rating: 4.4
    },
    {
      id: '12',
      title: 'Cultural Identity Essays',
      description: 'How to write about your Korean heritage authentically.',
      type: 'guide',
      difficulty: 'intermediate',
      readTime: '9 min read',
      tags: ['cultural identity', 'Korean heritage', 'authenticity'],
      rating: 4.8,
      featured: true
    }
  ];

  // Stabilize resources reference for memo deps. resources is a static array in this module.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resourcesMemo = useMemo(() => resources, []);

  const colleges = [
    'Harvard University',
    'Stanford University',
    'MIT',
    'Yale University',
    'Princeton University',
    'Columbia University',
    'University of Pennsylvania',
    'Dartmouth College',
    'Brown University',
    'Cornell University',
    'University of California, Berkeley',
    'University of California, Los Angeles',
    'New York University',
    'University of Michigan',
    'University of Virginia'
  ];

  const themes = [
    'leadership',
    'cultural identity',
    'academic passion',
    'community service',
    'personal growth',
    'creativity',
    'resilience',
    'innovation',
    'diversity',
    'social impact'
  ];

  const types = [
    { value: 'sample_essay', label: t('resources.types.sampleEssays'), icon: BookOpenIcon, color: 'bg-blue-100 text-blue-800' },
    { value: 'guide', label: t('resources.types.guides'), icon: AcademicCapIcon, color: 'bg-green-100 text-green-800' },
    { value: 'college_tip', label: t('resources.types.collegeTips'), icon: LightBulbIcon, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'video', label: t('resources.types.videos'), icon: PlayIcon, color: 'bg-purple-100 text-purple-800' }
  ];

  const difficulties = [
    { value: 'beginner', label: t('resources.difficulty.beginner'), color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: t('resources.difficulty.intermediate'), color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: t('resources.difficulty.advanced'), color: 'bg-red-100 text-red-800' }
  ];

  // Personalization reorder by target schools – define before usage
  const targetSchoolSet = useMemo(() => new Set<string>((user?.profile?.targetSchools || [])), [user?.profile?.targetSchools]);

  const scoreResource = useCallback((r: Resource) => {
    let s = 0;
    if ((r as any).featured) s += 1;
    if ((r as any).college && targetSchoolSet.has((r as any).college)) s += 3;
    if (readingProgress[r.id]) s += 0.5; // familiarity boost
    return s;
  }, [readingProgress, targetSchoolSet]);

  const filteredResources = useMemo(() => {
    const base = resourcesMemo.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCollege = !selectedCollege || resource.college === selectedCollege;
      const matchesTheme = !selectedTheme || resource.tags.includes(selectedTheme);
      const matchesType = !selectedType || resource.type === selectedType;
      const matchesDifficulty = !selectedDifficulty || resource.difficulty === selectedDifficulty;

      return matchesSearch && matchesCollege && matchesTheme && matchesType && matchesDifficulty;
    });
    // stable sort via decorate-sort-undecorate
    return base
      .map((r, i) => ({ r, i, s: scoreResource(r) }))
      .sort((a, b) => (b.s - a.s) || (a.i - b.i))
      .map(x => x.r);
  }, [resourcesMemo, searchQuery, selectedCollege, selectedTheme, selectedType, selectedDifficulty, scoreResource]);

  // hydrate reading progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem('resource_reads');
      if (raw) setReadingProgress(JSON.parse(raw));
    } catch {}
  }, []);

  const markOpened = (id: string) => {
    setReadingProgress((prev) => {
      const next = { ...prev, [id]: { lastOpened: Date.now() } };
      try { localStorage.setItem('resource_reads', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const continueResources = useMemo(() => {
    const ids = Object.keys(readingProgress);
    if (ids.length === 0) return [] as Resource[];
    const withTimes = ids.map((id) => ({ id, t: readingProgress[id]?.lastOpened || 0 })).sort((a, b) => b.t - a.t).slice(0, 6);
    const idSet = new Set(withTimes.map((x) => x.id));
    return resourcesMemo.filter((r) => idSet.has(r.id));
  }, [resourcesMemo, readingProgress]);

  const recommendedResources = useMemo(() => {
    const seenIds = new Set(Object.keys(readingProgress));
    const seenTags = new Set<string>();
    resourcesMemo.forEach((r) => { if (seenIds.has(r.id)) r.tags.forEach((t) => seenTags.add(t)); });
    const scored = resourcesMemo.map((r) => {
      let score = 0;
      if (r.featured) score += 2;
      if (r.difficulty === 'beginner') score += 1;
      r.tags.forEach((t) => { if (seenTags.has(t)) score += 1; });
      if (seenIds.has(r.id)) score -= 5;
      return { r, score };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, 6).map((s) => s.r);
  }, [resourcesMemo, readingProgress]);

  const fetchInsight = async (
    resource: Resource,
    mode: 'summary' | 'insights' | 'outline' | 'prompts' | 'simplify'
  ) => {
    try {
      setLoadingInsightId(resource.id);
      const res = await fetch('/api/agentic-seek/evaluate-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent: mode, input: `${resource.title}\n\n${resource.description}` }),
      });
      const data = await res.json().catch(() => null);
      const text = data?.data?.output || data?.content || 'No insight available.';
      const titleMap: Record<string, string> = {
        summary: language==='ko' ? '요약' : 'Summary',
        insights: language==='ko' ? '핵심 인사이트' : 'Key Insights',
        outline: language==='ko' ? '개요' : 'Outline',
        prompts: language==='ko' ? '연습 프롬프트' : 'Practice Prompts',
        simplify: language==='ko' ? '쉬운 영어로 설명' : 'Explain in Simple English',
      };
      setInsightModal({ open: true, title: `${titleMap[mode]} — ${resource.title}`, content: String(text) });
    } catch {
      setInsightModal({ open: true, title: 'Error', content: 'Failed to fetch insights.' });
    } finally {
      setLoadingInsightId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sample_essay':
        return '📝';
      case 'guide':
        return '📚';
      case 'college_tip':
        return '💡';
      case 'video':
        return '🎥';
      default:
        return '📄';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCollege('');
    setSelectedTheme('');
    setSelectedType('');
    setSelectedDifficulty('');
  };

  // Monetization helpers
  const plan: 'free' | 'basic' | 'premium' | 'enterprise' = (user?.subscription?.plan as any) || 'free';
  const monthKey = new Date().toISOString().slice(0,7).replace('-','');
  const advancedKey = `adv_reads_${monthKey}`;
  const [advReads, setAdvReads] = useState<number>(() => {
    const raw = localStorage.getItem(advancedKey);
    return raw ? parseInt(raw, 10) || 0 : 0;
  });
  const advLimit = 2; // free monthly advanced reads

  const isAdvanced = (r: Resource) => r.difficulty === 'advanced';

  const canOpenResource = (r: Resource) => {
    if (plan !== 'free') return true;
    if (!isAdvanced(r)) return true;
    return advReads < advLimit;
  };

  const onOpenResource = (r: Resource) => {
    if (!canOpenResource(r)) {
      setUpgradeModal({ open: true, message: language==='ko' ? '이번 달 무료 고급 자료 2개를 모두 열람했습니다. 프리미엄으로 업그레이드하여 계속 읽기.' : 'You’ve used your 2 advanced resources this month. Upgrade to keep reading.' });
      return;
    }
    // count advanced read for free plan
    if (plan === 'free' && isAdvanced(r)) {
      const next = advReads + 1;
      setAdvReads(next);
      try { localStorage.setItem(advancedKey, String(next)); } catch {}
    }
    markOpened(r.id);
  };

  const activeFiltersCount = [searchQuery, selectedCollege, selectedTheme, selectedType, selectedDifficulty]
    .filter(Boolean).length;

  

  return (
    <div className="min-h-screen bg-black text-white">
      <PrivateSEO title={tr('resources.title', 'Resources Hub')} language={language as 'ko' | 'en'} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <style>{`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white text-korean">
                {tr('resources.title', 'Resources Hub')}
              </h1>
              <p className="mt-2 text-gray-300 text-korean">
                {tr('resources.subtitle', language==='ko' ? '입증된 에세이, 전략, 인사이더 팁으로 미국 명문대 합격을 준비하세요.' : 'Proven essays, strategies, and insider tips to get into top U.S. universities.')}
              </p>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/10 text-white border border-white/15">
                  <span>🎓</span>
                  <span className="font-medium">{language === 'ko' ? '전 세계 12,000+ 학생·상담사가 신뢰' : 'Trusted by 12,000+ students and counselors worldwide'}</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/10 text-white border border-white/15">
                  <span>📚</span>
                  <span className="font-medium">{language === 'ko' ? '에세이·가이드·영상 라이브러리' : 'Essays · Guides · Videos library'}</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/10 text-white border border-white/15">
                  <span>🤖</span>
                  <span className="font-medium">{language === 'ko' ? 'AI 팁과 체크리스트 제공' : 'AI tips and checklists'}</span>
                </span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="w-4 h-4" />
                <span className="text-korean">{t('resources.filtersLabel')}</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Learning Tracks - redesigned */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white text-korean mb-4">{language==='ko'?'학습 트랙':'Learning Tracks'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track, idx) => {
              const items = trackToResources(track);
              const total = items.length; const done = items.filter((r) => completed[r.id]).length;
              const pct = total ? Math.round((done/total)*100) : 0;
              const accents = ['from-purple-500','from-blue-500','from-amber-500'];
              const accent = accents[idx % accents.length];
              return (
                <div key={track.id} className="relative rounded-xl bg-white/5 border border-white/10 p-5 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.6)]">
                  <div className={`absolute -top-0.5 left-0 right-0 h-0.5 bg-gradient-to-r ${accent} via-pink-500 to-orange-500 opacity-70 rounded-t-xl`} />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-white">{language==='ko'?track.titleKo:track.title}</h3>
                      <p className="text-[13px] text-white/70 mt-0.5">{language==='ko'?track.descriptionKo:track.description}</p>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">{done}/{total}</span>
                  </div>
                  <div className="mt-3">
                    <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${accent} to-purple-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {items.slice(0,3).map((r) => (
                      <div key={r.id} className="flex items-center justify-between text-[13px]">
                        <span className="truncate text-white/90">{r.title}</span>
                        <button onClick={() => markOpened(r.id)} className="px-2 py-1 rounded-md border border-white/10 text-white/80 hover:bg-white/10">{language==='ko'?'열기':'Open'}</button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {(() => {
                      const next = items.find((r) => !completed[r.id]);
                      if (!next) return (
                        <button disabled className="flex-1 text-center px-4 py-2 rounded-lg bg-emerald-600 text-white opacity-90">{language==='ко'?'트랙 완료':'Track completed'}</button>
                      );
                      return (
                        <>
                          <button onClick={() => markOpened(next.id)} className="flex-1 text-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">
                            {language==='ko'?'다음 추천 단계':'Next Recommended Step'}
                          </button>
                          <button onClick={() => { items.forEach(i=>markOpened(i.id)); }} className="px-4 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/10">
                            {language==='ko'?'모두 보기':'View all'}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* AI Quick Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <input
                value={aiQuery}
                onChange={(e)=>setAiQuery(e.target.value)}
                placeholder={language==='ko' ? '예: 리더십 주제의 Columbia 에세이 보여줘' : 'Ex: Show me Columbia essays about leadership'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={async()=>{
                  if (!aiQuery.trim()) return;
                  const res = await fetch('/api/agentic-seek/evaluate-input', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ intent: 'resource-search', input: aiQuery })});
                  const data = await res.json().catch(()=>null);
                  const answer = data?.data?.output || '';
                  setAiAnswer(String(answer));
                  // naive parse: filter by detected college/tag words
                  const q = aiQuery.toLowerCase();
                  const matched = resources.filter(r => (r.college && q.includes((r.college||'').toLowerCase().split(' ')[0])) || r.tags.some(t=>q.includes(t.toLowerCase())));
                  setAiResults(matched.slice(0,6));
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >{language==='ko'?'검색':'Search'}</button>
            </div>
            {aiAnswer && (
              <div className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{aiAnswer}</div>
            )}
            {aiResults && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {aiResults.map((r)=> (
                  <div key={`ai-${r.id}`} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="font-medium text-gray-900 truncate">{r.title}</div>
                      <span className="text-xl">{getTypeIcon(r.type)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2 line-clamp-2">{r.description}</div>
                    <button className="text-blue-600 text-sm" onClick={()=>onOpenResource(r)}>{language==='ko'?'열기':'Open'}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('resources.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-korean"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* College Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-korean mb-2">
                    {t('resources.filters.college')}
                  </label>
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">{t('resources.filters.allColleges')}</option>
                    {colleges.map(college => (
                      <option key={college} value={college}>{college}</option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-korean mb-2">
                    {t('resources.filters.type')}
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">{t('resources.filters.allTypes')}</option>
                    {types.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Theme Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-korean mb-2">
                    {t('resources.filters.theme')}
                  </label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">{t('resources.filters.allThemes')}</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-korean mb-2">
                    {t('resources.filters.difficulty')}
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">{t('resources.filters.allDifficulties')}</option>
                    {difficulties.map(difficulty => (
                      <option key={difficulty.value} value={difficulty.value}>{difficulty.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 text-korean"
                  >
                    {t('resources.clearFilters')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results Count + Subscription Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600 text-korean">
                {t('resources.resultsCount').replace('{{count}}', filteredResources.length.toString())}
              </p>
              <label className="hidden md:flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" checked={subWeekly} onChange={(e)=>{ const v=e.target.checked; setSubWeekly(v); try{ localStorage.setItem('weekly_admission_feed', v?'1':'0'); }catch{} }} />
                {language==='ko' ? '주간 입학 피드 구독' : 'Subscribe to Weekly Admission Feed'}
              </label>
            </div>
            {activeFiltersCount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 text-korean">{t('resources.activeFilters')}:</span>
                {selectedCollege && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {selectedCollege}
                  </span>
                )}
                {selectedType && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {types.find(t => t.value === selectedType)?.label}
                  </span>
                )}
                {selectedTheme && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    {selectedTheme}
                  </span>
                )}
                {selectedDifficulty && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    {difficulties.find(d => d.value === selectedDifficulty)?.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recommended For You */}
        {recommendedResources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 text-korean mb-4">{language === 'ko' ? '맞춤 추천' : 'Recommended for You'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedResources.map((resource, idx) => (
                <div key={`rec-${resource.id}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow opacity-0" style={{ animation: `fadeInUp 600ms ease-out ${idx * 40}ms forwards` }}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl md:text-4xl">{getTypeIcon(resource.type)}</span>
                      <div className="flex items-center gap-2">
                        {isAuthenticated && (
                          <>
                            <button disabled={loadingInsightId===resource.id} onClick={() => fetchInsight(resource, 'summary')} className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">{loadingInsightId===resource.id ? '…' : (language==='ko'?'요약':'Summarize')}</button>
                            <button disabled={loadingInsightId===resource.id} onClick={() => fetchInsight(resource, 'insights')} className="text-xs px-2 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">{language==='ko'?'핵심 인사이트':'Key Insights'}</button>
                            <button disabled={loadingInsightId===resource.id} onClick={() => fetchInsight(resource, 'outline')} className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">{language==='ko'?'개요':'Outline'}</button>
                            <button disabled={loadingInsightId===resource.id} onClick={() => fetchInsight(resource, 'prompts')} className="text-xs px-2 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200">{language==='ko'?'연습 프롬프트':'Prompts'}</button>
                            <button disabled={loadingInsightId===resource.id} onClick={() => fetchInsight(resource, 'simplify')} className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">{language==='ko'?'쉬운 영어':'Simplify'}</button>
                          </>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-korean mb-2 line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 text-korean mb-4 line-clamp-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getDifficultyColor(resource.difficulty)}`}>{difficulties.find(d => d.value === resource.difficulty)?.label}</span>
                        <div className="flex items-center text-xs text-gray-500"><ClockIcon className="w-3 h-3 mr-1" />{resource.readTime}</div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700" onClick={() => onOpenResource(resource)}><ArrowRightIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue Where You Left Off */}
        {continueResources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 text-korean mb-4">{language === 'ko' ? '이어보기' : 'Continue where you left off'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueResources.map((resource, idx) => (
                <div key={`cont-${resource.id}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow opacity-0" style={{ animation: `fadeInUp 600ms ease-out ${idx * 40}ms forwards` }}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl md:text-4xl">{getTypeIcon(resource.type)}</span>
                      <span className="text-xs text-gray-500">{language==='ko'?'최근 열람':'Recently opened'}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-korean mb-2 line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 text-korean mb-4 line-clamp-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getDifficultyColor(resource.difficulty)}`}>{difficulties.find(d => d.value === resource.difficulty)?.label}</span>
                        <div className="flex items-center text-xs text-gray-500"><ClockIcon className="w-3 h-3 mr-1" />{resource.readTime}</div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700" onClick={() => onOpenResource(resource)}><ArrowRightIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Resources */}
        {filteredResources.filter(r => r.featured).length > 0 && (
          <div className="mb-12 md:mb-16">
            <h2 className="text-xl font-semibold text-gray-900 text-korean mb-4">
              {t('resources.featured')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.filter(r => r.featured).map((resource, idx) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow opacity-0"
                  style={{ animation: `fadeInUp 600ms ease-out ${idx * 60}ms forwards` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl md:text-4xl">{getTypeIcon(resource.type)}</span>
                      {resource.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          <StarIcon className="w-3 h-3 mr-1" />
                          {t('resources.featured')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-korean mb-2 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-korean mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getDifficultyColor(resource.difficulty)}`}>
                          {difficulties.find(d => d.value === resource.difficulty)?.label}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {resource.readTime}
                        </div>
                      </div>
                       <button className="text-blue-600 hover:text-blue-700" onClick={() => onOpenResource(resource)}>
                        <ArrowRightIcon className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 text-korean mb-4">
            {t('resources.allResources')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, idx) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow opacity-0"
                style={{ animation: `fadeInUp 600ms ease-out ${idx * 40}ms forwards` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl md:text-4xl">{getTypeIcon(resource.type)}</span>
                    <div className="flex items-center gap-2">
                      {resource.rating && (
                        <div className="flex items-center text-sm text-gray-600">
                          <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                          {resource.rating}
                        </div>
                      )}
                      {isAuthenticated && (
                        <>
                          <button disabled={loadingInsightId===resource.id} onClick={() => fetchInsight(resource, 'summary')} className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">{loadingInsightId===resource.id ? '…' : (language==='ko'?'요약':'Summarize')}</button>
                          <button disabled={loadingInsightId===resource.id} onClick={() => fetchInsight(resource, 'insights')} className="text-xs px-2 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">{language==='ko'?'핵심 인사이트':'Key Insights'}</button>
                          <button disabled={loadingInsightId===resource.id} onClick={() => fetchInsight(resource, 'outline')} className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">{language==='ko'?'개요':'Outline'}</button>
                          <button disabled={loadingInsightId===resource.id} onClick={() => fetchInsight(resource, 'prompts')} className="text-xs px-2 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200">{language==='ko'?'연습 프롬프트':'Prompts'}</button>
                          <button disabled={loadingInsightId===resource.id} onClick={() => fetchInsight(resource, 'simplify')} className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">{language==='ko'?'쉬운 영어':'Simplify'}</button>
                        </>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-korean mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-korean mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        +{resource.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getDifficultyColor(resource.difficulty)}`}>
                        {difficulties.find(d => d.value === resource.difficulty)?.label}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {resource.readTime}
                      </div>
                    </div>
                      <button className="text-blue-600 hover:text-blue-700" onClick={() => { if (!canOpenResource(resource)) { setUpgradeModal({ open: true, message: language==='ko' ? '이번 달 무료 고급 자료 2개를 모두 열람했습니다. 프리미엄으로 업그레이드하여 계속 읽기.' : 'You’ve used your 2 advanced resources this month. Upgrade to keep reading.' }); return; } markOpened(resource.id); setCompleted((c)=>{ const n={...c,[resource.id]:true}; try{localStorage.setItem('resource_completed',JSON.stringify(n));}catch{} return n;}); }}>
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 text-korean mb-2">
                {t('resources.noResults')}
              </h3>
              <p className="text-gray-600 text-korean mb-4">
                {t('resources.noResultsDescription')}
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100"
              >
                {t('resources.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Insight Modal */}
      {insightModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{insightModal.title}</h3>
              <button onClick={() => setInsightModal({ open: false, title: '', content: '' })} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="prose max-w-none text-gray-800 whitespace-pre-wrap text-sm">{insightModal.content}</div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {upgradeModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{language==='ko'?'업그레이드 필요':'Upgrade required'}</h3>
            <p className="text-sm text-gray-700 mb-4">{upgradeModal.message}</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setUpgradeModal({ open:false, message:'' })} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">{language==='ko'?'나중에':'Later'}</button>
              <a href="/pricing" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">{language==='ko'?'플랜 보기':'See plans'}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesHubPage; 