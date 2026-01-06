// Backward compatibility wrapper for useSearch hook
// This allows existing code to continue using useSearch() while using Redux under the hood
import { useAppSelector, useAppDispatch } from '@/store';
import { setSearchQuery, clearSearch } from '@/store/slices/searchSlice';

export function useSearch() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.search.searchQuery);

  return {
    searchQuery,
    setSearchQuery: (query) => dispatch(setSearchQuery(query)),
    clearSearch: () => dispatch(clearSearch()),
  };
}

// Keep SearchProvider for backward compatibility (no-op since Redux handles state)
export function SearchProvider({ children }) {
  return <>{children}</>;
}

