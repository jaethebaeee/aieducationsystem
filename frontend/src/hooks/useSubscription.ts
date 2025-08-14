import { useEffect, useState, useCallback } from 'react';
import { fetchSubscription, getCachedSubscription, createSubscription, SubscriptionState } from '../services/subscriptionService';

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>(() => getCachedSubscription() || { loading: true, active: false });

  const refresh = useCallback(async (force = false) => {
    setState((s) => ({ ...s, loading: true }));
    const next = await fetchSubscription(force);
    setState(next);
    return next;
  }, []);

  const upgrade = useCallback(async (planId: 'basic' | 'premium' | 'enterprise') => {
    const next = await createSubscription(planId);
    setState(next);
    return next;
  }, []);

  useEffect(() => {
    if (!getCachedSubscription()) {
      void refresh();
    }
  }, [refresh]);

  return { ...state, refresh, upgrade };
}

