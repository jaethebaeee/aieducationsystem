import { paymentsAPI } from './api';

export type SubscriptionState = {
  loading: boolean;
  active: boolean;
  plan?: string;
  features?: string[];
  raw?: any;
};

let cached: SubscriptionState | null = null;
let inflight: Promise<SubscriptionState> | null = null;

export async function fetchSubscription(force = false): Promise<SubscriptionState> {
  if (!force && cached && !cached.loading) return cached;
  if (inflight) return inflight;
  inflight = paymentsAPI.getSubscription()
    .then((res) => {
      const data = res.data;
      const now = new Date();
      const active = Boolean(
        data && data.status === 'ACTIVE' && (!data.endDate || new Date(data.endDate) > now)
      );
      cached = { loading: false, active, plan: data?.plan, features: data?.features, raw: data };
      return cached;
    })
    .catch(() => {
      cached = { loading: false, active: false };
      return cached;
    })
    .finally(() => { inflight = null; });
  return inflight;
}

export function getCachedSubscription(): SubscriptionState | null {
  return cached;
}

export async function createSubscription(planId: 'basic' | 'premium' | 'enterprise'): Promise<SubscriptionState> {
  await paymentsAPI.createSubscription(planId);
  return fetchSubscription(true);
}

