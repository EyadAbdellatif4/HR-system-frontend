// Export the main page
export { AssetsPage } from './pages/AssetsPage';

// Export API hooks
export {
  useGetAssetsQuery,
  useGetAssetByIdQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} from './api/assetsApi';

// Export types
export type { Asset, AssetFilters, CreateAssetRequest, UpdateAssetRequest } from '@/types/api.types';

