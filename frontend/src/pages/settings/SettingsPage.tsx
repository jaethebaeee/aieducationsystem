import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAssistantSettings, PersonaKey, PersonaSetting } from '../../stores/useAssistantSettings';
import { useNotificationSettings } from '../../stores/useNotificationSettings';
import { useUI } from '../../contexts/UIContext';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const translations = {
  en: {
    title: 'Settings',
    languageSection: 'Language',
    selectLanguage: 'Select language',
    assistantSection: 'AI Assistant Preferences',
    persona: 'Persona',
    tone: 'Tone',
    detail: 'Detail',
    assistantLanguage: 'Assistant Language',
    tones: { formal: 'Formal', casual: 'Casual' },
    details: { brief: 'Brief', normal: 'Normal', thorough: 'Thorough' },
    personas: { general: 'General', essay: 'Essay', policy: 'Policy', aid: 'Financial Aid' },
    themeSection: 'Theme',
    theme: 'App theme',
    themes: { light: 'Light', dark: 'Dark' },
    notificationsSection: 'Notifications',
    email: 'Email', push: 'Push', sms: 'SMS', marketing: 'Marketing',
    billingSection: 'Billing',
    subscription: 'Subscription',
    currentPlan: 'Current plan',
    viewPlans: 'View Plans',
  },
  ko: {
    title: '설정',
    languageSection: '언어',
    selectLanguage: '언어 선택',
    assistantSection: 'AI 어시스턴트 설정',
    persona: '페르소나',
    tone: '말투',
    detail: '상세도',
    assistantLanguage: '어시스턴트 언어',
    tones: { formal: '격식체', casual: '반말' },
    details: { brief: '간결', normal: '보통', thorough: '자세히' },
    personas: { general: '일반', essay: '에세이', policy: '정책', aid: '재정 보조' },
    themeSection: '테마',
    theme: '앱 테마',
    themes: { light: '라이트', dark: '다크' },
    notificationsSection: '알림',
    email: '이메일', push: '푸시', sms: '문자', marketing: '마케팅',
    billingSection: '결제',
    subscription: '구독',
    currentPlan: '현재 요금제',
    viewPlans: '요금제 보기',
  }
};

type Lang = keyof typeof translations;

const personaOrder: PersonaKey[] = ['general', 'essay', 'policy', 'aid'];

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[(language as Lang)] || translations.en;

  // Assistant persona settings
  const getPersonaSetting = useAssistantSettings((s) => s.getPersonaSetting);
  const setPersonaSetting = useAssistantSettings((s) => s.setPersonaSetting);

  // Theme
  const { theme, toggleTheme } = useUI();

  // Notifications
  const notif = useNotificationSettings();

  // Billing (simple fetch of current plan if endpoint exists; fallback to none)
  const [currentPlan, setCurrentPlan] = React.useState<string | null>(null);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get<{ plan?: string }>('/payments/subscription');
        if (mounted && res?.data?.plan) setCurrentPlan(res.data.plan);
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  const handleChangePersona = (key: PersonaKey, partial: Partial<PersonaSetting>) => {
    const current = getPersonaSetting(key);
    setPersonaSetting(key, { ...current, ...partial });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>

      {/* Language */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.languageSection}</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700" htmlFor="app-language">{t.selectLanguage}</label>
          <select
            id="app-language"
            className="rounded-md border px-3 py-2 text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ko">한국어</option>
          </select>
        </div>
      </section>

      {/* Theme */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.themeSection}</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700" htmlFor="theme-select">{t.theme}</label>
          <select
            id="theme-select"
            className="rounded-md border px-3 py-2 text-sm"
            value={theme}
            onChange={toggleTheme}
          >
            <option value="light">{t.themes.light}</option>
            <option value="dark">{t.themes.dark}</option>
          </select>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.notificationsSection}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['email','push','sms','marketing'] as const).map((k) => (
            <label key={k} className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" checked={notif[k]} onChange={() => notif.toggle(k)} />
              <span className="text-sm text-gray-800">{t[k]}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Assistant Personas */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.assistantSection}</h2>
        <div className="divide-y">
          {personaOrder.map((key) => {
            const setting = getPersonaSetting(key);
            return (
              <div key={key} className="py-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div className="text-sm font-medium text-gray-800">
                  {t.personas[key]}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700 w-24">{t.tone}</label>
                  <select
                    className="flex-1 rounded-md border px-2 py-2 text-sm"
                    value={setting.tone}
                    onChange={(e) => handleChangePersona(key, { tone: e.target.value as PersonaSetting['tone'] })}
                  >
                    <option value="formal">{t.tones.formal}</option>
                    <option value="casual">{t.tones.casual}</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700 w-24">{t.detail}</label>
                  <select
                    className="flex-1 rounded-md border px-2 py-2 text-sm"
                    value={setting.detail}
                    onChange={(e) => handleChangePersona(key, { detail: e.target.value as PersonaSetting['detail'] })}
                  >
                    <option value="brief">{t.details.brief}</option>
                    <option value="normal">{t.details.normal}</option>
                    <option value="thorough">{t.details.thorough}</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700 w-24">{t.assistantLanguage}</label>
                  <select
                    className="flex-1 rounded-md border px-2 py-2 text-sm"
                    value={setting.language}
                    onChange={(e) => handleChangePersona(key, { language: e.target.value as PersonaSetting['language'] })}
                  >
                    <option value="en">English</option>
                    <option value="ko">한국어</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Billing */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.billingSection}</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-700">{t.subscription}</div>
            <div className="text-base font-medium text-gray-900">
              {t.currentPlan}: {currentPlan ?? '—'}
            </div>
          </div>
          <button
            onClick={() => navigate('/pricing')}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            {t.viewPlans}
          </button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage; 