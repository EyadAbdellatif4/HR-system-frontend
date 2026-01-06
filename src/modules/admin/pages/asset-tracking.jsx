import React, { useState, useEffect } from 'react';
import { Search, Link2, ChevronLeft, ChevronRight, Plus, Trash2, User, Package } from 'lucide-react';
import { useAssetTracking } from '@/modules/admin/hooks';
import { LoadingSpinner, CreateAssetTrackingModal } from '@/shared/components';
import { assetTrackingService, userService, assetService } from '@/modules/admin/services';
import { getApiUrl } from '@/config/env';

export function AssetTracking() {
  const { 
    assetTrackings, 
    loading, 
    error, 
    success, 
    pagination, 
    filters, 
    updateFilters, 
    updatePage, 
    createAssetTracking,
    deleteAssetTracking,
    clearError, 
    clearSuccess 
  } = useAssetTracking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  // Sync search query with filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== filters.search) {
        updateFilters({ search: searchQuery });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleCreate = async (data) => {
    await createAssetTracking(data);
    setIsCreateModalOpen(false);
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.size} asset tracking record(s)?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedRows).map(id => deleteAssetTracking(id));
      await Promise.all(deletePromises);
      setSelectedRows(new Set());
    } catch (error) {
      console.error('Error deleting asset trackings:', error);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(assetTrackings.map(tracking => tracking.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (trackingId) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackingId)) {
        newSet.delete(trackingId);
      } else {
        newSet.add(trackingId);
      }
      return newSet;
    });
  };

  const getUserImageUrl = (user) => {
    const userImage = user?.attachments?.[0]?.path_URL;
    if (userImage) {
      return `${getApiUrl()}/files/${userImage}`;
    }
    return null;
  };

  const getAssetImageUrl = (asset) => {
    const assetImage = asset?.attachments?.[0]?.path_URL;
    if (assetImage) {
      return `${getApiUrl()}/files/${assetImage}`;
    }
    return null;
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const getStatusColor = (isActive) => {
    if (isActive === true || isActive === 'true') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Tracking</h1>
          <p className="text-sm text-gray-600 mt-1">Manage asset assignments to users</p>
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
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Assign Asset</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : assetTrackings.length === 0 ? (
          <div className="text-center py-12">
            <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No asset tracking records found</p>
            <p className="text-gray-400 text-sm mt-2">Get started by assigning an asset to a user</p>
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
                        checked={selectedRows.size === assetTrackings.length && assetTrackings.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Assigned Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Removed Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assetTrackings.map((tracking) => {
                    const user = tracking.user;
                    const asset = tracking.asset;
                    const userImageUrl = getUserImageUrl(user);
                    const assetImageUrl = getAssetImageUrl(asset);
                    const hasUserImage = userImageUrl && !imageErrors[`user-${tracking.id}`];
                    const hasAssetImage = assetImageUrl && !imageErrors[`asset-${tracking.id}`];
                    const userName = user?.name || 'N/A';
                    const assetName = asset?.label || asset?.model || asset?.type || 'N/A';
                    const isSelected = selectedRows.has(tracking.id);

                    return (
                      <tr
                        key={tracking.id}
                        className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(tracking.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {hasUserImage ? (
                              <img
                                src={userImageUrl}
                                alt={userName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                onError={() => handleImageError(`user-${tracking.id}`)}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{userName}</p>
                              <p className="text-xs text-gray-500">{user?.user_number || user?.email || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {hasAssetImage ? (
                              <img
                                src={assetImageUrl}
                                alt={assetName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                onError={() => handleImageError(`asset-${tracking.id}`)}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-green-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{assetName}</p>
                              <p className="text-xs text-gray-500">{asset?.serial_number || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {tracking.assigned_at ? new Date(tracking.assigned_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {tracking.removed_at ? new Date(tracking.removed_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tracking.is_active)}`}>
                            {tracking.is_active ? 'Active' : 'Inactive'}
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
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Showing</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => updateFilters({ limit: parseInt(e.target.value), page: 1 })}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    Showing {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} to {Math.min(pagination.page * pagination.limit, pagination.total)} out of {pagination.total} records
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
                        let pageNum;
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

      {/* Create Asset Tracking Modal */}
      <CreateAssetTrackingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default AssetTracking;

