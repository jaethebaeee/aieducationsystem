import React from 'react';

export default function HomeView({ onSelect }: { onSelect: (item: { type: 'school' | 'essay'; id: string }) => void }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border bg-white/5 border-white/10 p-4 text-white">
        <h3 className="font-semibold mb-2">Quick Actions</h3>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500" onClick={() => onSelect({ type: 'essay', id: 'new' })}>New Essay</button>
          <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15" onClick={() => onSelect({ type: 'school', id: 'harvard' })}>Harvard Pulse</button>
        </div>
      </div>
      <div className="rounded-xl border bg-white/5 border-white/10 p-4 text-white">
        <h3 className="font-semibold mb-2">Tips</h3>
        <p className="text-white/70 text-sm">Use ⌘K to open the command palette. Add targets to personalize insights.</p>
      </div>
    </div>
  );
}

