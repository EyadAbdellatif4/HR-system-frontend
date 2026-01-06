import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { assetTrackingService } from '@/features/admin/users/services';
import { useCrudOperations } from '@/common/hooks/useCrudOperations';
import { useErrorMessage } from '@/common/hooks/useErrorMessage';

const buildQueryParams = (params) => {
  const queryParams = {};
  if (params.search) queryParams.search = params.search;
  if (params.user_id) queryParams.user_id = params.user_id;
  if (params.asset_id) queryParams.asset_id = params.asset_id;
  if (params.is_active !== undefined && params.is_active !== '') {
    queryParams.is_active = params.is_active === true || params.is_active === 'true';
  }
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
  return queryParams;
};

export function useAssetTracking() {
  const { error, success, setError, setSuccess, clearError, clearSuccess } = useErrorMessage(3000);
  const [filters, setFilters] = useState({
    search: '', user_id: '', asset_id: '', is_active: undefined,
    page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC',
  });

  const { data: queryData, isLoading, isFetching, error: queryError } = useQuery({
    queryKey: ['asset-tracking', filters],
    queryFn: async () => {
      const queryParams = buildQueryParams(filters);
      const response = await assetTrackingService.getAllAssetTrackings(queryParams);
      return {
        assetTrackings: response.assetTrackings || response.data?.items || [],
        pagination: {
          total: response.total || response.data?.meta?.total || 0,
          page: response.page || response.data?.meta?.page || filters.page || 1,
          limit: response.limit || response.data?.meta?.limit || filters.limit || 10,
          totalPages: response.totalPages || response.data?.meta?.totalPages || 0,
        },
      };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
    onError: (err) => {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch asset trackings', err?.response?.status || null);
    },
  });

  const crud = useCrudOperations('asset-tracking', {
    create: (data) => assetTrackingService.createAssetTracking(data),
    update: (id, data) => assetTrackingService.updateAssetTracking(id, data),
    delete: assetTrackingService.deleteAssetTracking,
    getById: assetTrackingService.getAssetTrackingById,
  }, setError, setSuccess);

  const assetTrackings = queryData?.assetTrackings || [];
  const pagination = queryData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const updatePage = (page) => {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    setFilters(prev => ({ ...prev, page: pageNumber }));
  };

  return {
    assetTrackings,
    pagination,
    filters,
    loading: isLoading,
    isFetching,
    error: error || queryError?.message,
    success,
    setError,
    setSuccess,
    clearError,
    clearSuccess,
    updateFilters,
    updatePage,
    ...crud,
  };
}

