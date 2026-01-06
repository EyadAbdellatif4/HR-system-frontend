import { baseApi } from '@/store/api/baseApi';
import type {
  Asset,
  AssetsResponse,
  AssetResponse,
  CreateAssetRequest,
  UpdateAssetRequest,
  AssetFilters,
} from '@/types/api.types';

// Helper to build FormData from asset data
const buildAssetFormData = (assetData: CreateAssetRequest | UpdateAssetRequest, files?: File[]): FormData => {
  const formData = new FormData();
  
  Object.keys(assetData).forEach((key) => {
    const value = assetData[key as keyof typeof assetData];
    if (value !== null && value !== undefined && value !== '') {
      if (key === 'images' && files) {
        // Handle files separately
        files.forEach((file) => {
          formData.append('images', file);
        });
      } else if (key !== 'images') {
        formData.append(key, String(value));
      }
    }
  });
  
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('images', file);
    });
  }
  
  return formData;
};

export const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all assets with filters
    getAssets: builder.query<AssetsResponse, AssetFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.label) params.append('label', filters.label);
        if (filters.type) params.append('type', filters.type);
        if (filters.asset_type) params.append('asset_type', filters.asset_type);
        if (filters.model) params.append('model', filters.model);
        if (filters.serial_number) params.append('serial_number', filters.serial_number);
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        
        return {
          url: `/assets?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...(result.assets || result.data?.items || []).map(({ id }) => ({ type: 'Asset' as const, id })),
              { type: 'Asset', id: 'LIST' },
              { type: 'Dashboard', id: 'LIST' },
            ]
          : [{ type: 'Asset', id: 'LIST' }],
    }),

    // Get asset by ID
    getAssetById: builder.query<AssetResponse, string>({
      query: (id) => `/assets/${id}`,
      providesTags: (result, error, id) => [{ type: 'Asset', id }],
    }),

    // Create asset (with file upload support)
    createAsset: builder.mutation<AssetResponse, { data: CreateAssetRequest; files?: File[] }>({
      query: ({ data, files }) => {
        const formData = buildAssetFormData(data, files);
        return {
          url: '/assets',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [
        { type: 'Asset', id: 'LIST' },
        { type: 'AssetTracking', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
    }),

    // Update asset (with file upload support)
    updateAsset: builder.mutation<AssetResponse, { id: string; data: UpdateAssetRequest; files?: File[] }>({
      query: ({ id, data, files }) => {
        const formData = buildAssetFormData(data, files);
        return {
          url: `/assets/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Asset', id },
        { type: 'Asset', id: 'LIST' },
        { type: 'AssetTracking', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        // Optimistically update the asset in the list
        const patchResult = dispatch(
          assetsApi.util.updateQueryData('getAssets', {} as AssetFilters, (draft) => {
            const assets = draft.assets || draft.data?.items || [];
            const assetIndex = assets.findIndex((asset) => asset.id === id);
            if (assetIndex !== -1) {
              assets[assetIndex] = { ...assets[assetIndex], ...data };
            }
          })
        );

        // Also update the individual asset query if it exists
        const assetPatchResult = dispatch(
          assetsApi.util.updateQueryData('getAssetById', id, (draft) => {
            if (draft.asset) {
              draft.asset = { ...draft.asset, ...data };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResult.undo();
          assetPatchResult.undo();
        }
      },
    }),

    // Delete asset
    deleteAsset: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/assets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Asset', id },
        { type: 'Asset', id: 'LIST' },
        { type: 'AssetTracking', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically remove the asset from the list
        const patchResult = dispatch(
          assetsApi.util.updateQueryData('getAssets', {} as AssetFilters, (draft) => {
            const assets = draft.assets || draft.data?.items || [];
            const assetIndex = assets.findIndex((asset) => asset.id === id);
            if (assetIndex !== -1) {
              assets.splice(assetIndex, 1);
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
  useGetAssetsQuery,
  useGetAssetByIdQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} = assetsApi;

