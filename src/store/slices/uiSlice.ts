import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  openSidenav: boolean;
  sidenavColor: string;
  sidenavType: string;
  transparentNavbar: boolean;
  fixedNavbar: boolean;
  openConfigurator: boolean;
}

const initialState: UIState = {
  openSidenav: false,
  sidenavColor: 'blue',
  sidenavType: 'white',
  transparentNavbar: true,
  fixedNavbar: false,
  openConfigurator: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setOpenSidenav: (state, action: PayloadAction<boolean>) => {
      state.openSidenav = action.payload;
    },
    setSidenavColor: (state, action: PayloadAction<string>) => {
      state.sidenavColor = action.payload;
    },
    setSidenavType: (state, action: PayloadAction<string>) => {
      state.sidenavType = action.payload;
    },
    setTransparentNavbar: (state, action: PayloadAction<boolean>) => {
      state.transparentNavbar = action.payload;
    },
    setFixedNavbar: (state, action: PayloadAction<boolean>) => {
      state.fixedNavbar = action.payload;
    },
    setOpenConfigurator: (state, action: PayloadAction<boolean>) => {
      state.openConfigurator = action.payload;
    },
  },
});

export const {
  setOpenSidenav,
  setSidenavColor,
  setSidenavType,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
} = uiSlice.actions;
export default uiSlice.reducer;

