import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'patient' | 'nurse';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to={`/dashboard/${profile.role}`} replace />;
  }

  return <>{children}</>;
};