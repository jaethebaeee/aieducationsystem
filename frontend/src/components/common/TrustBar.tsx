import React from 'react';

interface TrustBarProps {
  className?: string;
}

const TrustBar: React.FC<TrustBarProps> = ({ className = '' }) => {
  const universities = [
    'Harvard',
    'Stanford',
    'MIT',
    'Yale',
    'Princeton',
    'Columbia'
  ];

  return (
    <div className={`text-center ${className}`}>
      <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
        <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-text-muted text-sm font-medium">
          Trusted by students at top universities worldwide
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 opacity-90">
        {universities.map((name) => (
          <div key={name} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;

