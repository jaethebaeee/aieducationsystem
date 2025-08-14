import React, { useEffect, useRef } from 'react';

interface LiveRegionProps {
  children: React.ReactNode;
  role?: 'status' | 'alert' | 'log' | 'timer';
  ariaLive?: 'polite' | 'assertive' | 'off';
  className?: string;
  id?: string;
}

const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  role = 'status',
  ariaLive = 'polite',
  className = '',
  id,
}) => {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the region is visible to screen readers even when empty
    if (regionRef.current) {
      regionRef.current.setAttribute('aria-hidden', 'false');
    }
  }, []);

  return (
    <div
      ref={regionRef}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className={`sr-only ${className}`}
      id={id}
    >
      {children}
    </div>
  );
};

export default LiveRegion; 