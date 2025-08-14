import React from 'react';
import { Link } from 'react-router-dom';

const ScaleFooter: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-text-secondary text-sm">© {new Date().getFullYear()} AdmitAI Korea — Evidence‑driven admissions optimizer</p>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <Link to="/methodology" className="hover:text-white">Methodology</Link>
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ScaleFooter;

