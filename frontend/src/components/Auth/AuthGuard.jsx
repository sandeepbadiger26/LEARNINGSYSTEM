import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '../common/Spinner';

export function AuthGuard({ children }) {
  const { isAuthenticated, accessToken } = useAuthStore();
  const location = useLocation();

  // Check if we have auth data (either from store or initial load)
  const hasAuth = isAuthenticated && accessToken;

  if (!hasAuth) {
    // Redirect to login, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function PublicOnly({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
}
