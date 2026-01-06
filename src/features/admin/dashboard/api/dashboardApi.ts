import { baseApi } from '@/store/api/baseApi';
import type { DashboardCountsResponse } from '@/types/api.types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard counts (aggregates users, assets, and asset-tracking)
    getDashboardCounts: builder.query<DashboardCountsResponse, void>({
      // Use queryFn directly since backend doesn't have /dashboard/counts endpoint
      // Remove query property and use only queryFn to avoid calling non-existent endpoint
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        // Fetch all three endpoints in parallel
        const [usersResult, assetsResult, trackingsResult] = await Promise.all([
          fetchWithBQ({ url: '/users', method: 'GET' }),
          fetchWithBQ({ url: '/assets', method: 'GET' }),
          fetchWithBQ({ url: '/asset-tracking', method: 'GET' }),
        ]);

        if (usersResult.error || assetsResult.error || trackingsResult.error) {
          return { error: usersResult.error || assetsResult.error || trackingsResult.error };
        }

        // Extract users array - handle different response structures
        const usersData = usersResult.data as any;
        const users = usersData?.users || usersData?.data?.users || usersData?.data?.items || [];
        
        // Extract assets array - handle different response structures
        const assetsData = assetsResult.data as any;
        const assets = assetsData?.assets || assetsData?.data?.assets || assetsData?.data?.items || [];
        
        // Extract asset trackings array - handle different response structures
        const trackingsData = trackingsResult.data as any;
        const assetTrackings = trackingsData?.assetTrackings || trackingsData?.data?.assetTrackings || trackingsData?.data?.items || [];

        // Calculate active tracking count
        const activeTrackingCount = assetTrackings.filter(
          (tracking: any) => tracking.is_active === true || tracking.status === true
        ).length;

        // Extract counts - handle different response structures
        const getCount = (response: any) => {
          // Check for total in response
          if (response?.total !== undefined && typeof response.total === 'number') {
            return response.total;
          }
          // Check for total in data.meta
          if (response?.data?.meta?.total !== undefined && typeof response.data.meta.total === 'number') {
            return response.data.meta.total;
          }
          // Check if response is an array
          if (Array.isArray(response)) {
            return response.length;
          }
          // Check if response.data is an array
          if (Array.isArray(response?.data)) {
            return response.data.length;
          }
          // Check if response.data.items is an array
          if (Array.isArray(response?.data?.items)) {
            return response.data.items.length;
          }
          // Fallback: count the extracted arrays
          return 0;
        };

        // Calculate counts from extracted arrays as fallback
        const usersCount = getCount(usersResult.data) || users.length;
        const assetsCount = getCount(assetsResult.data) || assets.length;

        return {
          data: {
            counts: {
              users: usersCount,
              assets: assetsCount,
              activeTrackingCount,
            },
            users,
            assets,
          },
        };
      },
      providesTags: [{ type: 'Dashboard', id: 'LIST' }],
    }),
  }),
});

export const { useGetDashboardCountsQuery } = dashboardApi;

