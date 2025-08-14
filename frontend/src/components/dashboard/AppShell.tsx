import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ViewSwitcher from './ViewSwitcher';
import RightDrawer from './RightDrawer';
import ChatbotDock from './ChatbotDock';
import { useWorkspace } from '../../stores/useWorkspace';
import CommandPalette from './CommandPalette';
import { essaysAPI, analysisAPI, resourcesAPI } from '../../services/api';

export default function AppShell({ children }: { children?: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { selection, setSelection } = useWorkspace();
  const [cmdkOpen, setCmdkOpen] = useState(false);

  React.useEffect(() => {
    const onCmdK = () => setCmdkOpen((v) => !v);
    const onPalette = () => setCmdkOpen((v) => !v);
    const onDrawerOpen = () => setDrawerOpen(true);
    document.addEventListener('cmdk:toggle', onCmdK as any);
    document.addEventListener('palette:toggle', onPalette as any);
    document.addEventListener('drawer:open', onDrawerOpen as any);
    return () => {
      document.removeEventListener('cmdk:toggle', onCmdK as any);
      document.removeEventListener('palette:toggle', onPalette as any);
      document.removeEventListener('drawer:open', onDrawerOpen as any);
    };
  }, []);

  // Load data to feed the palette (lightweight, cached in component state)
  const [uniList, setUniList] = useState<Array<{ id: string; name: string }>>([]);
  const [essayList, setEssayList] = useState<Array<{ id: string; title: string }>>([]);
  const [resourceList, setResourceList] = useState<Array<{ id: string; title: string; schoolId?: string }>>([]);

  useEffect(() => {
    // Universities from analysis API
    analysisAPI.getUniversities().then((r) => {
      const names = r.data || [];
      if (Array.isArray(names)) setUniList(names.map((n) => ({ id: n, name: n })));
    }).catch(() => {});
    // Essays
    essaysAPI.getAll().then((r) => {
      const essays = r.data?.essays || [];
      setEssayList(essays.map((e: any) => ({ id: e.id, title: e.title })));
    }).catch(() => {});
    // Resources
    resourcesAPI.getAll().then((r) => {
      const resources = r.data?.resources || [];
      setResourceList(resources.map((x: any) => ({ id: x.id, title: x.title, schoolId: x.schoolId })));
    }).catch(() => {});
  }, []);

  return (
    <div className="h-screen w-screen bg-white text-gray-900">
      <div className="flex h-full">
        <Sidebar />
        <main className="relative flex-1 overflow-hidden">
          <TopBar 
            onOpenChat={() => document.dispatchEvent(new CustomEvent('chat:toggle'))}
            onOpenPalette={() => document.dispatchEvent(new CustomEvent('palette:toggle'))}
          />
          <div className="h-[calc(100%-56px)] overflow-auto p-4 bg-gray-50">
            {children ?? (
              <ViewSwitcher onSelect={(item) => { setSelection(item); setDrawerOpen(true); }} />
            )}
          </div>
        </main>

        <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} selection={selection} />
      </div>

      <ChatbotDock />
      {cmdkOpen && (
        <CommandPalette
          onClose={() => setCmdkOpen(false)}
          universities={uniList}
          essays={essayList}
          resources={resourceList}
        />
      )}
    </div>
  );
}

