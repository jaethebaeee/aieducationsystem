import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { UIProvider } from './contexts/UIContext';
import ScaleNavigation from './components/Navigation/ScaleNavigation';
import ScaleFooter from './components/layout/ScaleFooter';
import VideoDemo from './components/common/VideoDemo';
import { PrivacyPolicyPage, TermsOfServicePage, CookiePolicyPage, DataProtectionPage } from './pages/legal';
import CookieBanner from './components/analytics/CookieBanner';
import ParityDashboard from './pages/seo/ParityDashboard';

// Pages
import LandingPage from './pages/LandingPage';
import ScaleLanding from './pages/ScaleLanding';
// import ComprehensiveDashboard from './pages/dashboard/ComprehensiveDashboard';
// import StudentDashboard from './pages/dashboard/StudentDashboard';
import DashboardPage from './pages/dashboard/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
const UniversityWeatherPage = lazy(() => import(/* webpackChunkName: "university-weather" */ './pages/UniversityWeatherPage'));
const EssayListPage = lazy(() => import(/* webpackChunkName: "essay-list" */ './pages/essays/EssayListPage'));
const EssayEditorPage = lazy(() => import(/* webpackChunkName: "essay-editor" */ './pages/essays/EssayEditorPage'));
const GrammarTestPage = lazy(() => import(/* webpackChunkName: "grammar-test" */ './pages/grammar-test'));
const ResourcesHubPage = lazy(() => import(/* webpackChunkName: "resources-hub" */ './pages/resources/ResourcesHubPage'));
const MentorPage = lazy(() => import(/* webpackChunkName: "mentor" */ './pages/mentor/MentorPage'));
const ProfilePage = lazy(() => import(/* webpackChunkName: "profile" */ './pages/profile/ProfilePage'));
const CommunityPage = lazy(() => import(/* webpackChunkName: "community" */ './pages/community/CommunityPage'));
const PricingPage = lazy(() => import(/* webpackChunkName: "pricing" */ './pages/PricingPage'));
const AboutPage = lazy(() => import(/* webpackChunkName: "about" */ './pages/AboutPage'));
const CareersPage = lazy(() => import(/* webpackChunkName: "careers" */ './pages/CareersPage'));
const JobApplyPage = lazy(() => import(/* webpackChunkName: "job-apply" */ './pages/careers/JobApplyPage'));
const ContactPage = lazy(() => import(/* webpackChunkName: "contact" */ './pages/ContactPage'));
const SettingsPage = lazy(() => import(/* webpackChunkName: "settings" */ './pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import(/* webpackChunkName: "not-found" */ './pages/NotFoundPage'));
 
const ForSchoolsPage = lazy(() => import(/* webpackChunkName: "for-schools" */ './pages/for-schools/ForSchoolsPage'));
const MethodologyPage = lazy(() => import(/* webpackChunkName: "methodology" */ './pages/MethodologyPage'));

// Onboarding Pages
const WelcomePage = lazy(() => import(/* webpackChunkName: "onboarding-welcome" */ './pages/onboarding/WelcomePage'));
const GoalSettingPage = lazy(() => import(/* webpackChunkName: "onboarding-goals" */ './pages/onboarding/GoalSettingPage'));
const UniversitySelectionPage = lazy(() => import(/* webpackChunkName: "onboarding-universities" */ './pages/onboarding/UniversitySelectionPage'));
const ProfileCompletionPage = lazy(() => import(/* webpackChunkName: "onboarding-profile" */ './pages/onboarding/ProfileCompletionPage'));
const AdvisorOnboarding = lazy(() => import(/* webpackChunkName: "onboarding-advisor" */ './pages/onboarding/AdvisorOnboarding'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const bypass = process.env.REACT_APP_BYPASS_AUTH === 'true' || process.env.NODE_ENV !== 'production';
  if (bypass) return <>{children}</>;
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Redirect authenticated users away from auth pages
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// Layout Component (opt-in dark theme)
  const Layout: React.FC<{ children: React.ReactNode; showHeader?: boolean; showFooter?: boolean; theme?: 'dark' | 'light' }> = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  theme = 'dark'
}) => {
  const rootClass = theme === 'dark' 
    ? 'dark-theme min-h-screen flex flex-col bg-black'
    : 'min-h-screen flex flex-col bg-[var(--color-bg-secondary)]';
  return (
    <div className={rootClass}>
      {showHeader && <ScaleNavigation />}
      <main className={`flex-1 ${showHeader ? 'pt-20 sm:pt-24' : ''}`}>
        {children}
      </main>
      {showFooter && <ScaleFooter />}
    </div>
  );
};

const App: React.FC = () => {
  const [videoDemoOpen, setVideoDemoOpen] = useState(false);
  const [videoType] = useState<'platform-overview' | 'university-research' | 'essay-analysis' | 'financial-planning'>('platform-overview');

  // const handleVideoDemo = (type: typeof videoType) => {
  //   setVideoType(type);
  //   setVideoDemoOpen(true);
  // };

  return (
    <LanguageProvider>
      <AuthProvider>
        <UIProvider>
          <Router>
            <div className="App">
              <CookieBanner />
              <Suspense fallback={<div className="text-white p-8">Loading…</div>}>
                <Routes>
                {/* Public Routes */}
                <Route 
                  path="/" 
                  element={<ScaleLanding />}
                />
                <Route 
                  path="/schools" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <ForSchoolsPage />
                    </Layout>
                  }
                />
                <Route 
                  path="/methodology" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <MethodologyPage />
                    </Layout>
                  } 
                />

                <Route 
                  path="/onboarding/advisor" 
                  element={
                    <Layout showHeader={true} showFooter={false}>
                      <AdvisorOnboarding />
                    </Layout>
                  }
                />

                {/* Legacy landing retained (noindex) */}
                <Route 
                  path="/old" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <LandingPage />
                    </Layout>
                  } 
                />
                
                <Route 
                  path="/login" 
                  element={
                    <Layout showHeader={false} showFooter={false} theme="light">
                      <GuestRoute>
                        <LoginPage />
                      </GuestRoute>
                    </Layout>
                  } 
                />
                
                <Route 
                  path="/register" 
                  element={
                    <Layout showHeader={false} showFooter={false} theme="light">
                      <GuestRoute>
                        <RegisterPage />
                      </GuestRoute>
                    </Layout>
                  } 
                />

                <Route 
                  path="/pricing" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <PricingPage />
                    </Layout>
                  } 
                />

                <Route 
                  path="/about" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <AboutPage />
                    </Layout>
                  } 
                />

                <Route 
                  path="/careers" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <CareersPage />
                    </Layout>
                  } 
                />
                <Route 
                  path="/contact" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <ContactPage />
                    </Layout>
                  } 
                />
                {/* Legal Pages (public, indexable) */}
                <Route 
                  path="/privacy" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <PrivacyPolicyPage />
                    </Layout>
                  } 
                />
                <Route 
                  path="/terms" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <TermsOfServicePage />
                    </Layout>
                  } 
                />
                <Route 
                  path="/cookies" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <CookiePolicyPage />
                    </Layout>
                  } 
                />
                <Route 
                  path="/data-protection" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <DataProtectionPage />
                    </Layout>
                  } 
                />
                <Route 
                  path="/careers/apply/:slug" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <JobApplyPage />
                    </Layout>
                  } 
                />

                {/* Onboarding Routes */}
                <Route 
                  path="/onboarding/welcome" 
                  element={
                    <Layout showHeader={true} showFooter={false}>
                      <WelcomePage />
                    </Layout>
                  } 
                />

                <Route 
                  path="/onboarding/goals" 
                  element={
                    <Layout showHeader={true} showFooter={false}>
                      <GoalSettingPage />
                    </Layout>
                  } 
                />

                <Route 
                  path="/onboarding/universities" 
                  element={
                    <Layout showHeader={true} showFooter={false}>
                      <UniversitySelectionPage />
                    </Layout>
                  } 
                />

                <Route 
                  path="/onboarding/profile" 
                  element={
                    <Layout showHeader={true} showFooter={false}>
                      <ProfileCompletionPage />
                    </Layout>
                  } 
                />

                {/* Protected Routes */}
                <Route 
                  path="/dashboard/*" 
                  element={
                    <ProtectedRoute>
                      {/* Dashboard has its own internal shell/navigation */}
                      <Layout showHeader={false} showFooter={false} theme="light">
                        <DashboardPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                >
                  <Route index element={<div />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route 
                  path="/universities" 
                  element={
                    <ProtectedRoute>
                      <Layout showHeader={true} showFooter={true}>
                        <UniversityWeatherPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/essays" 
                  element={
                    <ProtectedRoute>
                      <Layout showHeader={true} showFooter={true}>
                        <EssayListPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/essays/:id" 
                  element={
                    <ProtectedRoute>
                      <Layout showHeader={true} showFooter={false}>
                        <EssayEditorPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/essays/new" 
                  element={
                    <ProtectedRoute>
                      <Layout showHeader={true} showFooter={false}>
                        <EssayEditorPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/grammar-test" 
                  element={
                    <ProtectedRoute>
                      <Layout showHeader={true} showFooter={true}>
                        <GrammarTestPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/resources" 
                  element={
                    <ProtectedRoute>
                      <Layout showHeader={true} showFooter={true}>
                        <ResourcesHubPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/mentor" 
                  element={
                    <ProtectedRoute>
                      <Layout showHeader={true} showFooter={true}>
                        <MentorPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Layout showHeader={true} showFooter={true}>
                        <ProfilePage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/community" 
                  element={
                    <ProtectedRoute>
                      <Layout showHeader={true} showFooter={true}>
                        <CommunityPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                {/* Internal SEO metrics (noindex via PrivateSEO) */}
                <Route 
                  path="/seo/parity" 
                  element={
                    <ProtectedRoute>
                      <Layout showHeader={true} showFooter={true}>
                        <ParityDashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                {/* Catch-all 404 */}
                <Route 
                  path="*" 
                  element={
                    <Layout showHeader={true} showFooter={true}>
                      <NotFoundPage />
                    </Layout>
                  } 
                />
                </Routes>
              </Suspense>

              {/* Video Demo Modal */}
              <VideoDemo
                isOpen={videoDemoOpen}
                onClose={() => setVideoDemoOpen(false)}
                videoType={videoType}
              />
            </div>
          </Router>
        </UIProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App; 