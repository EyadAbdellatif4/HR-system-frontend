import React, { useState, useEffect } from 'react';
import { Package, ChevronLeft, ChevronRight, Plus, Trash2, Link2 } from 'lucide-react';
import { LoadingSpinner, PaginationDropdown } from '@/common/components';
import { CreateAssetModal } from '../components/CreateAssetModal';
import { AssetDetailModal } from '../components/AssetDetailModal';
import { CreateAssetTrackingModal } from '@/features/admin/asset-tracking/components/CreateAssetTrackingModal';
import { getApiUrl } from '@/config/env';
import { useSearch } from '@/common/hooks/useSearch';
import { useAppSelector, useAppDispatch } from '@/store';
import { openModal, closeModal } from '@/store/slices/modalSlice';
import { setSelectedAsset } from '@/store/slices/pageSlice';
import {
  useGetAssetsQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useCreateAssetTrackingMutation,
} from '@/store/hooks';
import { assetsApi } from '../api/assetsApi';
import type { Asset, AssetFilters, CreateAssetRequest, UpdateAssetRequest } from '@/types/api.types';

export function AssetsPage() {
  const dispatch = useAppDispatch();
  const { searchQuery } = useSearch();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<AssetFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  // RTK Query hooks
  const { data: assetsData, isLoading: loading } = useGetAssetsQuery(filters);
  const [createAsset] = useCreateAssetMutation();
  const [updateAsset] = useUpdateAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();
  const [createAssetTracking] = useCreateAssetTrackingMutation();

  // Extract data
  const assets = assetsData?.assets || assetsData?.data?.items || [];
  const pagination = {
    total: assetsData?.total || assetsData?.data?.meta?.total || 0,
    page: assetsData?.page || assetsData?.data?.meta?.page || filters.page || 1,
    limit: assetsData?.limit || assetsData?.data?.meta?.limit || filters.limit || 10,
    totalPages: assetsData?.totalPages || assetsData?.data?.meta?.totalPages || 0,
  };

  // Redux state
  const createAssetModal = useAppSelector((state) => state.modal.createAsset);
  const createAssetTrackingModal = useAppSelector((state) => state.modal.createAssetTracking);
  const assetDetailModal = useAppSelector((state) => state.modal.assetDetail);

  // Sync search query from context with filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== filters.search) {
        setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters.search]);

  const updateFilters = (newFilters: Partial<AssetFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const updatePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRowClick = async (asset: Asset) => {
    // Fetch full asset details
    try {
      const response = await dispatch(
        assetsApi.endpoints.getAssetById.initiate(asset.id)
      ).unwrap();
      const assetData = response.asset || asset;
      dispatch(openModal({ modal: 'assetDetail', data: assetData }));
    } catch (err) {
      console.error('Error fetching asset details:', err);
      // Use the asset from the list if fetch fails
      dispatch(openModal({ modal: 'assetDetail', data: asset }));
    }
  };

  const handleUpdate = async (assetId: string, updateData: UpdateAssetRequest, files: File[] | null = null) => {
    try {
      await updateAsset({ id: assetId, data: updateData, files: files || undefined }).unwrap();
      dispatch(closeModal('assetDetail'));
      dispatch(setSelectedAsset(null));
    } catch (error: any) {
      console.error('Error updating asset:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to update asset. Please try again.';
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      
      if (window.showToast) {
        window.showToast(formattedError, 'error', 6000);
      } else {
        alert(formattedError);
      }
      // Don't close modal on error so user can retry
    }
  };

  const handleCreate = async (data: CreateAssetRequest, files?: File[]) => {
    try {
      await createAsset({ data, files }).unwrap();
      dispatch(closeModal('createAsset'));
      if (window.showToast) {
        window.showToast('Asset created successfully', 'success');
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to create asset. Please try again.';
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      
      if (window.showToast) {
        window.showToast(formattedError, 'error', 6000);
      } else {
        alert(formattedError);
      }
    }
  };

  const handleAssignAsset = async (data: any) => {
    try {
      await createAssetTracking(data).unwrap();
      dispatch(closeModal('createAssetTracking'));
      if (window.showToast) {
        window.showToast('Asset assigned successfully', 'success');
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to assign asset. Please try again.';
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      
      if (window.showToast) {
        window.showToast(formattedError, 'error', 6000);
      } else {
        alert(formattedError);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.size} asset(s)?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedRows).map((assetId) =>
        deleteAsset(assetId).unwrap()
      );
      await Promise.all(deletePromises);
      setSelectedRows(new Set());
      if (window.showToast) {
        window.showToast('Assets deleted successfully', 'success');
      }
    } catch (error: any) {
      console.error('Error deleting assets:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to delete assets. Please try again.';
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      
      if (window.showToast) {
        window.showToast(formattedError, 'error', 6000);
      } else {
        alert(formattedError);
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(assets.map((asset) => asset.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (assetId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  };

  const getAssetImageUrl = (asset: Asset) => {
    const assetImage = asset?.attachments?.[0]?.path_URL;
    if (assetImage) {
      return `${getApiUrl()}/files/${assetImage}`;
    }
    return null;
  };

  const handleImageError = (assetId: string) => {
    setImageErrors((prev) => ({ ...prev, [assetId]: true }));
  };

  const getStatusColor = (status?: string) => {
    if (status === 'Active' || status === 'Selected') {
      return 'bg-green-100 text-green-800';
    }
    if (status === 'In Process' || status === 'Pending') {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (status === 'Rejected' || status === 'Inactive') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and track company assets</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedRows.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete ({selectedRows.size})</span>
            </button>
          )}
          <button
            onClick={() => dispatch(openModal({ modal: 'createAssetTracking' }))}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Link2 className="w-5 h-5" />
            <span>Assign Asset</span>
          </button>
          <button
            onClick={() => dispatch(openModal({ modal: 'createAsset' }))}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No assets found</p>
            <p className="text-gray-400 text-sm mt-2">Get started by adding your first asset</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === assets.length && assets.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Asset Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assets.map((asset) => {
                    const assetImageUrl = getAssetImageUrl(asset);
                    const hasImage = assetImageUrl && !imageErrors[asset.id];
                    const assetName = asset.label || asset.model || asset.type || 'Unnamed Asset';
                    const isSelected = selectedRows.has(asset.id);

                    return (
                      <tr
                        key={asset.id}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                        onClick={() => handleRowClick(asset)}
                      >
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(asset.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {hasImage ? (
                              <img
                                src={assetImageUrl}
                                alt={assetName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                onError={() => handleImageError(asset.id)}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-900">{assetName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {asset.type || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {asset.model || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {asset.serial_number || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                            {asset.status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-gray-200 bg-gray-50 gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-sm text-gray-600 whitespace-nowrap">Showing</span>
                    <PaginationDropdown
                      value={pagination.limit}
                      onChange={(e) => updateFilters({ limit: parseInt(e.target.value), page: 1 })}
                    />
                    <span className="text-sm text-gray-600 whitespace-nowrap hidden sm:inline">
                      items per page
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
                  </span>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePage(pagination.page - 1);
                      }}
                      disabled={pagination.page === 1}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={(e) => {
                              e.stopPropagation();
                              updatePage(pageNum);
                            }}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              pagination.page === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePage(pagination.page + 1);
                      }}
                      disabled={pagination.page >= pagination.totalPages}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Asset Detail Modal */}
      {assetDetailModal.item && (
        <AssetDetailModal
          asset={assetDetailModal.item}
          isOpen={assetDetailModal.isOpen}
          onClose={() => dispatch(closeModal('assetDetail'))}
          onUpdate={handleUpdate}
        />
      )}

      {/* Create Asset Modal */}
      <CreateAssetModal
        isOpen={createAssetModal.isOpen}
        onClose={() => dispatch(closeModal('createAsset'))}
        onCreate={handleCreate}
      />

      {/* Assign Asset Modal */}
      <CreateAssetTrackingModal
        isOpen={createAssetTrackingModal.isOpen}
        onClose={() => dispatch(closeModal('createAssetTracking'))}
        onCreate={handleAssignAsset}
      />
    </div>
  );
}

export default AssetsPage;

