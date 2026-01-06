import { useState, useEffect } from 'react';
import { userService, assetService, assetTrackingService } from '@/features/admin/users/services';

/**
 * Custom hook to fetch dashboard counts for Users, Assets, and Asset Tracking
 * @returns {Object} Object containing loading state, error state, counts, users array, assets array, and activeTrackingCount
 */
export function useDashboardCounts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({
    users: 0,
    assets: 0,
    activeTrackingCount: 0,
  });
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all three endpoints in parallel
        const [usersResponse, assetsResponse, assetTrackingResponse] = await Promise.all([
          userService.getAllUsers().catch(err => {
            console.error('Error fetching users:', err);
            return { users: [], total: 0 };
          }),
          assetService.getAllAssets().catch(err => {
            console.error('Error fetching assets:', err);
            return { assets: [], total: 0 };
          }),
          assetTrackingService.getAllAssetTrackings().catch(err => {
            console.error('Error fetching asset trackings:', err);
            return { assetTrackings: [], total: 0 };
          }),
        ]);

        // Extract users array
        const usersArray = usersResponse?.users || usersResponse?.data?.users || usersResponse?.data?.items || [];
        setUsers(usersArray);

        // Extract assets array
        const assetsArray = assetsResponse?.assets || assetsResponse?.data?.assets || assetsResponse?.data?.items || [];
        setAssets(assetsArray);

        // Extract asset trackings
        const assetTrackingsArray = assetTrackingResponse?.assetTrackings || assetTrackingResponse?.data?.items || [];

        // Calculate counts
        const usersCount = usersResponse?.total || usersArray.length || 0;
        const assetsCount = assetsResponse?.total || assetsArray.length || 0;
        const activeTrackingCount = assetTrackingsArray.filter(tracking => tracking.is_active === true || tracking.is_active === 'true').length;

        setCounts({
          users: usersCount,
          assets: assetsCount,
          activeTrackingCount,
        });
      } catch (err) {
        console.error('Error fetching dashboard counts:', err);
        setError(err?.message || 'Failed to fetch dashboard counts');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return {
    loading,
    error,
    counts,
    users,
    assets,
    activeTrackingCount: counts.activeTrackingCount,
  };
}

