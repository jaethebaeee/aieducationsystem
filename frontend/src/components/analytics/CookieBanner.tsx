import React, { useEffect, useState } from 'react';
import { ConsentCookies, updateConsent } from './ConsentManager';

function hasStoredChoice(): boolean {
  const analytics = document.cookie.includes('analytics_consent=');
  const marketing = document.cookie.includes('marketing_consent=');
  const functionality = document.cookie.includes('functionality_consent=');
  return analytics || marketing || functionality;
}

export default function CookieBanner(): JSX.Element | null {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasStoredChoice());
  }, []);

  const acceptAll = (): void => {
    ConsentCookies.set('analytics_consent', true);
    ConsentCookies.set('marketing_consent', true);
    ConsentCookies.set('functionality_consent', true);
    updateConsent({ analytics: true, ads: true, functionality: true });
    setVisible(false);
  };

  const rejectAll = (): void => {
    ConsentCookies.set('analytics_consent', false);
    ConsentCookies.set('marketing_consent', false);
    ConsentCookies.set('functionality_consent', false);
    updateConsent({ analytics: false, ads: false, functionality: false });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
        <div className="rounded-2xl bg-gray-900/95 text-white shadow-2xl border border-white/10 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm sm:text-base text-white/90">
              We use cookies to improve your experience, analyze traffic, and personalize content. You can change your choices anytime in the Cookie Policy.
            </div>
            <div className="flex gap-2 sm:gap-3">
              <a href="/cookies" className="px-4 py-2 rounded-lg border border-white/20 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm">
                Learn more
              </a>
              <button onClick={rejectAll} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm">
                Reject all
              </button>
              <button onClick={acceptAll} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

