import { useRef, useState } from 'react';
import { ragInsights } from '../lib/api/rag';

const cache = new Map<string, any>();
export function useRagInsights() {
  const [state, setState] = useState<{ key?: string; data?: any; loading?: boolean; error?: string }>({});
  const timer = useRef<number | undefined>();
  const run = (input: Parameters<typeof ragInsights>[0], debounce = 250) => {
    const key = JSON.stringify(input);
    if (cache.has(key)) return setState({ key, data: cache.get(key), loading: false });
    setState((s) => ({ ...s, key, loading: true, error: undefined }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        const data = await ragInsights(input);
        cache.set(key, data);
        setState({ key, data, loading: false });
      } catch (e: any) {
        setState({ key, error: e?.message || 'Failed to fetch insights', loading: false });
      }
    }, debounce);
  };
  return { ...state, run };
}

