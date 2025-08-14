import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Essay, EssayType, EssayStatus } from '../../types';
import Card from '../../components/ui/Card';
import { 
  PlusIcon,
  PencilIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { essaysAPI, analysisAPI } from '../../services/api';

interface EssayCardProps {
  essay: Essay;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

const EssayCard: React.FC<EssayCardProps> = ({ essay, onEdit, onView }) => {
  const { t } = useLanguage();
  
  const getStatusColor = (status: EssayStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'feedback-ready': return 'bg-green-100 text-green-800';
      case 'revised': return 'bg-purple-100 text-purple-800';
      case 'final': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: EssayStatus) => {
    switch (status) {
      case 'draft': return <PencilIcon className="w-4 h-4" />;
      case 'submitted': return <ClockIcon className="w-4 h-4" />;
      case 'reviewing': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'feedback-ready': return <CheckCircleIcon className="w-4 h-4" />;
      case 'revised': return <DocumentTextIcon className="w-4 h-4" />;
      case 'final': return <StarIcon className="w-4 h-4" />;
      default: return <PencilIcon className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: EssayType) => {
    switch (type) {
      case 'personal-statement': return t('essays.types.personalStatement');
      case 'supplemental': return t('essays.types.supplemental');
      case 'common-app': return t('essays.types.commonApp');
      case 'scholarship': return t('essays.types.scholarship');
      case 'other': return t('essays.types.other');
      default: return type;
    }
  };

  return (
    <Card variant="dark" padding="md" shadow="sm" border hover>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            {essay.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <span className="flex items-center space-x-1">
              <AcademicCapIcon className="w-4 h-4" />
              <span>{getTypeLabel(essay.type)}</span>
            </span>
            {essay.targetSchool && (
              <span className="flex items-center space-x-1">
                <DocumentTextIcon className="w-4 h-4" />
                <span>{essay.targetSchool}</span>
              </span>
            )}
            <span className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{new Date(essay.updatedAt).toLocaleDateString()}</span>
            </span>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(essay.status)}`}>
          {getStatusIcon(essay.status)}
          <span>{t(`essays.status.${essay.status}`)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
        <span>{t('essays.wordCount', { count: essay.wordCount })}</span>
        <span>{essay.versions.length} {t('essays.versions')}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {essay.feedback.length > 0 && (
            <span className="text-sm text-blue-300 font-medium">
              {essay.feedback.length} {t('essays.feedbackItems')}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(essay.id)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
            <span>{t('common.view')}</span>
          </button>
          <button
            onClick={() => onEdit(essay.id)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            <span>{t('common.edit')}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

const EssayListPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EssayStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sort, setSort] = useState<'updated' | 'school' | 'type'>('updated');
  const [schools, setSchools] = useState<Array<{ key: string; name: string; shortName?: string | null; count: number; byStatus: Record<string, number> }>>([]);
  const [activeSchool, setActiveSchool] = useState<string>('all');
  const [briefing, setBriefing] = useState<{ targets: any[]; clusters: Record<string, { date: string; type: string; schools: string[] }>; recommended: { ed: string | null; ea: string | null } } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDropFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const baseTitle = file.name.replace(/\.(pdf|docx?|md|txt)$/i, '');
    try {
      await essaysAPI.saveEssay({ title: baseTitle || 'Imported Draft', content: '', type: 'personal-statement' as any });
      window.location.href = '/essays';
    } catch (e) {
      console.error('Failed to import essay', e);
    }
  }, []);
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); onDropFiles(e.dataTransfer?.files || null); };

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => window.clearTimeout(id);
  }, [searchQuery]);

  // Load from API
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [essaysRes, groupedRes, briefingRes] = await Promise.all([
          essaysAPI.getAll(),
          essaysAPI.getGroupedBySchool(),
          analysisAPI.getTargetsBriefing(),
        ]);
        if (!mounted) return;
        const serverEssays = (essaysRes.data as any)?.data || (essaysRes.data as any)?.essays || [];
        setEssays(serverEssays);
        const grouped = (groupedRes.data as any) || [];
        const schoolItems = grouped.map((g: any) => ({
          key: g.schoolId || g.schoolName || 'unassigned',
          name: g.schoolName,
          shortName: g.schoolShortName || null,
          count: g.totals?.essaysCount || (g.essays?.length || 0),
          byStatus: g.totals?.byStatus || {},
        }));
        setSchools([{ key: 'all', name: 'All schools', count: serverEssays.length, byStatus: {} }, ...schoolItems]);
        setBriefing((briefingRes.data as any)?.data || (briefingRes.data as any) || null);
      } catch (e) {
        // noop
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user?.id]);

  const filteredEssays = useMemo(() => {
    const base = essays.filter(essay => {
      const schoolMatch = activeSchool === 'all' || (essay.targetSchool || '') === (schools.find(s=>s.key===activeSchool)?.name || '');
      const matchesFilter = filter === 'all' || essay.status === filter;
      const q = debouncedQuery.toLowerCase();
      const matchesSearch = essay.title.toLowerCase().includes(q) ||
                           (essay.targetSchool || '').toLowerCase().includes(q);
      return schoolMatch && matchesFilter && matchesSearch;
    });
    const sorted = [...base].sort((a, b) => {
      if (sort === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sort === 'school') return (a.targetSchool || '').localeCompare(b.targetSchool || '');
      return a.type.localeCompare(b.type);
    });
    return sorted;
  }, [essays, filter, debouncedQuery, sort, activeSchool, schools]);

  const handleEdit = (id: string) => {
    window.location.href = `/essays/${id}/edit`;
  };

  const handleView = (id: string) => {
    window.location.href = `/essays/${id}`;
  };

  const statusFilters = [
    { value: 'all', label: t('essays.filters.all') },
    { value: 'draft', label: t('essays.filters.draft') },
    { value: 'submitted', label: t('essays.filters.submitted') },
    { value: 'reviewing', label: t('essays.filters.reviewing') },
    { value: 'feedback-ready', label: t('essays.filters.feedbackReady') },
    { value: 'revised', label: t('essays.filters.revised') },
    { value: 'final', label: t('essays.filters.final') }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-text-secondary">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <PrivateSEO title="내 에세이 | AdmitAI Korea" language="ko" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{t('essays.title')} <span className="text-text-secondary text-lg">({filteredEssays.length}/{essays.length})</span></h1>
              <p className="mt-2 text-text-secondary">{t('essays.subtitle')}</p>
            </div>
            <Link
              to="/essays/new"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>{t('essays.createNew')}</span>
            </Link>
          </div>
        </div>

        {/* Drag & Drop Import */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 rounded-xl border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'} p-6 text-sm text-white/80`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Drag & drop to create a draft</div>
              <div className="text-white/60">PDF, DOCX, MD, or TXT. You can paste content or brainstorm with AI after import.</div>
            </div>
            <label className="cursor-pointer px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10">
              Upload
              <input type="file" accept=".pdf,.doc,.docx,.md,.txt" className="hidden" onChange={(e)=> onDropFiles(e.target.files)} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left rail */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {briefing && (
              <Card variant="dark">
                <h3 className="text-sm font-semibold text-white mb-3">Recommendations</h3>
                <div className="flex flex-wrap gap-2">
                  {briefing.recommended.ed && (
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15 text-white">ED: {briefing.recommended.ed}</span>
                  )}
                  {briefing.recommended.ea && (
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15 text-white">EA: {briefing.recommended.ea}</span>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-white/70">Upcoming deadlines</div>
                  {Object.values(briefing.clusters)
                    .sort((a: any, b: any) => a.date.localeCompare(b.date))
                    .slice(0, 5)
                    .map((c: any) => (
                      <div key={c.type + c.date} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white/5">
                        <span>{c.type} · {new Date(c.date).toLocaleDateString()}</span>
                        <span className="text-white/70">{c.schools.length} schools</span>
                      </div>
                    ))}
                </div>
              </Card>
            )}
            <Card variant="dark">
              <h3 className="text-sm font-semibold text-white mb-3">My Schools</h3>
              <div className="space-y-1">
                {schools.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveSchool(s.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${activeSchool===s.key ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`}
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="text-xs text-white/70">{s.count}</span>
                  </button>
                ))}
              </div>
            </Card>
            {activeSchool !== 'all' && (() => {
              const selected = schools.find(s => s.key === activeSchool);
              const info = briefing?.targets?.find((t: any) =>
                t.shortName === selected?.shortName || t.name === selected?.name
              );
              if (!selected || !info) return null;
              const d = info.deadlines || {};
              const L = info.links || {};
              return (
                <Card variant="dark">
                  <h3 className="text-sm font-semibold text-white mb-3">{selected.name}</h3>
                  <div className="space-y-1 text-xs text-white/80">
                    {d.earlyDecision && <div>ED: {new Date(d.earlyDecision).toLocaleDateString()}</div>}
                    {d.earlyAction && <div>EA: {new Date(d.earlyAction).toLocaleDateString()}</div>}
                    {d.regularDecision && <div>RD: {new Date(d.regularDecision).toLocaleDateString()}</div>}
                    {d.transfer && <div>TR: {new Date(d.transfer).toLocaleDateString()}</div>}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {L.admissions && <a className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-center" href={L.admissions} target="_blank" rel="noreferrer">Admissions</a>}
                    {L.prompts && <a className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-center" href={L.prompts} target="_blank" rel="noreferrer">Prompts</a>}
                    {L.apply && <a className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-center" href={L.apply} target="_blank" rel="noreferrer">Apply</a>}
                    {L.financialAid && <a className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-center" href={L.financialAid} target="_blank" rel="noreferrer">Aid</a>}
                  </div>
                </Card>
              );
            })()}
            <Card variant="dark">
              <h3 className="text-sm font-semibold text-white mb-3">Stages</h3>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setFilter(status.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === status.value ? 'bg-white/15 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div className="col-span-12 lg:col-span-9">
            {/* Filters and Search */}
            <Card variant="dark" className="mb-8 sticky top-20 md:top-24 z-30">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('essays.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500/40 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-text-secondary">Sort</label>
              <select value={sort} onChange={(e)=>setSort(e.target.value as any)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-purple-500/40 focus:border-transparent">
                <option value="updated">Last edited</option>
                <option value="school">School</option>
                <option value="type">Type</option>
              </select>
              {debouncedQuery && (
                <button onClick={()=>setSearchQuery('')} className="px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg">Clear</button>
              )}
            </div>
          </div>
        </Card>

        {/* Essays Grid */}
        {filteredEssays.length === 0 ? (
          <Card variant="dark" className="p-12 text-center">
            <DocumentTextIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {t('essays.noEssays.title')}
            </h3>
            <p className="text-text-secondary mb-6">
              {t('essays.noEssays.description')}
            </p>
            <Link
              to="/essays/new"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>{t('essays.createFirst')}</span>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredEssays.map((essay) => (
              <EssayCard
                key={essay.id}
                essay={essay}
                onEdit={handleEdit}
                onView={handleView}
              />
            ))}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayListPage; 