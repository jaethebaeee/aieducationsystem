import React from 'react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

export default function CardsView({ onSelect }: { onSelect: (x: { type: 'essay'; id: string }) => void }) {
  const essays = [
    { id: 'mit_ps', school: 'MIT', title: 'Personal Statement', stage: 'Outline', progress: 40 },
    { id: 'col_supp1', school: 'Columbia', title: 'Why Columbia', stage: 'Draft', progress: 65 },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {essays.map((e) => (
        <Card key={e.id} className="p-4 cursor-pointer hover:shadow-sm" variant="dark" border onClick={() => onSelect({ type: 'essay', id: e.id }) as any}>
          <div className="flex items-center justify-between">
            <div className="font-semibold">{e.school}</div>
            <Badge size="sm" variant="gray">{e.stage}</Badge>
          </div>
          <div className="mt-1 text-sm">{e.title}</div>
          <div className="mt-3 h-2 rounded bg-white/10">
            <div className="h-2 rounded bg-indigo-600" style={{ width: `${e.progress}%` }} />
          </div>
          <div className="mt-2 text-xs text-white/70">Open feedback / coach tips</div>
        </Card>
      ))}
    </div>
  );
}

