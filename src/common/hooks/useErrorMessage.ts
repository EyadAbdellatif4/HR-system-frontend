import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing error and success messages with auto-clear functionality
 * Includes special handling for authentication errors (redirects to sign-in after 3 seconds)
 * @param {number} autoClearDelay - Time in milliseconds before auto-clearing (default: 3000)
 * @returns {Object} - Object containing error, success, setError, setSuccess, clearError, clearSuccess
 */
export function useErrorMessage(autoClearDelay = 3000) {
  const [error, setErrorState] = useState('');
  const [success, setSuccessState] = useState('');
  const errorTimeoutRef = useRef(null);
  const successTimeoutRef = useRef(null);
  const redirectTimeoutRef = useRef(null);

  // Clear any existing timeouts on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const isAuthError = (errorMessage, status) => {
    if (!errorMessage) return false;
    
    const message = errorMessage.toLowerCase();
    return (
      status === 401 || // Unauthorized
      status === 403 || // Forbidden
      message.includes('token') ||
      message.includes('authentication') ||
      message.includes('unauthorized') ||
      message.includes('expired') ||
      message.includes('invalid token') ||
      message.includes('forbidden') ||
      message.includes('no token') ||
      message.includes('token expired') ||
      message.includes('token invalid')
    );
  };

  const setErrorWithAutoClear = (errorMessage, errorStatus = null) => {
    // Clear any existing timeouts
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    
    setErrorState(errorMessage);
    
    // If error message is empty, just clear (no auto-clear needed)
    if (!errorMessage) {
      return;
    }
    
    // Check if it's an authentication/token error
    const token = localStorage.getItem('authToken');
    const isAuthPage = window.location.pathname.includes('/auth/');
    const shouldRedirect = isAuthError(errorMessage, errorStatus) && !isAuthPage;
    
    if (shouldRedirect) {
      // For auth errors: show error for 3 seconds, then redirect to sign-in
      redirectTimeoutRef.current = setTimeout(() => {
        // Clear auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Redirect to sign-in
        window.location.href = '/auth/sign-in';
      }, autoClearDelay);
    } else {
      // For other errors: just auto-clear after delay
      errorTimeoutRef.current = setTimeout(() => {
        setErrorState('');
        errorTimeoutRef.current = null;
      }, autoClearDelay);
    }
  };

  const setSuccessWithAutoClear = (successMessage) => {
    // Clear any existing timeout
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    
    setSuccessState(successMessage);
    
    // Auto-clear after delay if success is not empty
    if (successMessage) {
      successTimeoutRef.current = setTimeout(() => {
        setSuccessState('');
        successTimeoutRef.current = null;
      }, autoClearDelay);
    }
  };

  const clearError = () => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    setErrorState('');
  };

  const clearSuccess = () => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
    setSuccessState('');
  };

  return {
    error,
    success,
    setError: setErrorWithAutoClear,
    setSuccess: setSuccessWithAutoClear,
    clearError,
    clearSuccess,
  };
}

