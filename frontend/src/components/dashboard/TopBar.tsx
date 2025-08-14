import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TopBar({ onOpenChat, onOpenPalette }: { onOpenChat: () => void; onOpenPalette: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('cmdk:toggle'));
        document.dispatchEvent(new CustomEvent('palette:toggle'));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="sticky top-0 z-20 h-14 border-b border-white/10 bg-black/70 backdrop-blur px-4 flex items-center gap-3">
      <div className="flex-1 relative">
        <input className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 px-3 py-2 pr-10" placeholder="Search schools, essays, resources…" />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/60">⌘K</span>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <button className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 text-xs">Cycles</button>
        <button className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 text-xs">Stages</button>
        <button className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 text-xs">Targets</button>
      </div>
      {/* Right-aligned primary nav */}
      <nav className="hidden md:flex items-center gap-3 ml-2">
        {(() => {
          const dashTab = (() => { try { return localStorage.getItem('dash_tab') || ''; } catch { return ''; } })();
          const isDash = location.pathname.startsWith('/dashboard');
          const cls = (active: boolean) => `text-sm ${active ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`;
          return (
            <>
              <button
                onClick={() => { try { localStorage.setItem('dash_tab', 'kanban'); } catch {} navigate('/dashboard'); }}
                className={cls(isDash && (dashTab === 'kanban' || dashTab === 'home'))}
              >
                Targets
              </button>
              <button
                onClick={() => { try { localStorage.setItem('dash_tab', 'cards'); } catch {} navigate('/dashboard'); }}
                className={cls((isDash && dashTab === 'cards') || location.pathname.startsWith('/essays'))}
              >
                Essays
              </button>
              <button
                onClick={() => { try { localStorage.setItem('dash_tab', 'table'); } catch {} navigate('/dashboard'); }}
                className={cls((isDash && dashTab === 'table') || location.pathname.startsWith('/universities'))}
              >
                Universities
              </button>
              <button
                onClick={() => navigate('/resources')}
                className={cls(location.pathname.startsWith('/resources'))}
              >
                Resources
              </button>
              <button onClick={() => document.dispatchEvent(new CustomEvent('chat:toggle'))} className={cls(false)}>AI Assistant</button>
              <button onClick={() => navigate('/dashboard/settings')} className={cls(location.pathname.includes('/settings'))}>Settings</button>
            </>
          );
        })()}
      </nav>
      <button onClick={onOpenPalette} className="rounded-lg border border-white/10 text-white hover:bg-white/10 px-3 py-2">⌘K</button>
      <button onClick={onOpenChat} className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-white">
        Open Chat
      </button>
      <img alt="me" src="/avatar.png" className="h-8 w-8 rounded-full" />
    </div>
  );
}

