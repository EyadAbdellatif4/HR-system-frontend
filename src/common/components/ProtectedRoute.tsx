import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Reusable Protected Route component for authentication and authorization
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Object} props.user - Current user object
 * @param {boolean} props.loading - Loading state for user authentication
 * @param {boolean} [props.requireAdmin=false] - If true, only allows admin users
 * @param {string} [props.redirectTo="/auth/sign-in"] - Redirect path when not authorized
 */
export function ProtectedRoute({ 
  children, 
  user, 
  loading,
  requireAdmin = false,
  redirectTo = "/auth/sign-in"
}) {
  // Redirect immediately if not authenticated (don't wait)
  if (!loading && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Show nothing while loading (parent should handle loading state)
  if (loading) {
    return null;
  }

  // Check admin requirement
  if (requireAdmin) {
    const isAdmin = user.role?.name?.toLowerCase() === 'admin';
    if (!isAdmin) {
      // Redirect to home or show unauthorized message
      return <Navigate to="/dashboard/home" replace />;
    }
  }

  return <>{children}</>;
}

