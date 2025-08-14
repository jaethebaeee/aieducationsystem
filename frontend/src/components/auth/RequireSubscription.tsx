import React from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { Link } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  fallbackMode?: 'hide' | 'blur';
}

const RequireSubscription: React.FC<Props> = ({ children, fallbackMode = 'blur' }) => {
  const { loading, active } = useSubscription();

  if (loading) return <div className="text-white/80 p-4">Loading...</div>;
  if (active) return <>{children}</>;

  if (fallbackMode === 'hide') return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-white/80">
      <p className="mb-3">This feature requires a paid plan.</p>
      <Link to="/pricing" className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black font-semibold">View Plans</Link>
    </div>
  );

  return (
    <div className="relative">
      <div className="pointer-events-none blur-sm select-none opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="p-4 rounded-xl bg-black/70 backdrop-blur border border-white/10 text-center">
          <p className="text-white mb-3">Upgrade to unlock this feature</p>
          <Link to="/pricing" className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black font-semibold">Upgrade</Link>
        </div>
      </div>
    </div>
  );
};

export default RequireSubscription;

