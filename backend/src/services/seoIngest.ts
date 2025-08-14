import fs from 'fs';
import path from 'path';

export type Engine = 'google' | 'bing' | 'naver';

type Row = { path: string; engine: Engine; impressions: number; clicks: number; ctr: number };

export function writeParitySnapshot(rows: Row[], outputDir = 'monitoring/seo'): void {
  const byPath: Record<string, any> = {};
  for (const r of rows) {
    if (!byPath[r.path]) byPath[r.path] = { path: r.path, google: null as any, bing: null as any, naver: null as any };
    byPath[r.path][r.engine] = { impressions: r.impressions, clicks: r.clicks, ctr: r.ctr };
  }
  const pages = Object.values(byPath);
  const payload = {
    generatedAt: new Date().toISOString(),
    pages,
    parityThresholds: {
      naverToGoogleImpressions: 0.6,
      naverToGoogleClicks: 0.6,
      bingToGoogleImpressions: 0.15,
      bingToGoogleClicks: 0.15,
    },
  };
  const filePath = path.resolve(process.cwd(), outputDir, 'sample-parity.json');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

