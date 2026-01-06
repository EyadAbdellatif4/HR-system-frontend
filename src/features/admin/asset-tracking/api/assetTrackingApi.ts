import { baseApi } from '@/store/api/baseApi';
import type {
  AssetTracking,
  AssetTrackingsResponse,
  AssetTrackingResponse,
  CreateAssetTrackingRequest,
  UpdateAssetTrackingRequest,
  AssetTrackingFilters,
} from '@/types/api.types';

export const assetTrackingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all asset trackings with filters
    getAssetTrackings: builder.query<AssetTrackingsResponse, AssetTrackingFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.user_id) params.append('user_id', filters.user_id);
        if (filters.asset_id) params.append('asset_id', filters.asset_id);
        if (filters.is_active !== undefined && filters.is_active !== '') {
          params.append('is_active', String(filters.is_active === true || filters.is_active === 'true'));
        }
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        
        return {
          url: `/asset-tracking?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...(result.assetTrackings || result.data?.items || []).map(({ id }) => ({
                type: 'AssetTracking' as const,
                id,
              })),
              { type: 'AssetTracking', id: 'LIST' },
              { type: 'Dashboard', id: 'LIST' },
            ]
          : [{ type: 'AssetTracking', id: 'LIST' }],
    }),

    // Get asset trackings by user ID
    getAssetTrackingsByUserId: builder.query<AssetTrackingsResponse, { userId: string; filters?: AssetTrackingFilters }>({
      query: ({ userId, filters = {} }) => {
        const params = new URLSearchParams();
        params.append('user_id', userId);
        if (filters.search) params.append('search', filters.search);
        if (filters.asset_id) params.append('asset_id', filters.asset_id);
        if (filters.is_active !== undefined && filters.is_active !== '') {
          params.append('is_active', String(filters.is_active === true || filters.is_active === 'true'));
        }
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        
        return {
          url: `/asset-tracking?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...(result.assetTrackings || result.data?.items || []).map(({ id }) => ({
                type: 'AssetTracking' as const,
                id,
              })),
              { type: 'AssetTracking', id: 'LIST' },
            ]
          : [{ type: 'AssetTracking', id: 'LIST' }],
    }),

    // Get asset tracking by ID
    getAssetTrackingById: builder.query<AssetTrackingResponse, string>({
      query: (id) => `/asset-tracking/${id}`,
      providesTags: (result, error, id) => [{ type: 'AssetTracking', id }],
    }),

    // Create asset tracking
    createAssetTracking: builder.mutation<AssetTrackingResponse, CreateAssetTrackingRequest>({
      query: (data) => ({
        url: '/asset-tracking',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'AssetTracking', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
    }),

    // Update asset tracking
    updateAssetTracking: builder.mutation<AssetTrackingResponse, { id: string; data: UpdateAssetTrackingRequest }>({
      query: ({ id, data }) => ({
        url: `/asset-tracking/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AssetTracking', id },
        { type: 'AssetTracking', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        // Optimistically update the tracking in the list
        const patchResult = dispatch(
          assetTrackingApi.util.updateQueryData('getAssetTrackings', {} as AssetTrackingFilters, (draft) => {
            const trackings = draft.assetTrackings || draft.data?.items || [];
            const trackingIndex = trackings.findIndex((tracking) => tracking.id === id);
            if (trackingIndex !== -1) {
              trackings[trackingIndex] = { ...trackings[trackingIndex], ...data };
            }
          })
        );

        // Also update the individual tracking query if it exists
        const trackingPatchResult = dispatch(
          assetTrackingApi.util.updateQueryData('getAssetTrackingById', id, (draft) => {
            if (draft.assetTracking) {
              draft.assetTracking = { ...draft.assetTracking, ...data };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResult.undo();
          trackingPatchResult.undo();
        }
      },
    }),

    // Delete asset tracking
    deleteAssetTracking: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/asset-tracking/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AssetTracking', id },
        { type: 'AssetTracking', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically remove the tracking from the list
        const patchResult = dispatch(
          assetTrackingApi.util.updateQueryData('getAssetTrackings', {} as AssetTrackingFilters, (draft) => {
            const trackings = draft.assetTrackings || draft.data?.items || [];
            const trackingIndex = trackings.findIndex((tracking) => tracking.id === id);
            if (trackingIndex !== -1) {
              trackings.splice(trackingIndex, 1);
              // Update total count
              if (draft.total !== undefined) {
                draft.total = Math.max(0, draft.total - 1);
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAssetTrackingsQuery,
  useGetAssetTrackingsByUserIdQuery,
  useGetAssetTrackingByIdQuery,
  useCreateAssetTrackingMutation,
  useUpdateAssetTrackingMutation,
  useDeleteAssetTrackingMutation,
} = assetTrackingApi;

