import React from 'react';
import { Link } from 'react-router-dom';

interface AnnouncementBannerProps {
  message: string;
  ctaLabel?: string;
  to?: string;
  className?: string;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  message,
  ctaLabel = 'Start now',
  to,
  className = '',
}) => {
  return (
    <div className={`w-full bg-indigo-600 text-white ${className}`} role="region" aria-label="announcement">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-sm">
          <span className="font-medium text-center">
            {message}
          </span>
          {to && (
            <Link
              to={to}
              className="inline-flex items-center rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {ctaLabel} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;

