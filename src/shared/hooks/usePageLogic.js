import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';

// Shared hook for common page logic (used by Users, Projects, Vouchers pages)
export function usePageLogic(baseHook, filterConfigFn, fetchProjectsFn = null) {
  const {
    loading,
    isFetching,
    error,
    success,
    pagination,
    filters,
    updateFilters,
    updatePage,
    clearSuccess,
    ...rest
  } = baseHook();

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Update search when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, updateFilters]);

  // Fetch projects if needed
  useEffect(() => {
    if (fetchProjectsFn) {
      const fetchProjects = async () => {
        setLoadingProjects(true);
        try {
          const allProjects = await fetchProjectsFn();
          setProjects(allProjects);
        } catch (err) {
          console.error('Error fetching projects:', err);
          setProjects([]);
        } finally {
          setLoadingProjects(false);
        }
      };
      fetchProjects();
    }
  }, [fetchProjectsFn]);

  // Filter configuration
  const filterConfig = useMemo(() => {
    return filterConfigFn ? filterConfigFn(projects) : [];
  }, [projects, filterConfigFn]);

  // Auto-dismiss success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => clearSuccess(), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, clearSuccess]);

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
    ...rest,
    pagination,
    filters: { ...filters, search: searchTerm },
    loading,
    isFetching,
    loadingItem,
    setLoadingItem,
    loadingProjects,
    error,
    success,
    expandedRowId,
    isCreating,
    setIsCreating,
    projects,
    filterConfig,
    handleExpandToggle,
    handleCreate,
    handleFilterChange,
    handleClearFilters,
    handleSort,
    updatePage,
    updateFilters,
  };
}

