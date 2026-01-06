import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { assetService } from '@/features/admin/users/services';
import { useCrudOperations } from '@/common/hooks/useCrudOperations';
import { useErrorMessage } from '@/common/hooks/useErrorMessage';

const buildQueryParams = (params) => {
  const queryParams = {};
  if (params.search) queryParams.search = params.search;
  if (params.label) queryParams.label = params.label;
  if (params.type) queryParams.type = params.type;
  if (params.asset_type) queryParams.asset_type = params.asset_type;
  if (params.model) queryParams.model = params.model;
  if (params.serial_number) queryParams.serial_number = params.serial_number;
  if (params.status) queryParams.status = params.status;
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
  return queryParams;
};

export function useAssets() {
  const { error, success, setError, setSuccess, clearError, clearSuccess } = useErrorMessage(3000);
  const [filters, setFilters] = useState({
    search: '', label: '', type: '', asset_type: '', model: '', serial_number: '', status: '',
    page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC',
  });

  const { data: queryData, isLoading, isFetching, error: queryError } = useQuery({
    queryKey: ['assets', filters],
    queryFn: async () => {
      const queryParams = buildQueryParams(filters);
      const response = await assetService.getAllAssets(queryParams);
      return {
        assets: response.assets || response.data?.items || [],
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
      setError(err?.response?.data?.message || err.message || 'Failed to fetch assets', err?.response?.status || null);
    },
  });

  const crud = useCrudOperations('assets', {
    create: (data, files) => assetService.createAsset(data, files),
    update: (id, data, files) => assetService.updateAsset(id, data, files),
    delete: assetService.deleteAsset,
    getById: assetService.getAssetById,
  }, setError, setSuccess);

  const assets = queryData?.assets || [];
  const pagination = queryData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const updatePage = (page) => {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    setFilters(prev => ({ ...prev, page: pageNumber }));
  };

  return {
    assets,
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

