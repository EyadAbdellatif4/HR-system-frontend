import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Package, CheckCircle, User, Link2 } from "lucide-react";
import { LoadingSpinner } from "@/common/components";
import { CountCard } from "../components/CountCard";
// Note: These components are not exported in the public API, so we import directly
import { AssetTree } from "@/features/admin/assets/components/AssetTree";
import { AssetDetailModal } from "@/features/admin/assets/components/AssetDetailModal";
import { AssetTrackingDetailModal } from "@/features/admin/asset-tracking/components/AssetTrackingDetailModal";
import { getApiUrl } from "@/config/env";
import { useSearch } from "@/common/hooks/useSearch";
import { useAppSelector, useAppDispatch } from "@/store";
import { openModal, closeModal } from "@/store/slices/modalSlice";
import { setImageError, setSelectedAsset, setSelectedTracking } from "@/store/slices/pageSlice";
import {
  useGetDashboardCountsQuery,
  useGetAssetTrackingsQuery,
  useGetAssetsQuery,
  useUpdateAssetMutation,
  useUpdateAssetTrackingMutation,
} from "@/store/hooks";
import { assetTrackingApi } from "@/features/admin/asset-tracking/api/assetTrackingApi";
import { assetsApi } from "@/features/admin/assets/api/assetsApi";
import type { Asset, AssetTracking, User as UserType } from "@/types/api.types";

export function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // RTK Query hooks
  const { data: dashboardData, isLoading: dashboardLoading } = useGetDashboardCountsQuery();
  const { data: trackingData, isLoading: trackingLoading } = useGetAssetTrackingsQuery({});
  const { data: assetsData, isLoading: assetsLoading } = useGetAssetsQuery({});
  const [updateAsset] = useUpdateAssetMutation();
  const [updateAssetTracking] = useUpdateAssetTrackingMutation();
  
  const { searchQuery } = useSearch();
  
  // Redux state
  const imageErrors = useAppSelector((state) => state.page.home.imageErrors);
  const selectedAsset = useAppSelector((state) => state.page.home.selectedAsset);
  const selectedTracking = useAppSelector((state) => state.page.home.selectedTracking);
  const assetTreeState = useAppSelector((state) => state.modal.assetTree);
  const assetDetailState = useAppSelector((state) => state.modal.assetDetail);
  const assetTrackingDetailState = useAppSelector((state) => state.modal.assetTrackingDetail);

  // Extract data from responses
  const counts = dashboardData?.counts || { users: 0, assets: 0, activeTrackingCount: 0 };
  const users = dashboardData?.users || [];
  const assets = dashboardData?.assets || [];
  const activeTrackingCount = counts.activeTrackingCount;
  const assetTrackings = trackingData?.assetTrackings || trackingData?.data?.items || [];
  const allAssets = assetsData?.assets || assetsData?.data?.items || [];

  // Helper function to get user profile image URL
  const getUserImageUrl = (user: UserType | undefined) => {
    if (!user) return null;
    const profileImage = user?.attachments?.[0]?.path_URL;
    if (profileImage) {
      return `${getApiUrl()}/files/${profileImage}`;
    }
    return null;
  };

  // Helper function to get asset image URL
  const getAssetImageUrl = (asset: Asset | undefined) => {
    if (!asset) return null;
    const assetImage = asset?.attachments?.[0]?.path_URL;
    if (assetImage) {
      return `${getApiUrl()}/files/${assetImage}`;
    }
    return null;
  };

  const handleImageError = (id: string) => {
    dispatch(setImageError({ id, hasError: true }));
  };

  const handleUserRowClick = (user: UserType) => {
    dispatch(openModal({ modal: 'assetTree', data: user }));
  };

  const handleCloseAssetTree = () => {
    dispatch(closeModal('assetTree'));
  };

  const handleTrackingRowClick = async (tracking: AssetTracking) => {
    // When clicking on tracking row, show the tracking details
    try {
      // Use RTK Query to fetch tracking details
      const response = await dispatch(
        assetTrackingApi.endpoints.getAssetTrackingById.initiate(tracking.id)
      ).unwrap();
      const trackingData = response.assetTracking || tracking;
      dispatch(setSelectedTracking(trackingData));
      dispatch(openModal({ modal: 'assetTrackingDetail', data: trackingData }));
    } catch (err) {
      console.error('Error fetching tracking details:', err);
      // Use the tracking from the list if fetch fails
      dispatch(setSelectedTracking(tracking));
      dispatch(openModal({ modal: 'assetTrackingDetail', data: tracking }));
    }
  };

  const handleAssetRowClick = async (asset: Asset) => {
    // Fetch full asset details
    try {
      // Use RTK Query to fetch asset details
      const response = await dispatch(
        assetsApi.endpoints.getAssetById.initiate(asset.id)
      ).unwrap();
      const assetData = response.asset || asset;
      dispatch(setSelectedAsset(assetData));
      dispatch(openModal({ modal: 'assetDetail', data: assetData }));
    } catch (err) {
      console.error('Error fetching asset details:', err);
      // Use the asset from the list if fetch fails
      dispatch(setSelectedAsset(asset));
      dispatch(openModal({ modal: 'assetDetail', data: asset }));
    }
  };

  const handleAssetUpdate = async (assetId: string, updateData: any, files: File[] | null = null) => {
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

  const handleCloseAssetDetailModal = () => {
    dispatch(closeModal('assetDetail'));
    dispatch(setSelectedAsset(null));
  };

  const handleTrackingUpdate = async (trackingId: string, updateData: any) => {
    try {
      await updateAssetTracking({ id: trackingId, data: updateData }).unwrap();
      dispatch(closeModal('assetTrackingDetail'));
      dispatch(setSelectedTracking(null));
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to update asset tracking. Please try again.';
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      
      if (window.showToast) {
        window.showToast(formattedError, 'error', 6000);
      } else {
        alert(formattedError);
      }
      // Don't close modal on error so user can retry
    }
  };

  const handleCloseTrackingDetailModal = () => {
    dispatch(closeModal('assetTrackingDetail'));
    dispatch(setSelectedTracking(null));
  };

  // Filter functions
  const filterTracking = (tracking: AssetTracking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const userName = tracking.user?.name || '';
    const assetName = tracking.asset?.label || tracking.asset?.model || tracking.asset?.type || '';
    const status = tracking.is_active ? 'active' : 'inactive';
    return (
      userName.toLowerCase().includes(query) ||
      assetName.toLowerCase().includes(query) ||
      status.includes(query)
    );
  };

  const filterUser = (user: UserType) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = user.name || '';
    const id = user.user_number || '';
    const department = user.departments?.[0]?.name || '';
    const email = user.email || user.username || '';
    return (
      name.toLowerCase().includes(query) ||
      id.toLowerCase().includes(query) ||
      department.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query)
    );
  };

  const filterAsset = (asset: Asset) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = asset.label || asset.model || asset.type || '';
    const type = asset.type || '';
    const model = asset.model || '';
    const serial = asset.serial_number || '';
    const status = asset.status || '';
    return (
      name.toLowerCase().includes(query) ||
      type.toLowerCase().includes(query) ||
      model.toLowerCase().includes(query) ||
      serial.toLowerCase().includes(query) ||
      status.toLowerCase().includes(query)
    );
  };

  // Filtered data
  const filteredTrackings = useMemo(() => {
    return (assetTrackings || []).filter(filterTracking);
  }, [assetTrackings, searchQuery]);

  const filteredUsers = useMemo(() => {
    return (users || []).filter(filterUser);
  }, [users, searchQuery]);

  const filteredAssets = useMemo(() => {
    return (allAssets || []).filter(filterAsset);
  }, [allAssets, searchQuery]);

  const getStatusColor = (isActive: boolean | string | undefined) => {
    if (isActive === true || isActive === 'true') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const cardConfig = [
    {
      title: "Total Employees",
      icon: <Users className="w-6 h-6" />,
      count: counts.users || 0,
      color: "blue",
      onClick: () => navigate("/dashboard/employees"),
    },
    {
      title: "Total Assets",
      icon: <Package className="w-6 h-6" />,
      count: counts.assets || 0,
      color: "green",
      onClick: () => navigate("/dashboard/assets"),
    },
    {
      title: "Total Assigned Assets",
      icon: <CheckCircle className="w-6 h-6" />,
      count: activeTrackingCount || 0,
      color: "purple",
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-6">HR System Dashboard</h1>
      
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
        {cardConfig.map(({ title, icon, count, color, onClick }) => (
          <CountCard
            key={title}
            title={title}
            icon={icon}
            count={count}
            color={color}
            loading={dashboardLoading}
            onClick={onClick}
          />
        ))}
      </div>

      {/* Asset Tracking Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6 mb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Asset Tracking</h2>
        </div>

        {trackingLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner />
          </div>
        ) : filteredTrackings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p>No asset tracking records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Removed Date
                  </th>
                  <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTrackings.map((tracking) => {
                  const user = tracking.user;
                  const asset = tracking.asset;
                  const userImageUrl = getUserImageUrl(user);
                  const assetImageUrl = getAssetImageUrl(asset);
                  const hasUserImage = userImageUrl && !imageErrors[`user-${tracking.id}`];
                  const hasAssetImage = assetImageUrl && !imageErrors[`asset-${tracking.id}`];
                  const userName = user?.name || 'N/A';
                  const assetName = asset?.label || asset?.model || asset?.type || 'N/A';

                  return (
                    <tr
                      key={tracking.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleTrackingRowClick(tracking)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {hasUserImage ? (
                            <img
                              src={userImageUrl}
                              alt={userName}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={() => handleImageError(`user-${tracking.id}`)}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-blue-600" />
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
                              className="w-8 h-8 rounded-full object-cover"
                              onError={() => handleImageError(`asset-${tracking.id}`)}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <Package className="w-4 h-4 text-green-600" />
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
        )}
      </div>

      {/* Two Column Layout: Employees and Assets */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Employee Table - Left (50%) */}
        <div className="flex-1 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Employees</h2>
          </div>

          {dashboardLoading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p>No employees found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const departmentName = user.departments?.[0]?.name || "N/A";
                    const isActive = user.is_active !== false;
                    const userImageUrl = getUserImageUrl(user);
                    const hasImage = userImageUrl && !imageErrors[user.id];
                    const userName = user.name || "N/A";
                    
                    return (
                      <tr 
                        key={user.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleUserRowClick(user)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {hasImage ? (
                              <img
                                src={userImageUrl}
                                alt={userName}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={() => handleImageError(user.id)}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                            <span className="text-sm text-gray-900">{userName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.user_number || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {departmentName}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Assets Table - Right (50%) */}
        <div className="flex-1 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Assets</h2>
          </div>

          {assetsLoading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p>No assets found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Asset Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAssets.map((asset) => {
                    const assetImageUrl = getAssetImageUrl(asset);
                    const hasImage = assetImageUrl && !imageErrors[asset.id];
                    const assetName = asset.label || asset.model || asset.type || 'Unnamed Asset';
                    
                    return (
                      <tr
                        key={asset.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleAssetRowClick(asset)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {hasImage ? (
                              <img
                                src={assetImageUrl}
                                alt={assetName}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={() => handleImageError(asset.id)}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Package className="w-4 h-4 text-green-600" />
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            asset.status === 'Active' || asset.status === 'Selected'
                              ? 'bg-green-100 text-green-800'
                              : asset.status === 'In Process' || asset.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : asset.status === 'Rejected' || asset.status === 'Inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {asset.status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Asset Tree Modal */}
      {assetTreeState.selectedUser && (
        <AssetTree
          user={assetTreeState.selectedUser}
          isOpen={assetTreeState.isOpen}
          onClose={handleCloseAssetTree}
        />
      )}

      {/* Asset Detail Modal */}
      {assetDetailState.item && (
        <AssetDetailModal
          asset={assetDetailState.item}
          isOpen={assetDetailState.isOpen}
          onClose={handleCloseAssetDetailModal}
          onUpdate={handleAssetUpdate}
        />
      )}

      {/* Asset Tracking Detail Modal */}
      {assetTrackingDetailState.item && (
        <AssetTrackingDetailModal
          tracking={assetTrackingDetailState.item}
          isOpen={assetTrackingDetailState.isOpen}
          onClose={handleCloseTrackingDetailModal}
          onUpdate={handleTrackingUpdate}
        />
      )}
    </div>
  );
}

export default DashboardPage;

