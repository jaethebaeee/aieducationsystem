import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  className?: string;
}

const ScaleNavigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [aiStatus, setAiStatus] = useState<null | {
    agenticSeek: { enabled: boolean; healthy: boolean };
    openai: { enabled: boolean; configured: boolean; baseUrl: string };
    recommendedProvider: string;
  }>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [providerChoice, setProviderChoice] = useState<'local' | 'openai-like'>(() => (localStorage.getItem('ai-provider') as any) || 'local');
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState<string>(() => localStorage.getItem('openai-base-url') || '');
  const [openaiModel, setOpenaiModel] = useState<string>(() => localStorage.getItem('openai-model') || 'gpt-4o-mini');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch AI status (requires auth in backend; works when logged in)
    fetch('/api/agentic-seek/status', { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res?.success) {
          setAiStatus(res.data);
        }
      })
      .catch(() => void 0);
  }, []);

  const saveAiConfig = () => {
    localStorage.setItem('ai-provider', providerChoice);
    localStorage.setItem('openai-base-url', openaiBaseUrl);
    localStorage.setItem('openai-model', openaiModel);
    setModalOpen(false);
  };

  const statusPill = (() => {
    if (!aiStatus) return null;
    if (providerChoice === 'local') {
      const healthy = aiStatus.agenticSeek?.healthy;
      return (
        <span className={`px-2 py-0.5 rounded-full text-[11px] ${healthy ? 'bg-green-500/15 text-green-300' : 'bg-yellow-500/15 text-yellow-300'}`} title={healthy ? 'Local LLM Active' : 'Local LLM Checking…'}>
          {healthy ? 'Local LLM Active' : 'Local LLM Checking…'}
        </span>
      );
    }
    const base = openaiBaseUrl || aiStatus.openai?.baseUrl || '';
    const configured = aiStatus.openai?.configured || !!openaiBaseUrl;
    return (
      <span className={`px-2 py-0.5 rounded-full text-[11px] ${configured ? 'bg-blue-500/15 text-blue-300' : 'bg-red-500/15 text-red-300'}`} title={configured ? `OpenAI-compatible: ${base}` : 'OpenAI-compatible: not configured'}>
        {configured ? `OpenAI-compatible: ${base.replace(/^https?:\/\//, '')}` : 'OpenAI-compatible: not configured'}
      </span>
    );
  })();

  const linkBase =
    'relative text-text-secondary hover:text-white transition-colors duration-200 font-medium text-sm after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:rounded-full after:bg-white/60 after:transition-all after:duration-300';
  const linkActive = 'text-white after:w-full';
  const isActive = (path: string) => location.pathname.startsWith(path);

  // Normalize role and plan for cross-backend compatibility
  const normalizedRole = (user?.role as unknown as string | undefined)?.toString().toLowerCase() as
    | 'student'
    | 'parent'
    | 'mentor'
    | 'admin'
    | undefined;
  const normalizedPlan = (user?.subscription?.plan as unknown as string | undefined)?.toString().toLowerCase();
  const isFreePlan = normalizedPlan === 'free' || normalizedPlan === 'basic' || (typeof user?.subscription?.plan === 'string' && user?.subscription?.plan.toUpperCase() === 'FREE');

  // Dismiss mobile sheet with ESC
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  // Close user menu on outside click or ESC
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [userMenuOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/75 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]' 
        : 'bg-black/70 backdrop-blur-2xl border-b border-white/10'
    } ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white font-semibold text-xl">AdmitAI</span>
            </Link>
          </div>

          {/* Navigation Links (role-aware) */}
          <div className="hidden md:flex items-center space-x-6 xl:space-x-8">
            <Link 
              to="/dashboard" 
              className={`${linkBase} ${isActive('/dashboard') ? linkActive : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/universities" 
              className={`${linkBase} ${isActive('/universities') ? linkActive : ''}`}
            >
              Universities
            </Link>
            {normalizedRole !== 'mentor' && (
              <Link 
                to="/essays" 
                className={`${linkBase} ${isActive('/essays') ? linkActive : ''}`}
              >
                Essays
              </Link>
            )}
            <Link 
              to="/resources" 
              className={`${linkBase} ${isActive('/resources') ? linkActive : ''}`}
            >
              Resources
            </Link>
            <Link 
              to="/pricing" 
              className={`${linkBase} ${isActive('/pricing') ? linkActive : ''}`}
            >
              Pricing
            </Link>
            <Link 
              to="/careers" 
              className={`${linkBase} ${isActive('/careers') ? linkActive : ''}`}
            >
              Careers
            </Link>
            {normalizedRole === 'mentor' && (
              <Link 
                to="/mentor" 
                className={`${linkBase} ${isActive('/mentor') ? linkActive : ''}`}
              >
                Mentor
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <span className="hidden lg:inline-flex">{statusPill}</span>
            <button
              onClick={() => setModalOpen(true)}
              className="hidden sm:inline-flex items-center px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-xs transition-all"
            >
              AI Settings
            </button>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hidden sm:inline-flex items-center px-4 py-2 border border-white/20 text-text-secondary hover:text-white hover:border-white/40 rounded-lg font-medium text-sm transition-all duration-200">
                  Log In
                </Link>
                <Link to="/onboarding/advisor" className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-[0_6px_24px_-6px_rgba(168,85,247,0.45)]">
                  Get Started Free →
                </Link>
              </>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm"
                >
                  <span className="inline-flex w-6 h-6 rounded-full bg-purple-500 text-white items-center justify-center text-xs">
                    {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{user?.firstName || user?.email}</span>
                </button>
                {isFreePlan && (
                  <Link to="/pricing" className="hidden sm:inline-flex ml-2 items-center px-3 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg font-semibold text-xs transition-all duration-200">
                    Upgrade
                  </Link>
                )}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#0d0d10] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10" onClick={() => setUserMenuOpen(false)}>
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10" onClick={() => setUserMenuOpen(false)}>
                      Settings
                    </Link>
                    {!isFreePlan && (
                      <Link to="/pricing" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10" onClick={() => setUserMenuOpen(false)}>
                        Manage Plan
                      </Link>
                    )}
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-white/10"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Mobile hamburger */}
            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/15 text-white"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              ☰
            </button>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md bg-[#0d0d10] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">AI Provider Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-text-secondary text-sm">Provider</label>
                <select
                  className="w-full mt-1 bg-[#0b0b0e] border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                  value={providerChoice}
                  onChange={(e) => setProviderChoice(e.target.value as any)}
                >
                  <option value="local">Local (AgenticSeek)</option>
                  <option value="openai-like">OpenAI-compatible (Ollama/vLLM/LocalAI)</option>
                </select>
              </div>
              {providerChoice === 'openai-like' && (
                <>
                  <div>
                    <label className="text-text-secondary text-sm">Base URL</label>
                    <input
                      className="w-full mt-1 bg-[#0b0b0e] border border-white/10 rounded-lg p-3.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                      placeholder="http://localhost:11434/v1"
                      value={openaiBaseUrl}
                      onChange={(e) => setOpenaiBaseUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-text-secondary text-sm">Model</label>
                    <input
                      className="w-full mt-1 bg-[#0b0b0e] border border-white/10 rounded-lg p-3.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                      placeholder="llama3:instruct"
                      value={openaiModel}
                      onChange={(e) => setOpenaiModel(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 border border-white/20 text-text-secondary hover:text-white hover:border-white/40 rounded-lg text-sm">Cancel</button>
                <button onClick={saveAiConfig} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div
            className="absolute top-0 left-0 right-0 bg-[#0d0d10] border-b border-white/10 rounded-b-2xl shadow-2xl p-4 pt-16 will-change-transform"
            style={{ transform: `translateY(${dragY}px)`, transition: touchStartY ? 'none' : 'transform 180ms ease' }}
            onTouchStart={(e) => {
              setTouchStartY(e.touches[0].clientY);
              setDragY(0);
            }}
            onTouchMove={(e) => {
              if (touchStartY === null) return;
              const dy = e.touches[0].clientY - touchStartY;
              setDragY(Math.max(0, dy));
            }}
            onTouchEnd={() => {
              if (dragY > 80) setMobileOpen(false);
              setTouchStartY(null);
              setDragY(0);
            }}
          >
            <div className="flex flex-col space-y-2">
              <Link onClick={() => setMobileOpen(false)} to="/dashboard" className="px-3 py-3 rounded-lg text-white/90 hover:bg-white/10">Dashboard</Link>
              <Link onClick={() => setMobileOpen(false)} to="/universities" className="px-3 py-3 rounded-lg text-white/90 hover:bg-white/10">Universities</Link>
              {normalizedRole !== 'mentor' && (
                <Link onClick={() => setMobileOpen(false)} to="/essays" className="px-3 py-3 rounded-lg text-white/90 hover:bg-white/10">Essays</Link>
              )}
              <Link onClick={() => setMobileOpen(false)} to="/resources" className="px-3 py-3 rounded-lg text-white/90 hover:bg-white/10">Resources</Link>
              <Link onClick={() => setMobileOpen(false)} to="/pricing" className="px-3 py-3 rounded-lg text-white/90 hover:bg-white/10">Pricing</Link>
              <Link onClick={() => setMobileOpen(false)} to="/careers" className="px-3 py-3 rounded-lg text-white/90 hover:bg-white/10">Careers</Link>
              {normalizedRole === 'mentor' && (
                <Link onClick={() => setMobileOpen(false)} to="/mentor" className="px-3 py-3 rounded-lg text-white/90 hover:bg-white/10">Mentor</Link>
              )}
              {!isAuthenticated ? (
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <Link onClick={() => setMobileOpen(false)} to="/login" className="px-3 py-3 rounded-lg border border-white/15 text-white/90 hover:bg-white/10 text-center">Log In</Link>
                  <Link onClick={() => setMobileOpen(false)} to="/onboarding/advisor" className="px-3 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-center">Get Started</Link>
                </div>
              ) : (
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <Link onClick={() => setMobileOpen(false)} to="/profile" className="px-3 py-3 rounded-lg border border-white/15 text-white/90 hover:bg-white/10 text-center">Profile</Link>
                  {isFreePlan ? (
                    <Link onClick={() => setMobileOpen(false)} to="/pricing" className="px-3 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-center">Upgrade</Link>
                  ) : (
                    <button
                      onClick={() => { setMobileOpen(false); logout(); }}
                      className="px-3 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-center"
                    >
                      Log Out
                    </button>
                  )}
                </div>
              )}
              <button onClick={() => setMobileOpen(false)} className="mt-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ScaleNavigation;