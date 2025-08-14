import React from 'react';
import SEOHead from '../components/seo/SEOHead';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <SEOHead title="404 | AdmitAI Korea" noIndex language="ko" />
    <h1 className="text-5xl font-bold text-blue-700 mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
    <p className="text-gray-600 mb-8">The page you’re looking for doesn’t exist or has been moved.</p>
    <div className="flex space-x-4">
      <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Home</Link>
      <Link to="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Dashboard</Link>
    </div>
  </div>
);

export default NotFoundPage; 