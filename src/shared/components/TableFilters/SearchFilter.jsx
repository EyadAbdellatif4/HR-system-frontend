import React from 'react';
import { Input } from '@material-tailwind/react';
import { useSearchFilter } from '@/shared/hooks';

export const SearchFilter = React.memo(function SearchFilter({
  config,
  value,
  onChange,
  loading,
  searchInputRefs,
  cursorPositions,
  focusedInputKey,
}) {
  const {
    inputRef,
    handleInputRef,
    handleChange,
    handleFocus,
    handleBlur,
  } = useSearchFilter({ config, searchInputRefs, cursorPositions, focusedInputKey });

  return (
    <div className="w-full sm:flex-1 sm:min-w-[200px]">
      <Input
        inputRef={handleInputRef}
        label={config.label || 'Search'}
        value={value || ''}
        onChange={(e) => handleChange(e, onChange)}
        onFocus={handleFocus}
        onBlur={() => handleBlur(focusedInputKey)}
        disabled={loading}
        className="bg-card"
      />
    </div>
  );
});

