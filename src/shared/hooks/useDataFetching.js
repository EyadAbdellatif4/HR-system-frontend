import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorMessage } from './useErrorMessage';

export function useDataFetching(config) {
  const {
    queryKey,
    fetchFn,
    buildQueryParams,
    defaultFilters,
    transformResponse,
  } = config;

  const queryClient = useQueryClient();
  const { error, success, setError, setSuccess, clearError, clearSuccess } = useErrorMessage(3000);
  const [filters, setFilters] = useState(defaultFilters);

  const { data: queryData, isLoading, isFetching, error: queryError } = useQuery({
    queryKey: [queryKey, filters],
    queryFn: async () => {
      const queryParams = buildQueryParams(filters);
      const response = await fetchFn(queryParams);
      return transformResponse(response, filters);
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
    onError: (err) => {
      const errorMessage = err?.response?.data?.message || err.message || `Failed to fetch ${queryKey}`;
      const errorStatus = err?.response?.status || null;
      setError(errorMessage, errorStatus);
    },
  });

  const data = queryData?.data || [];
  const pagination = queryData?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const updatePage = (page) => {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    setFilters(prev => ({ ...prev, page: pageNumber }));
  };

  return {
    data,
    pagination,
    filters,
    loading: isLoading,
    isFetching,
    error,
    success,
    setError,
    setSuccess,
    clearError,
    clearSuccess,
    updateFilters,
    updatePage,
    queryClient,
  };
}

