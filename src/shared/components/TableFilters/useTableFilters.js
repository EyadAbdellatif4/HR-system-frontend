import { useRef, useEffect, useMemo } from 'react';

export function useTableFilters(filters, filterConfig) {
  const searchInputRefs = useRef({});
  const cursorPositions = useRef({});
  const focusedInputKey = useRef(null);
  const dateRangePickerRefs = useRef({});

  const hasActiveFilters = useMemo(() => {
    return filterConfig.some((config) => {
      if (config.type === 'limit') return false;
      const filterValue = filters[config.key];
      
      if (config.type === 'dateRange') {
        if (typeof filterValue === 'object' && filterValue !== null) {
          return !!(filterValue.from && filterValue.from.trim() !== '' && filterValue.to && filterValue.to.trim() !== '');
        }
        return false;
      }
      
      if (config.type === 'select') {
        const currentValue = filterValue !== undefined && filterValue !== null ? String(filterValue) : '';
        const defaultValue = config.defaultValue !== undefined && config.defaultValue !== null ? String(config.defaultValue) : '';
        return currentValue !== '' && currentValue !== defaultValue;
      }
      
      if (config.type === 'search' || config.type === 'date') {
        return filterValue !== undefined && filterValue !== null && String(filterValue).trim() !== '';
      }
      
      return false;
    });
  }, [filters, filterConfig]);

  const getClearedFilters = () => {
    const clearedFilters = {};
    filterConfig.forEach(config => {
      if (config.type === 'search') {
        clearedFilters[config.key] = '';
      } else if (config.type === 'select') {
        clearedFilters[config.key] = config.defaultValue || '';
      } else if (config.type === 'date') {
        clearedFilters[config.key] = '';
      } else if (config.type === 'dateRange') {
        clearedFilters[config.key] = { from: '', to: '' };
      }
    });
    clearedFilters.page = 1;
    clearedFilters.limit = filters.limit || 10;
    clearedFilters.sortBy = 'createdAt';
    clearedFilters.sortOrder = 'DESC';
    return clearedFilters;
  };

  return {
    searchInputRefs,
    cursorPositions,
    focusedInputKey,
    dateRangePickerRefs,
    hasActiveFilters,
    getClearedFilters,
  };
}

