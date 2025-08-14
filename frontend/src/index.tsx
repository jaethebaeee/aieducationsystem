import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import ConsentManager from './components/analytics/ConsentManager';
import './i18n'; // Initialize i18n
import './styles/globals.css';
import './styles/scale-globals.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <HelmetProvider>
    <React.StrictMode>
      <ConsentManager />
      <App />
    </React.StrictMode>
  </HelmetProvider>
);