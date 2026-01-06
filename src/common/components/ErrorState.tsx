import React from 'react';
import { Alert, Button, Typography } from '@material-tailwind/react';

export const ErrorState = React.memo(function ErrorState({ 
  error, 
  onRetry,
  retryLabel = "Try Again",
  className = ""
}) {
  const handleRetry = () => {
    onRetry ? onRetry() : window.location.reload();
  };

  return (
    <div className={`mt-12 ${className}`}>
      <Alert color="red" className="mb-4">
        <Typography variant="paragraph" className="font-semibold mb-2">
          Error
        </Typography>
        <Typography variant="small">
          {error || 'An unexpected error occurred'}
        </Typography>
      </Alert>
      {onRetry !== null && (
        <Button onClick={handleRetry} color="blue">
          {retryLabel}
        </Button>
      )}
    </div>
  );
});

