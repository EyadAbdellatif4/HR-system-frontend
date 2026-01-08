import React, { useState, useEffect, useRef } from 'react';
import { X, Package } from 'lucide-react';
import { assetTrackingService, userService, assetService } from '@/features/admin/users/services';
import { getApiUrl } from '@/config/env';
import { LoadingSpinner } from '@/common/components';
import { UserDetailModal } from '@/features/admin/users/components/UserDetailModal';
import { AssetDetailModal } from './AssetDetailModal';
import { useAppDispatch } from '@/store';
import { usersApi } from '@/features/admin/users/api/usersApi';
import { assetsApi } from '../api/assetsApi';
import { dashboardApi } from '@/features/admin/dashboard/api/dashboardApi';

/**
 * AssetTree Component
 * Displays a tree-branch layout showing user and their assigned assets
 * 
 * @param {Object} props
 * @param {Object} props.user - The user object
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 */
export function AssetTree({ user, isOpen, onClose }) {
  const dispatch = useAppDispatch();
  const [assetTrackings, setAssetTrackings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const rootNodeRef = useRef(null);
  const assetNodeRefs = useRef({});
  const containerRef = useRef(null);
  const [linesReady, setLinesReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && currentUser?.id) {
      fetchAssetTrackings();
    } else {
      // Reset state when modal closes
      setAssetTrackings([]);
      setError(null);
      setLinesReady(false);
    }
  }, [isOpen, currentUser?.id]);

  // Wait for nodes to render before calculating lines
  useEffect(() => {
    if (assetTrackings.length > 0 && rootNodeRef.current) {
      // Small delay to ensure all nodes are rendered
      const timer = setTimeout(() => {
        setLinesReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setLinesReady(false);
    }
  }, [assetTrackings]);

  // Handle window resize to redraw lines
  useEffect(() => {
    const handleResize = () => {
      setLinesReady(false);
      // Debounce the redraw
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(() => {
        setLinesReady(true);
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimer);
    };
  }, []);

  const fetchAssetTrackings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await assetTrackingService.getAssetTrackingsByUserId(user.id);
      
      // Filter only active asset trackings and extract assets
      const activeTrackings = (response.assetTrackings || []).filter(
        tracking => tracking.is_active === true
      );
      
      setAssetTrackings(activeTrackings);
    } catch (err) {
      console.error('Error fetching asset trackings:', err);
      setError(err.message || 'Failed to load assets');
      setAssetTrackings([]);
    } finally {
      setLoading(false);
    }
  };

  // Get asset image URL
  const getAssetImageUrl = (asset) => {
    const assetImage = asset?.attachments?.[0]?.path_URL;
    if (assetImage) {
      return `${getApiUrl()}/files/${assetImage}`;
    }
    return null;
  };

  // Get asset name
  const getAssetName = (asset) => {
    return asset?.label || asset?.model || asset?.type || 'Unnamed Asset';
  };

  const handleUserClick = async () => {
    try {
      const response = await userService.getUserById(user.id);
      setSelectedUser(response.user || user);
      setIsUserModalOpen(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setSelectedUser(user);
      setIsUserModalOpen(true);
    }
  };

  const handleAssetClick = async (asset) => {
    try {
      const response = await assetService.getAssetById(asset.id);
      setSelectedAsset(response.asset || asset);
      setIsAssetModalOpen(true);
    } catch (err) {
      console.error('Error fetching asset details:', err);
      setSelectedAsset(asset);
      setIsAssetModalOpen(true);
    }
  };

  const handleUserUpdate = async (userId, updateData, files = null) => {
    try {
      await userService.updateUser(userId, updateData, files);
      
      // Invalidate RTK Query cache for users and dashboard to refresh home page
      dispatch(usersApi.util.invalidateTags([{ type: 'User', id: 'LIST' }]));
      dispatch(dashboardApi.util.invalidateTags([{ type: 'Dashboard', id: 'LIST' }]));
      
      // Update local user state
      setCurrentUser(prev => prev ? { ...prev, ...updateData } : prev);
      
      setIsUserModalOpen(false);
      setSelectedUser(null);
      
      // Refresh asset trackings to show updated data
      fetchAssetTrackings();
      
      if (window.showToast) {
        window.showToast('User updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user. Please try again.';
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      
      if (window.showToast) {
        window.showToast(formattedError, 'error', 6000);
      } else {
        alert(formattedError);
      }
    }
  };

  const handleAssetUpdate = async (assetId, updateData) => {
    try {
      await assetService.updateAsset(assetId, updateData, null);
      
      // Invalidate RTK Query cache for assets and dashboard to refresh home page
      dispatch(assetsApi.util.invalidateTags([{ type: 'Asset', id: 'LIST' }]));
      dispatch(dashboardApi.util.invalidateTags([{ type: 'Dashboard', id: 'LIST' }]));
      
      setIsAssetModalOpen(false);
      setSelectedAsset(null);
      
      // Refresh asset trackings to show updated data
      fetchAssetTrackings();
      
      if (window.showToast) {
        window.showToast('Asset updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating asset:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update asset. Please try again.';
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      
      if (window.showToast) {
        window.showToast(formattedError, 'error', 6000);
      } else {
        alert(formattedError);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes drawLine {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-draw-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 1s ease-out forwards;
        }
      `}</style>
      
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      
        {/* Modal Content */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Assigned Assets
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentUser?.name || user?.name || 'User'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="self-end sm:self-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-600 text-lg font-medium">{error}</p>
              </div>
            ) : (
              <div className="relative" style={{ minHeight: '400px' }} ref={containerRef}>
                {/* Animated Lines - Each line in its own container */}
                {assetTrackings.length > 0 && linesReady && assetTrackings.map((tracking, index) => {
                  const rootNode = rootNodeRef.current;
                  const assetNode = assetNodeRefs.current[tracking.id];
                  const container = containerRef.current;
                  
                  if (!rootNode || !assetNode || !container) return null;
                  
                  const rootRect = rootNode.getBoundingClientRect();
                  const assetRect = assetNode.getBoundingClientRect();
                  const containerRect = container.getBoundingClientRect();
                  
                  // Calculate positions relative to the container
                  const rootX = rootRect.left + rootRect.width / 2 - containerRect.left;
                  const rootY = rootRect.top + rootRect.height / 2 - containerRect.top;
                  const assetX = assetRect.left + assetRect.width / 2 - containerRect.left;
                  const assetY = assetRect.top + assetRect.height / 2 - containerRect.top;
                  
                  // Calculate the radius of each circle
                  const rootRadius = rootRect.width / 2;
                  const assetRadius = assetRect.width / 2;
                  
                  // Calculate the angle between root and asset
                  const dx = assetX - rootX;
                  const dy = assetY - rootY;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  const angle = Math.atan2(dy, dx);
                  
                  // Calculate start point (on the edge of root circle, towards asset)
                  const startX = rootX + Math.cos(angle) * rootRadius;
                  const startY = rootY + Math.sin(angle) * rootRadius;
                  
                  // Calculate end point (on the edge of asset circle, from root)
                  const endX = assetX - Math.cos(angle) * assetRadius;
                  const endY = assetY - Math.sin(angle) * assetRadius;
                  
                  // Calculate line length for stroke-dasharray
                  const lineLength = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
                  
                  return (
                    <div
                      key={tracking.id}
                      className="absolute inset-0 pointer-events-none"
                      style={{ zIndex: 0 }}
                    >
                      <svg 
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ overflow: 'visible' }}
                      >
                        <line
                          x1={startX}
                          y1={startY}
                          x2={endX}
                          y2={endY}
                          stroke="#94a3b8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className="opacity-60 animate-draw-line"
                          style={{
                            strokeDasharray: lineLength,
                            strokeDashoffset: lineLength,
                            animation: `drawLine 1s ease-out ${index * 0.2 + 0.3}s forwards`
                          }}
                        />
                      </svg>
                    </div>
                  );
                })}

                {/* Root Node - User Name (Top Center) */}
                <div className="flex justify-center mb-12 relative z-10">
                  <div className="relative group cursor-pointer" onClick={handleUserClick} ref={rootNodeRef}>
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg flex items-center justify-center border-3 border-white transform group-hover:scale-105 transition-transform duration-300">
                      <div className="text-center px-3">
                        <span className="text-white text-lg sm:text-xl font-bold block leading-tight">
                          {currentUser?.name || user?.name || 'User'}
                        </span>
                        <span className="text-blue-100 text-xs mt-0.5 block">
                          {assetTrackings.length} {assetTrackings.length === 1 ? 'Asset' : 'Assets'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asset Nodes */}
                {assetTrackings.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No assets assigned</p>
                    <p className="text-gray-400 text-sm mt-2">This user doesn't have any assigned assets yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-6 lg:gap-8 px-4">
                    {assetTrackings.map((tracking, index) => {
                      const asset = tracking.asset;
                      const assetImageUrl = getAssetImageUrl(asset);
                      const assetName = getAssetName(asset);
                      
                      return (
                        <div
                          key={tracking.id}
                          className="flex flex-col items-center relative z-10"
                          style={{
                            animation: `fadeInScale 0.5s ease-out ${index * 0.1 + 0.3}s both`
                          }}
                        >
                          <div className="group relative flex flex-col items-center">
                            <div className="relative">
                              {/* Glow effect */}
                              <div className="absolute inset-0 bg-blue-300 rounded-full blur-md opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
                              
                              {/* Asset Node */}
                              <div 
                                ref={(el) => {
                                  if (el) assetNodeRefs.current[tracking.id] = el;
                                }}
                                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-white shadow-lg border-3 border-gray-200 group-hover:border-blue-400 transition-all duration-300 flex items-center justify-center p-1 transform group-hover:scale-110 group-hover:shadow-xl cursor-pointer"
                                onClick={() => handleAssetClick(asset)}
                              >
                                {assetImageUrl ? (
                                  <>
                                    <img
                                      src={assetImageUrl}
                                      alt={assetName}
                                      className="w-full h-full rounded-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        const fallback = e.target.nextElementSibling;
                                        if (fallback) fallback.style.display = 'flex';
                                      }}
                                    />
                                    <div 
                                      className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center hidden"
                                    >
                                      <Package className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-10 lg:h-10 text-blue-500" />
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                    <Package className="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-10 lg:h-10 text-blue-500" />
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Asset Name */}
                            <div className="mt-2 text-center max-w-[110px]">
                              <p className="text-xs sm:text-sm font-medium text-gray-700 break-words leading-tight group-hover:text-blue-600 transition-colors">
                                {assetName}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUserUpdate}
        />
      )}

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          isOpen={isAssetModalOpen}
          onClose={() => {
            setIsAssetModalOpen(false);
            setSelectedAsset(null);
          }}
          onUpdate={handleAssetUpdate}
        />
      )}
    </>
  );
}

export default AssetTree;
