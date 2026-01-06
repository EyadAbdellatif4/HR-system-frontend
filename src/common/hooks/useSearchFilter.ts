import { useRef, useEffect } from 'react';

export function useSearchFilter({ config, searchInputRefs, cursorPositions, focusedInputKey }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (focusedInputKey.current === config.key && inputRef.current) {
      requestAnimationFrame(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          const cursorPos = cursorPositions.current[config.key] || inputRef.current.value.length;
          inputRef.current.focus();
          if (inputRef.current.setSelectionRange) {
            inputRef.current.setSelectionRange(cursorPos, cursorPos);
          }
        }
      });
    }
  });

  const handleInputRef = (el) => {
    if (el) {
      searchInputRefs.current[config.key] = el;
      inputRef.current = el;
    }
  };

  const handleChange = (e, onChange) => {
    const cursorPos = e.target.selectionStart || e.target.value.length;
    cursorPositions.current[config.key] = cursorPos;
    onChange(config.key, e.target.value);
  };

  const handleFocus = (e) => {
    focusedInputKey.current = config.key;
    searchInputRefs.current[config.key] = e.target;
    cursorPositions.current[config.key] = e.target.selectionStart || e.target.value.length;
  };

  const handleBlur = (focusedInputKey) => {
    if (focusedInputKey.current === config.key) {
      focusedInputKey.current = null;
    }
  };

  return {
    inputRef,
    handleInputRef,
    handleChange,
    handleFocus,
    handleBlur,
  };
}

