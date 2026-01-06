import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HomePageState {
  imageErrors: { [key: string]: boolean };
  selectedAsset: any | null;
  selectedTracking: any | null;
}

interface EmployeesPageState {
  expandedRowId: string | null;
  isCreating: boolean;
}

interface AssetsPageState {
  expandedRowId: string | null;
  isCreating: boolean;
}

interface PageState {
  home: HomePageState;
  employees: EmployeesPageState;
  assets: AssetsPageState;
}

const initialState: PageState = {
  home: {
    imageErrors: {},
    selectedAsset: null,
    selectedTracking: null,
  },
  employees: {
    expandedRowId: null,
    isCreating: false,
  },
  assets: {
    expandedRowId: null,
    isCreating: false,
  },
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPageState: (
      state,
      action: PayloadAction<{ page: keyof PageState; state: Partial<HomePageState | EmployeesPageState | AssetsPageState> }>
    ) => {
      const { page, state: pageState } = action.payload;
      state[page] = { ...state[page], ...pageState };
    },
    setExpandedRow: (state, action: PayloadAction<{ page: 'employees' | 'assets'; rowId: string | null }>) => {
      const { page, rowId } = action.payload;
      state[page].expandedRowId = rowId;
    },
    setCreating: (state, action: PayloadAction<{ page: 'employees' | 'assets'; isCreating: boolean }>) => {
      const { page, isCreating } = action.payload;
      state[page].isCreating = isCreating;
    },
    setImageError: (state, action: PayloadAction<{ id: string; hasError: boolean }>) => {
      const { id, hasError } = action.payload;
      if (hasError) {
        state.home.imageErrors[id] = true;
      } else {
        delete state.home.imageErrors[id];
      }
    },
    setSelectedAsset: (state, action: PayloadAction<any | null>) => {
      state.home.selectedAsset = action.payload;
    },
    setSelectedTracking: (state, action: PayloadAction<any | null>) => {
      state.home.selectedTracking = action.payload;
    },
    clearImageErrors: (state) => {
      state.home.imageErrors = {};
    },
  },
});

export const {
  setPageState,
  setExpandedRow,
  setCreating,
  setImageError,
  setSelectedAsset,
  setSelectedTracking,
  clearImageErrors,
} = pageSlice.actions;
export default pageSlice.reducer;

