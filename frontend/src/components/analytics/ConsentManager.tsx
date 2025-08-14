import React, { useEffect } from 'react';

function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
}

export type ConsentUpdate = {
  analytics?: boolean;
  ads?: boolean;
  functionality?: boolean;
};

export function updateConsent(update: ConsentUpdate): void {
  const w = window as any;
  if (!w.gtag) return;
  const payload: Record<string, 'granted' | 'denied'> = {};
  if (update.analytics !== undefined) payload.analytics_storage = update.analytics ? 'granted' : 'denied';
  if (update.ads !== undefined) payload.ad_storage = update.ads ? 'granted' : 'denied';
  if (update.functionality !== undefined) payload.functionality_storage = update.functionality ? 'granted' : 'denied';
  w.gtag('consent', 'update', payload);
}

export default function ConsentManager(): JSX.Element | null {
  useEffect(() => {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };

    // Default: deny until user grants
    w.gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      security_storage: 'granted' // security should remain granted
    });

    // Apply stored preferences
    const analyticsConsent = getCookie('analytics_consent');
    const marketingConsent = getCookie('marketing_consent');
    const functionalityConsent = getCookie('functionality_consent');

    const hasAny = analyticsConsent !== null || marketingConsent !== null || functionalityConsent !== null;
    if (hasAny) {
      w.gtag('consent', 'update', {
        analytics_storage: analyticsConsent === 'true' ? 'granted' : 'denied',
        ad_storage: marketingConsent === 'true' ? 'granted' : 'denied',
        functionality_storage: functionalityConsent === 'true' ? 'granted' : 'denied'
      });
    }
  }, []);

  return null;
}

export const ConsentCookies = {
  set(name: 'analytics_consent' | 'marketing_consent' | 'functionality_consent', value: boolean, days = 365) {
    setCookie(name, String(value), days);
  },
  get(name: 'analytics_consent' | 'marketing_consent' | 'functionality_consent') {
    return getCookie(name) === 'true';
  }
};

