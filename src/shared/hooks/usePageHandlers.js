import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export function usePageHandlers(baseHook, clearSuccess) {
  const { filters, updateFilters } = baseHook;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, updateFilters]);

  useEffect(() => {
    if (baseHook.success && clearSuccess) {
      const timer = setTimeout(() => clearSuccess(), 3000);
      return () => clearTimeout(timer);
    }
  }, [baseHook.success, clearSuccess]);

  const handleExpandToggle = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setExpandedRowId(null);
  };

  const handleFilterChange = (newFilters) => {
    if (newFilters.search !== undefined) {
      setSearchTerm(newFilters.search);
    } else {
      updateFilters(newFilters);
    }
  };

  const handleClearFilters = (clearedFilters) => {
    setSearchTerm('');
    updateFilters(clearedFilters);
  };

  const handleSort = (columnKey, order) => {
    if (columnKey) {
      updateFilters({ sortBy: columnKey, sortOrder: order, page: 1 });
    } else {
      updateFilters({ sortBy: 'createdAt', sortOrder: 'DESC', page: 1 });
    }
  };

  return {
    searchTerm,
    expandedRowId,
    setExpandedRowId,
    isCreating,
    setIsCreating,
    loadingItem,
    setLoadingItem,
    handleExpandToggle,
    handleCreate,
    handleFilterChange,
    handleClearFilters,
    handleSort,
  };
}

