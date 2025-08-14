import React, { useState, useEffect } from 'react';
import KanbanView from './views/KanbanView';
import TableView from './views/TableView';
import CardsView from './views/CardsView';
import DashboardNudge from '../dashboard/DashboardNudge';
import HomeView from './views/HomeView';

// const TABS = [
//   { key: 'kanban', label: 'Applications Board' },
//   { key: 'table', label: 'University Intelligence' },
//   { key: 'cards', label: 'Essay Projects' },
// ];

export default function ViewSwitcher({ onSelect }: { onSelect: (item: { type: 'school' | 'essay'; id: string }) => void }) {
  const [tab, setTab] = useState<'home' | 'kanban' | 'table' | 'cards'>(() => {
    try { return (localStorage.getItem('dash_tab') as any) || 'home'; } catch { return 'home'; }
  });

  useEffect(() => { try { localStorage.setItem('dash_tab', tab); } catch {} }, [tab]);

  return (
    <div className="space-y-4">
      <DashboardNudge />
      <div className="flex items-center gap-2">
        {[
          { key: 'home', label: 'Home', icon: '🏠' },
          { key: 'kanban', label: 'Applications Board', icon: '🗂️' },
          { key: 'table', label: 'University Intelligence', icon: '📊' },
          { key: 'cards', label: 'Essay Projects', icon: '📝' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`relative px-3 py-2 text-[13px] rounded-full border transition-colors ${tab === (t.key as any) ? 'text-white border-white/20 bg-white/10' : 'text-white/80 border-white/10 hover:bg-white/10'}`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
            {tab === (t.key as any) && (
              <span className="absolute left-2 right-2 -bottom-0.5 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {tab === 'home' && <HomeView onSelect={onSelect} />}
      {tab === 'kanban' && <KanbanView onSelect={onSelect} />}
      {tab === 'table' && <TableView onSelect={onSelect} />}
      {tab === 'cards' && <CardsView onSelect={onSelect} />}
    </div>
  );
}

