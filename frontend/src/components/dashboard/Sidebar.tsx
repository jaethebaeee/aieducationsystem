import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FlagIcon,
  PencilSquareIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  CpuChipIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const NAV: Array<{ key: string; label: string; icon: React.ComponentType<any>; href: string }> = [
  { key: 'targets', label: 'Targets', icon: FlagIcon, href: '/dashboard' },
  { key: 'essays', label: 'Essays', icon: PencilSquareIcon, href: '/dashboard' },
  { key: 'universities', label: 'Universities', icon: BuildingLibraryIcon, href: '/dashboard' },
  { key: 'resources', label: 'Resources', icon: BookOpenIcon, href: '/dashboard' },
  { key: 'assistant', label: 'AI Assistant', icon: CpuChipIcon, href: '/dashboard' },
  { key: 'settings', label: 'Settings', icon: Cog6ToothIcon, href: '/dashboard/settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="h-14 px-4 flex items-center font-semibold text-gray-900">
        <img src="/logo.svg" alt="AdmitAI" className="h-6 w-6 mr-2" />
        AdmitAI
      </div>
      <nav className="flex-1 overflow-auto px-2">
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => navigate(n.href)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-gray-800 hover:bg-gray-50 ${location.pathname === n.href ? 'bg-gray-100 ring-1 ring-inset ring-gray-200' : ''}`}
          >
            <n.icon className="w-5 h-5 text-gray-600" />
            <span className="text-sm">{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-3 text-xs text-gray-500">© {new Date().getFullYear()}</div>
    </aside>
  );
}

