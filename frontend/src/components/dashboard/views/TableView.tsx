import React from 'react';
import Card from '../../ui/Card';

export default function TableView({ onSelect }: { onSelect: (x: { type: 'school'; id: string }) => void }) {
  const rows = [
    { id: 'harvard', uni: 'Harvard', fit: 'High', deadline: 'Nov 1' },
    { id: 'mit', uni: 'MIT', fit: 'Medium', deadline: 'Nov 1' },
    { id: 'columbia', uni: 'Columbia', fit: 'Medium', deadline: 'Jan 1' },
  ];
  return (
    <Card className="overflow-hidden" variant="dark" border>
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="bg-white/5 text-white/70">
            <th className="px-3 py-2 text-left">University</th>
            <th className="px-3 py-2 text-left">Fit</th>
            <th className="px-3 py-2 text-left">Deadline</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-white/10 hover:bg-white/5">
              <td className="px-3 py-2">
                <button onClick={() => onSelect({ type: 'school', id: r.id })} className="underline text-white">
                  {r.uni}
                </button>
              </td>
              <td className="px-3 py-2 text-white/80">{r.fit}</td>
              <td className="px-3 py-2 text-white/80">{r.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

