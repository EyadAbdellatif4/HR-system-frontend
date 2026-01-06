import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Toast Notification Component
 * Displays error, success, or info messages in a toast notification
 * 
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.type - 'error' | 'success' | 'info'
 * @param {boolean} props.show - Whether to show the toast
 * @param {Function} props.onClose - Function to close the toast
 * @param {number} props.duration - Auto-close duration in ms (default: 5000)
 */
export function Toast({ message, type = 'info', show, onClose, duration = 5000 }) {
  useEffect(() => {
    if (show && message && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, message, duration, onClose]);

  if (!show || !message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  // Format error message if it's an array
  const formatMessage = (msg) => {
    if (Array.isArray(msg)) {
      return msg.join(', ');
    }
    if (typeof msg === 'object' && msg !== null) {
      return JSON.stringify(msg);
    }
    return String(msg);
  };

  return (
    <div className="fixed top-4 right-4 z-[10003] transform transition-all duration-300 ease-in-out animate-slide-in">
      <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md ${getStyles()}`}>
        <div className={`flex-shrink-0 ${getIconStyles()}`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium break-words">
            {formatMessage(message)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * ToastContainer Component
 * Manages multiple toast notifications
 */
export function ToastContainer() {
  const [toasts, setToasts] = React.useState([]);

  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration, show: true };
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose showToast globally
  React.useEffect(() => {
    window.showToast = showToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[10003] space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            show={toast.show}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        </div>
      ))}
    </div>
  );
}

// Helper function to show toast
export const showToast = (message, type = 'info', duration = 5000) => {
  if (window.showToast) {
    return window.showToast(message, type, duration);
  }
  // Fallback to alert if toast system not initialized
  alert(message);
};

// Helper function to format and show error
export const showError = (error, defaultMessage = 'An error occurred') => {
  let errorMessage = defaultMessage;
  
  if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  // Format array errors
  const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
  
  if (window.showToast) {
    window.showToast(formattedError, 'error', 6000);
  } else {
    alert(formattedError);
  }
  
  // Also log to console for debugging
  console.error('Error:', error);
};

