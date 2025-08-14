import React, { useEffect, useState } from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';

type EngineStats = { impressions: number; clicks: number; ctr: number };
type PageRow = { path: string; google: EngineStats; bing: EngineStats; naver: EngineStats };

type ApiResponse = {
  success: boolean;
  data: {
    generatedAt: string;
    windows: string[];
    pages: PageRow[];
    parityThresholds: Record<string, number>;
  };
};

function ratio(a: number, b: number): number {
  if (!b) return 0;
  return +(a / b).toFixed(2);
}

export default function ParityDashboard(): JSX.Element {
  const [rows, setRows] = useState<PageRow[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string>('');

  useEffect(() => {
    fetch('/api/seo/parity')
      .then((r) => r.json())
      .then((json: ApiResponse) => {
        if (json.success) {
          setRows(json.data.pages);
          setGeneratedAt(json.data.generatedAt);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <PrivateSEO title="SEO Parity Dashboard" language="en" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold mb-2">Naver/Bing Parity vs Google</h1>
        <p className="text-white/60 mb-8">Generated: {generatedAt ? new Date(generatedAt).toLocaleString() : '—'}</p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead>
              <tr className="bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-semibold">Path</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Google Impr</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Naver Impr</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Naver/Google</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Bing Impr</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Bing/Google</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Google CTR</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Naver CTR</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Bing CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((r) => {
                const nRatio = ratio(r.naver.impressions, r.google.impressions);
                const bRatio = ratio(r.bing.impressions, r.google.impressions);
                return (
                  <tr key={r.path} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm font-mono">{r.path}</td>
                    <td className="px-4 py-3 text-sm text-right">{r.google.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right">{r.naver.impressions.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-sm text-right ${nRatio >= 0.6 ? 'text-green-300' : 'text-yellow-300'}`}>{nRatio}</td>
                    <td className="px-4 py-3 text-sm text-right">{r.bing.impressions.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-sm text-right ${bRatio >= 0.15 ? 'text-green-300' : 'text-yellow-300'}`}>{bRatio}</td>
                    <td className="px-4 py-3 text-sm text-right">{r.google.ctr}%</td>
                    <td className="px-4 py-3 text-sm text-right">{r.naver.ctr}%</td>
                    <td className="px-4 py-3 text-sm text-right">{r.bing.ctr}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

