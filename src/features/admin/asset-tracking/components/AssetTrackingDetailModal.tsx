import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Loader2, Calendar, Link2, User, Package, Trash2 } from 'lucide-react';
import { userService, assetService } from '@/features/admin/users/services';
import { SimpleDatePicker } from '@/common/components/SimpleDatePicker';
import { ImageDropdown } from '@/common/components/ImageDropdown';
import { getApiUrl } from '@/config/env';
import type { AssetTracking, User as UserType, Asset as AssetType } from '@/types/api.types';

interface AssetTrackingDetailModalProps {
  tracking: AssetTracking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: any) => Promise<void>;
}

interface FormData {
  user_id: string;
  asset_id: string;
  assigned_at: string;
  removed_at: string;
  is_active: boolean;
}

declare global {
  interface Window {
    showToast?: (message: string, type?: string, duration?: number) => void;
  }
}

/**
 * AssetTrackingDetailModal Component
 * Displays and allows editing of asset tracking details
 */
export function AssetTrackingDetailModal({ tracking, isOpen, onClose, onUpdate }: AssetTrackingDetailModalProps) {
  const [formData, setFormData] = useState<FormData>({
    user_id: '',
    asset_id: '',
    assigned_at: '',
    removed_at: '',
    is_active: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [showAssignedDatePicker, setShowAssignedDatePicker] = useState(false);
  const [showRemovedDatePicker, setShowRemovedDatePicker] = useState(false);
  const assignedDateRef = useRef<HTMLDivElement>(null);
  const removedDateRef = useRef<HTMLDivElement>(null);
  const assignedCalendarRef = useRef<HTMLDivElement>(null);
  const removedCalendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && tracking) {
      setFormData({
        user_id: tracking.user_id || tracking.user?.id || '',
        asset_id: tracking.asset_id || tracking.asset?.id || '',
        assigned_at: tracking.assigned_at ? new Date(tracking.assigned_at).toISOString().split('T')[0] || '' : '',
        removed_at: tracking.removed_at ? new Date(tracking.removed_at).toISOString().split('T')[0] || '' : '',
        is_active: tracking.is_active !== undefined ? tracking.is_active : true,
      });
      setIsEditing(false);
      fetchUsers();
      fetchAssets();
    }
  }, [isOpen, tracking]);

  // Close date pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInAssignedInput = assignedDateRef.current?.contains(target);
      const isClickInAssignedCalendar = assignedCalendarRef.current?.contains(target);
      const isClickInRemovedInput = removedDateRef.current?.contains(target);
      const isClickInRemovedCalendar = removedCalendarRef.current?.contains(target);

      if (showAssignedDatePicker && !isClickInAssignedInput && !isClickInAssignedCalendar) {
        setShowAssignedDatePicker(false);
      }
      if (showRemovedDatePicker && !isClickInRemovedInput && !isClickInRemovedCalendar) {
        setShowRemovedDatePicker(false);
      }
    };

    if (showAssignedDatePicker || showRemovedDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    return undefined;
  }, [showAssignedDatePicker, showRemovedDatePicker]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userService.getAllUsers({ limit: 100 });
      const usersArray = response?.users || response?.data?.users || response?.data?.items || [];
      setUsers(usersArray);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAssets = async () => {
    try {
      setLoadingAssets(true);
      const response = await assetService.getAllAssets({ limit: 100 });
      const assetsArray = response?.assets || response?.data?.assets || response?.data?.items || [];
      setAssets(assetsArray);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setAssets([]);
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleDateChange = (name: keyof FormData, date: string) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const formatDateForDisplay = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    if (!formData.user_id || !formData.asset_id) {
      if (window.showToast) {
        window.showToast('Please select both a user and an asset', 'error');
      } else {
        alert('Please select both a user and an asset');
      }
      return;
    }

    try {
      setIsSaving(true);
      const data = {
        user_id: formData.user_id,
        asset_id: formData.asset_id,
        assigned_at: formData.assigned_at ? new Date(formData.assigned_at).toISOString() : undefined,
        removed_at: formData.removed_at && formData.removed_at.trim() !== '' 
          ? new Date(formData.removed_at).toISOString() 
          : null, // Explicitly set to null to clear the field
        // Note: is_active is not included as it's not part of the UpdateAssetTrackingDto
      };
      if (!tracking) return;
      await onUpdate(tracking.id, data);
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update asset tracking. Please try again.';
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      
      if (window.showToast) {
        window.showToast(formattedError, 'error', 6000);
      } else {
        alert(formattedError);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getUserImageUrl = (user: UserType): string | null => {
    const profileImage = user?.attachments?.[0]?.path_URL;
    if (profileImage) {
      return `${getApiUrl()}/files/${profileImage}`;
    }
    return null;
  };

  const getAssetImageUrl = (asset: AssetType): string | null => {
    const assetImage = asset?.attachments?.[0]?.path_URL;
    if (assetImage) {
      return `${getApiUrl()}/files/${assetImage}`;
    }
    return null;
  };

  const getUserDisplayText = (user: UserType): string => {
    return user.name || user.username || user.email || 'Unknown User';
  };

  const getUserSubText = (user: UserType): string => {
    return user.user_number || user.email || user.username || '';
  };

  const getAssetDisplayText = (asset: AssetType): string => {
    return asset.label || asset.model || asset.type || 'Unknown Asset';
  };

  const getAssetSubText = (asset: AssetType): string => {
    return asset.serial_number || asset.model || asset.type || '';
  };

  if (!isOpen || !tracking) return null;

  const user = tracking.user;
  const asset = tracking.asset;
  const userImageUrl = user ? getUserImageUrl(user) : null;
  const assetImageUrl = asset ? getAssetImageUrl(asset) : null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center border-2 border-white shadow-md flex-shrink-0">
              <Link2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Asset Tracking Details
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Assignment Information
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 sm:space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    if (!tracking) return;
                    setIsEditing(false);
                    setFormData({
                      user_id: tracking.user_id || tracking.user?.id || '',
                      asset_id: tracking.asset_id || tracking.asset?.id || '',
                      assigned_at: tracking.assigned_at ? (new Date(tracking.assigned_at).toISOString().split('T')[0] || '') : '',
                      removed_at: tracking.removed_at ? (new Date(tracking.removed_at).toISOString().split('T')[0] || '') : '',
                      is_active: tracking.is_active !== undefined ? tracking.is_active : true,
                    });
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors touch-manipulation"
                >
                  Edit
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto sm:p-2 px-4 py-2 sm:px-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 flex items-center justify-center touch-manipulation"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="sm:hidden ml-2">Close</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50" style={{ position: 'relative' }}>
          <div className="space-y-4">
            {/* User Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                loadingUsers ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading users...</span>
                  </div>
                ) : (
                  <ImageDropdown
                    options={users as any}
                    value={formData.user_id}
                    onChange={(userId: string) => setFormData(prev => ({ ...prev, user_id: userId }))}
                    placeholder="Select User"
                    loading={loadingUsers}
                    type="user"
                    getImageUrl={getUserImageUrl}
                    getDisplayText={getUserDisplayText}
                    getSubText={getUserSubText}
                  />
                )
              ) : (
                <div className="flex items-center space-x-3 bg-white px-3 py-2 rounded-lg border border-gray-200">
                  {userImageUrl ? (
                    <img
                      src={userImageUrl}
                      alt={user?.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{user?.user_number || user?.email || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Asset Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                loadingAssets ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading assets...</span>
                  </div>
                ) : (
                  <ImageDropdown
                    options={assets as any}
                    value={formData.asset_id}
                    onChange={(assetId: string) => setFormData(prev => ({ ...prev, asset_id: assetId }))}
                    placeholder="Select Asset"
                    loading={loadingAssets}
                    type="asset"
                    getImageUrl={getAssetImageUrl}
                    getDisplayText={getAssetDisplayText}
                    getSubText={getAssetSubText}
                  />
                )
              ) : (
                <div className="flex items-center space-x-3 bg-white px-3 py-2 rounded-lg border border-gray-200">
                  {assetImageUrl ? (
                    <img
                      src={assetImageUrl}
                      alt={asset?.label || 'Asset'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{asset?.label || asset?.model || asset?.type || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{asset?.serial_number || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Assigned Date Picker */}
            <div className="relative" ref={assignedDateRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Date</label>
              {isEditing ? (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={formatDateForDisplay(formData.assigned_at)}
                      onFocus={() => setShowAssignedDatePicker(true)}
                      readOnly
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {showAssignedDatePicker && assignedDateRef.current && createPortal(
                    <div 
                      ref={assignedCalendarRef}
                      className="fixed z-[10002] mt-1" 
                      style={{ 
                        left: assignedDateRef.current.getBoundingClientRect().left,
                        top: assignedDateRef.current.getBoundingClientRect().bottom + 4
                      }}
                    >
                      <SimpleDatePicker
                        value={formData.assigned_at}
                        onChange={(date: string) => {
                          handleDateChange('assigned_at', date);
                          setShowAssignedDatePicker(false);
                        }}
                        show={showAssignedDatePicker}
                        onClose={() => setShowAssignedDatePicker(false)}
                        minDate={undefined}
                      />
                    </div>,
                    document.body
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                  {tracking.assigned_at ? new Date(tracking.assigned_at).toLocaleDateString() : 'N/A'}
                </p>
              )}
            </div>

            {/* Removed Date Picker */}
            <div className="relative" ref={removedDateRef}>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Removed Date <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                {isEditing && !formData.removed_at && (
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      handleDateChange('removed_at', today || '');
                    }}
                    className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    title="Remove assignment from this user"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Assignment</span>
                  </button>
                )}
                {isEditing && formData.removed_at && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDateChange('removed_at', '');
                    }}
                    className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Clear removed date"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              {isEditing ? (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={formatDateForDisplay(formData.removed_at)}
                      onFocus={() => setShowRemovedDatePicker(true)}
                      readOnly
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {showRemovedDatePicker && removedDateRef.current && createPortal(
                    <div 
                      ref={removedCalendarRef}
                      className="fixed z-[10002] mt-1" 
                      style={{ 
                        left: removedDateRef.current.getBoundingClientRect().left,
                        top: removedDateRef.current.getBoundingClientRect().bottom + 4
                      }}
                    >
                      <SimpleDatePicker
                        value={formData.removed_at}
                        onChange={(date: string) => {
                          handleDateChange('removed_at', date);
                          setShowRemovedDatePicker(false);
                        }}
                        show={showRemovedDatePicker}
                        onClose={() => setShowRemovedDatePicker(false)}
                        minDate={undefined}
                      />
                    </div>,
                    document.body
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                  {tracking.removed_at ? new Date(tracking.removed_at).toLocaleDateString() : 'N/A'}
                </p>
              )}
            </div>

            {/* Status - Read Only (is_active cannot be updated via API) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                tracking.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {tracking.is_active ? 'Active' : 'Inactive'}
              </span>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">Status cannot be modified</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetTrackingDetailModal;

