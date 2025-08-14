import React from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../../components/dashboard/AppShell';
import DashboardHome from './DashboardHome';
import SettingsPage from '../settings/SettingsPage';
import ApplicationTimelinePage from './ApplicationTimelinePage';

export default function DashboardPage() {
  return (
    <>
      <PrivateSEO language="ko" />
      <Routes>
        <Route index element={<AppShell><DashboardHome /></AppShell>} />
        <Route path="settings" element={<AppShell><SettingsPage /></AppShell>} />
        <Route path="timeline" element={<AppShell><ApplicationTimelinePage /></AppShell>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}