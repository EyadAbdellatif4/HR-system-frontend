import React from 'react';
import { Input } from '@material-tailwind/react';

export const DateFilter = React.memo(function DateFilter({
  config,
  value,
  onChange,
  loading,
}) {
  return (
    <div className="w-full sm:min-w-[150px]">
      <Input
        type="date"
        label={config.label}
        value={value || ''}
        onChange={(e) => onChange(config.key, e.target.value)}
        disabled={loading}
        className="bg-card"
      />
    </div>
  );
});

