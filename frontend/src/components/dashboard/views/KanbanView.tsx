import React from 'react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

// stub data; swap with your API
const COLUMNS = ['Researching', 'Drafting', 'Submitted', 'Waiting', 'Admitted'];
const items = [
  { id: 'mit', title: 'MIT', fit: 82, deadline: 'Nov 1', stage: 'Researching' },
  { id: 'columbia', title: 'Columbia', fit: 74, deadline: 'Nov 1', stage: 'Drafting' },
];

export default function KanbanView({ onSelect }: { onSelect: (x: { type: 'school'; id: string }) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {COLUMNS.map((col) => (
        <Card key={col} className="p-3" variant="dark" border>
          <div className="mb-2 text-sm font-medium text-white">{col}</div>
          <div className="space-y-2">
            {items
              .filter((i) => i.stage === col)
              .map((i) => (
                <button
                  key={i.id}
                  onClick={() => onSelect({ type: 'school', id: i.id })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{i.title}</div>
                    <Badge size="sm" variant="emerald">{i.fit}% fit</Badge>
                  </div>
                  <div className="mt-1 text-xs text-white/60">Deadline: {i.deadline}</div>
                  <div className="mt-2 text-xs text-white/70">Latest AI insight • Click to open</div>
                </button>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

