import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
  [key: string]: any;
}

interface FilterSliceState {
  users: FilterState;
  assets: FilterState;
  assetTracking: FilterState;
  [key: string]: FilterState;
}

const defaultFilters: FilterState = {
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'DESC',
  page: 1,
  limit: 10,
};

const initialState: FilterSliceState = {
  users: { ...defaultFilters },
  assets: { ...defaultFilters },
  assetTracking: { ...defaultFilters },
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ entity: string; filters: FilterState }>) => {
      const { entity, filters } = action.payload;
      if (!state[entity]) {
        state[entity] = { ...defaultFilters };
      }
      state[entity] = { ...state[entity], ...filters };
    },
    updateFilter: (
      state,
      action: PayloadAction<{ entity: string; key: string; value: any }>
    ) => {
      const { entity, key, value } = action.payload;
      if (!state[entity]) {
        state[entity] = { ...defaultFilters };
      }
      state[entity][key] = value;
    },
    resetFilters: (state, action: PayloadAction<string>) => {
      const entity = action.payload;
      state[entity] = { ...defaultFilters };
    },
    setPage: (state, action: PayloadAction<{ entity: string; page: number }>) => {
      const { entity, page } = action.payload;
      if (!state[entity]) {
        state[entity] = { ...defaultFilters };
      }
      state[entity].page = page;
    },
    setSort: (
      state,
      action: PayloadAction<{ entity: string; sortBy: string; sortOrder: 'ASC' | 'DESC' }>
    ) => {
      const { entity, sortBy, sortOrder } = action.payload;
      if (!state[entity]) {
        state[entity] = { ...defaultFilters };
      }
      state[entity].sortBy = sortBy;
      state[entity].sortOrder = sortOrder;
      state[entity].page = 1; // Reset to first page on sort
    },
  },
});

export const { setFilters, updateFilter, resetFilters, setPage, setSort } = filterSlice.actions;
export default filterSlice.reducer;

