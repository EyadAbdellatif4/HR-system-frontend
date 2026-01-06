import React from 'react';
import { Spinner, Typography } from '@material-tailwind/react';

const SIZE_MAP = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12"
};

export const LoadingSpinner = React.memo(function LoadingSpinner({ 
  message = "Loading...", 
  size = "lg",
  fullScreen = false,
  className = ""
}) {
  const spinnerSize = SIZE_MAP[size] || SIZE_MAP.lg;
  const containerClass = fullScreen 
    ? `min-h-screen flex items-center justify-center ${className}`
    : `flex items-center justify-center ${className}`;

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <Spinner className={spinnerSize} />
        {message && (
          <Typography variant="paragraph" className="text-text-secondary">
            {message}
          </Typography>
        )}
      </div>
    </div>
  );
});

