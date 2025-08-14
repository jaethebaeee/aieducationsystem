import React from 'react';
import { analysisAPI, essaysAPI, universitiesAPI, userAPI, onboardingAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

type WeatherSignal = { label: string; change: 'up' | 'down' | 'stable'; detail: string };
type UniversityWeather = {
  universityId: string;
  name: string;
  logoUrl?: string;
  pressureIndex: number; // 0–100
  signals: WeatherSignal[];
  nextDeadline?: { label: string; dateISO: string };
};

type PriorityTask = {
  id: string;
  title: string;
  reason: 'deadline' | 'weather' | 'mentor' | 'testing' | 'finance';
  dueISO?: string;
  related?: { type: 'essay' | 'university' | 'test' | 'scholarship'; id: string };
};

function computePressureIndex(ranking?: number, earliestDeadlineISO?: string | null): number {
  let score = 60;
  if (typeof ranking === 'number') {
    if (ranking <= 20) score += 20;
    else if (ranking <= 50) score += 12;
    else score += 6;
  }
  if (earliestDeadlineISO) {
    const now = new Date();
    const d = new Date(earliestDeadlineISO);
    const days = Math.round((+d - +now) / (1000 * 60 * 60 * 24));
    if (days <= 30) score += 20; else if (days <= 60) score += 10; else if (days <= 120) score += 5;
  }
  return Math.max(0, Math.min(100, score));
}

function badgeColor(reason: PriorityTask['reason']): string {
  switch (reason) {
    case 'deadline':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'weather':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'testing':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'finance':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'mentor':
      return 'bg-green-50 text-green-700 border-green-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const [weather, setWeather] = React.useState<UniversityWeather[]>([]);
  const [tasks, setTasks] = React.useState<PriorityTask[]>([]);
  const [essaySummary, setEssaySummary] = React.useState<{ totalEssays: number; totalWords: number; byStatus: Record<string, number> } | null>(null);
  const [affordSummary, setAffordSummary] = React.useState<{ schoolsWithAid: number; nextAidDeadline?: string | null; scholarshipsTotal: number } | null>(null);
  const [scholarships, setScholarships] = React.useState<Array<{ name: string; deadline?: string | null; link?: string; school?: string }>>([]);
  const [promptSuggestion, setPromptSuggestion] = React.useState<{ school: string; question: string; maxWords?: number; deadline?: string | null } | null>(null);
  const [userTargets, setUserTargets] = React.useState<string[]>([]);
  const [searchQ, setSearchQ] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Array<{ name: string; shortName: string }>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        // Targets briefing for deadlines and simple ranking tier
        let targets: any[] = [];
        try {
          const briefing = await analysisAPI.getTargetsBriefing();
          targets = briefing.data?.targets || [];
        } catch (e) {
          // fallback: empty targets
          targets = [];
        }
        // Load user targets (for add-target feature)
        try {
          const prof = await userAPI.getProfile();
          const ts: unknown = (prof.data as any)?.user?.profile?.targetSchools;
          let arr: string[] = [];
          if (Array.isArray(ts)) arr = ts as string[];
          else if (typeof ts === 'string') { try { arr = JSON.parse(ts as string); } catch {} }
          if (!cancelled) setUserTargets(arr);
        } catch {}

        // Build base weather rows from targets
        const base: UniversityWeather[] = targets.slice(0, 6).map((t: any) => {
          const earliest = [t.deadlines?.earlyDecision, t.deadlines?.earlyAction, t.deadlines?.regularDecision]
            .filter(Boolean)
            .map((s: string) => new Date(s))
            .sort((a: Date, b: Date) => +a - +b)[0];
          const earliestISO = earliest ? earliest.toISOString().slice(0, 10) : null;
          const nextLabel = (() => {
            if (t.deadlines?.earlyDecision) return 'ED';
            if (t.deadlines?.earlyAction) return 'EA';
            if (t.deadlines?.regularDecision) return 'RD';
            return '—';
          })();
          return {
            universityId: (t.shortName || t.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: t.name,
            pressureIndex: computePressureIndex(t.ranking, earliestISO || undefined),
            signals: [],
            nextDeadline: earliestISO ? { label: nextLabel, dateISO: earliestISO } : undefined,
          } as UniversityWeather;
        });

        // Optionally enrich first 3 with insights
        const enriched: UniversityWeather[] = [...base];
        for (let i = 0; i < Math.min(3, enriched.length); i++) {
          try {
            const u = enriched[i];
            const insights = await analysisAPI.getUniversityInsights(u.name);
            const sigs: WeatherSignal[] = [];
            (insights.data?.trends || []).slice(0, 1).forEach((x: string) => sigs.push({ label: x, change: 'up', detail: 'Trend' }));
            (insights.data?.opportunities || []).slice(0, 1).forEach((x: string) => sigs.push({ label: x, change: 'up', detail: 'Opportunity' }));
            (insights.data?.risks || []).slice(0, 1).forEach((x: string) => sigs.push({ label: x, change: 'down', detail: 'Risk' }));
            enriched[i] = { ...u, signals: sigs };
          } catch {
            // ignore per-university errors
          }
        }

        if (!cancelled) setWeather(enriched);

        // Essay summary
        let essayStatsLocal: { totalEssays: number; totalWords: number; byStatus: Record<string, number> } | null = null;
        try {
          const summary = await essaysAPI.getStatsSummary();
          essayStatsLocal = summary.data || null;
          if (!cancelled) setEssaySummary(essayStatsLocal);
        } catch {
          if (!cancelled) setEssaySummary(null);
        }

        // Priority tasks derived heuristically from deadlines and essay status
        const tasksOut: PriorityTask[] = [];
        enriched.slice(0, 3).forEach((u) => {
          if (u.nextDeadline?.dateISO) {
            tasksOut.push({ id: `dl-${u.universityId}`, title: `${u.name}: Prepare for ${u.nextDeadline.label}`, reason: 'deadline', dueISO: u.nextDeadline.dateISO, related: { type: 'university', id: u.universityId } });
          }
        });
        const toWrite = (essayStatsLocal?.byStatus?.draft || 0) > 0;
        if (toWrite) {
          tasksOut.push({ id: 'essay-next', title: 'Polish your draft essay', reason: 'weather', related: { type: 'essay', id: 'next' } });
        }
        if (!cancelled) setTasks(tasksOut);

        // Affordability summary + scholarships + prompt suggestion (pull cycles for first 3 targets)
        try {
          const year = new Date().getFullYear();
          const topTargets = targets.slice(0, 3).filter((t: any) => t.shortName);
          const cycles = await Promise.all(
            topTargets.map((t: any) => universitiesAPI.getCycle(t.shortName, year))
          );
          let schoolsWithAid = 0;
          let scholarshipsTotal = 0;
          let nextAidDeadline: string | null | undefined = undefined;
          const scholarshipRows: Array<{ name: string; deadline?: string | null; link?: string; school?: string }> = [];
          let promptPick: { school: string; question: string; maxWords?: number; deadline?: string | null } | null = null;
          for (let idx = 0; idx < cycles.length; idx++) {
            const c = cycles[idx];
            const cycle = c.data?.cycle;
            const schoolName = topTargets[idx]?.name || topTargets[idx]?.shortName;
            if (!cycle) continue;
            // Aid presence
            if (cycle.aid) {
              schoolsWithAid += 1;
              // Parse deadlines in aid JSON map if present
              try {
                const deadlines = typeof cycle.aid.deadlines === 'string' ? JSON.parse(cycle.aid.deadlines) : cycle.aid.deadlines;
                const vals = Object.values(deadlines || {}) as string[];
                const soon = vals
                  .map((s) => new Date(s))
                  .filter((d) => !isNaN(+d) && d > new Date())
                  .sort((a, b) => +a - +b)[0];
                if (soon) {
                  const iso = soon.toISOString().slice(0, 10);
                  if (!nextAidDeadline || iso < nextAidDeadline) nextAidDeadline = iso;
                }
              } catch {}
            } else if (cycle.links?.financialAid) {
              // Count as having aid reference via link
              schoolsWithAid += 1;
            }
            // Scholarships
            if (Array.isArray(cycle.scholarships)) {
              scholarshipsTotal += cycle.scholarships.length;
              for (const s of cycle.scholarships) {
                scholarshipRows.push({ name: s.name, deadline: s.deadline, link: s.link, school: schoolName });
              }
            }
            // Prompt suggestion (first available)
            if (!promptPick && Array.isArray(cycle.prompts) && cycle.prompts.length > 0) {
              const p = cycle.prompts[0];
              promptPick = { school: schoolName, question: p.question, maxWords: p.maxWords || undefined };
            }
          }
          scholarshipRows.sort((a, b) => {
            const da = a.deadline ? new Date(a.deadline) : null;
            const db = b.deadline ? new Date(b.deadline) : null;
            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            return +da - +db;
          });
          if (!cancelled) {
            setAffordSummary({ schoolsWithAid, nextAidDeadline: nextAidDeadline || null, scholarshipsTotal });
            setScholarships(scholarshipRows.slice(0, 3));
            setPromptSuggestion(promptPick);
          }
        } catch {
          if (!cancelled) {
            setAffordSummary(null);
            setScholarships([]);
            setPromptSuggestion(null);
          }
        }
      } catch {
        // swallow network errors to avoid UI crash
        if (!cancelled) {
          setWeather([]);
          setEssaySummary(null);
          setTasks([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = React.useCallback(async () => {
    const q = searchQ.trim();
    if (!q) { setSearchResults([]); return; }
    try {
      const res = await universitiesAPI.search(q);
      const data = Array.isArray(res.data) ? res.data : [];
      setSearchResults(data.slice(0, 6));
    } catch {
      setSearchResults([]);
    }
  }, [searchQ]);

  const handleAddTarget = React.useCallback(async (name: string) => {
    try {
      if (userTargets.includes(name)) return;
      const next = [...userTargets, name];
      await onboardingAPI.saveProfile({ targetSchools: JSON.stringify(next) });
      setUserTargets(next);
      setSearchQ('');
      setSearchResults([]);
      // simple reload to refresh all card queries
      window.setTimeout(() => { window.location.reload(); }, 300);
    } catch {
      // ignore
    }
  }, [userTargets]);

  return (
    <div className="space-y-6">
      {/* Weather strip */}
      <section>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-900">University Weather</h2>
          <p className="text-sm text-gray-600">Signals shaping priorities this cycle</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
          {weather.map((u) => (
            <div key={u.universityId} className="min-w-[260px] bg-white border border-gray-200 rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{u.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{u.pressureIndex}<span className="text-sm font-medium text-gray-500 ml-1">/100</span></p>
                </div>
                {u.nextDeadline && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Next</p>
                    <p className="text-sm font-medium text-gray-800">{u.nextDeadline.label}</p>
                    <p className="text-xs text-gray-500">{formatDate(u.nextDeadline.dateISO)}</p>
                  </div>
                )}
              </div>
              <ul className="mt-3 space-y-2">
                {u.signals.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={
                      s.change === 'up'
                        ? 'inline-flex mt-0.5 w-2 h-2 rounded-full bg-green-500'
                        : s.change === 'down'
                        ? 'inline-flex mt-0.5 w-2 h-2 rounded-full bg-red-500'
                        : 'inline-flex mt-0.5 w-2 h-2 rounded-full bg-gray-400'
                    } />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <section className="lg:col-span-2 space-y-6">
          {/* Priority list */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Today’s Priorities</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
            </div>
            <ul className="divide-y divide-gray-100">
              {tasks.map((t) => (
                <li key={t.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${badgeColor(t.reason)}`}>{t.reason}</span>
                      {t.dueISO && <span className="text-gray-500">Due {formatDate(t.dueISO)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      onClick={() => {
                        if (t.related?.type === 'essay') navigate('/essays/new');
                        if (t.related?.type === 'university' && t.dueISO) navigate(`/dashboard/timeline`);
                      }}
                    >
                      Open
                    </button>
                    <button className="text-sm px-3 py-1.5 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50">Done</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Essay progress placeholder */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Essay Progress</h3>
            {essaySummary ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Total Essays</p>
                  <p className="text-lg font-semibold text-gray-900">{essaySummary.totalEssays}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Words</p>
                  <p className="text-lg font-semibold text-gray-900">{essaySummary.totalWords}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="text-lg font-semibold text-gray-900">{essaySummary.byStatus?.completed || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">In Progress</p>
                  <p className="text-lg font-semibold text-gray-900">{(essaySummary.byStatus?.draft || 0) + (essaySummary.byStatus?.revision || 0)}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Loading essay stats…</p>
            )}
          </div>
        </section>

        {/* Right column */}
        <aside className="space-y-6">
          {/* Add Target School */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Add Target School</h3>
              <span className="text-xs text-gray-500">{userTargets.length} selected</span>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                placeholder="Search universities…"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <button onClick={handleSearch} className="text-sm px-3 py-2 bg-gray-900 text-white rounded-md">Search</button>
            </div>
            {searchResults.length > 0 && (
              <ul className="max-h-44 overflow-auto divide-y divide-gray-100">
                {searchResults.map((r) => (
                  <li key={r.shortName} className="py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-800">{r.name}</span>
                    <button onClick={() => handleAddTarget(r.name)} className="text-xs px-2 py-1 border rounded-md">Add</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Timeline peek */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Next 30 Days</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => navigate('/dashboard/timeline')}>Open calendar</button>
            </div>
            <ul className="space-y-3">
              {weather.map((u) => (
                <li key={u.universityId} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-600">{u.nextDeadline?.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatDate(u.nextDeadline?.dateISO)}</p>
                    <p className="text-xs text-gray-500">Deadline</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Affordability snapshot */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Affordability Snapshot</h3>
            {affordSummary ? (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Schools with Aid Info</p>
                  <p className="text-lg font-semibold text-gray-900">{affordSummary.schoolsWithAid}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scholarships Tracked</p>
                  <p className="text-lg font-semibold text-gray-900">{affordSummary.scholarshipsTotal}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next Aid Deadline</p>
                  <p className="text-lg font-semibold text-gray-900">{affordSummary.nextAidDeadline ? formatDate(affordSummary.nextAidDeadline) : '—'}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Loading affordability…</p>
            )}
          </div>

          {/* Scholarships */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-900">Scholarships</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
            </div>
            {scholarships.length === 0 ? (
              <p className="text-sm text-gray-600">No upcoming scholarships tracked.</p>
            ) : (
              <ul className="space-y-2">
                {scholarships.map((s, i) => (
                  <li key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-600">{s.school || ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{s.deadline ? formatDate(s.deadline) : '—'}</p>
                      {s.link && (
                        <a href={s.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600">Open</a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Start from Prompt */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Start from Prompt</h3>
            {promptSuggestion ? (
              <div>
                <p className="text-sm text-gray-800 mb-2 line-clamp-3">“{promptSuggestion.question}”</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{promptSuggestion.school} {promptSuggestion.maxWords ? `• ${promptSuggestion.maxWords}w` : ''}</span>
                  <button
                    onClick={() => navigate(`/essays/new?school=${encodeURIComponent(promptSuggestion.school)}&prompt=${encodeURIComponent(promptSuggestion.question)}${promptSuggestion.maxWords ? `&limit=${promptSuggestion.maxWords}` : ''}${promptSuggestion.deadline ? `&deadline=${promptSuggestion.deadline}` : ''}`)}
                    className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Start
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No prompt available yet.</p>
            )}
          </div>

          {/* Mentor Prompt */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Ask Your Mentor</h3>
            <p className="text-sm text-gray-600 mb-3">Get feedback on your current priorities or essays.</p>
            <button
              className="text-sm px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-md"
              onClick={() => document.dispatchEvent(new CustomEvent('chat:toggle'))}
            >
              Open Mentor Chat
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

