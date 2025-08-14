import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // legacy
  minRole?: 'MEMBER' | 'INSTRUCTOR' | 'ADMIN' | 'OWNER';
}

const rank = { MEMBER: 1, INSTRUCTOR: 2, ADMIN: 3, OWNER: 4 } as const;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, minRole = 'MEMBER' }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user) {
    const raw = (user.role || '').toString().toUpperCase();
    const legacyToNew: Record<string, keyof typeof rank> = {
      ADMIN: 'ADMIN',
      MENTOR: 'INSTRUCTOR',
      STUDENT: 'MEMBER',
      PARENT: 'MEMBER',
      OWNER: 'OWNER',
      INSTRUCTOR: 'INSTRUCTOR',
      MEMBER: 'MEMBER',
    };
    const normalized = (rank[raw as keyof typeof rank] ? (raw as keyof typeof rank) : legacyToNew[raw]) || 'MEMBER';
    if (rank[normalized] < rank[minRole]) {
      return <Navigate to="/dashboard" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 