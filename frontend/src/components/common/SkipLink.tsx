import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <a
      href={href}
      className={`
        sr-only focus:not-sr-only
        focus:absolute focus:top-4 focus:left-4
        bg-primary-600 text-white px-4 py-2 rounded-lg
        text-sm font-medium z-50
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </a>
  );
};

export default SkipLink; 