// Backward compatibility wrapper for MaterialTailwind controller
// This allows existing code to continue using useMaterialTailwindController() while using Redux under the hood
import { useAppSelector, useAppDispatch } from '@/store';
import {
  setOpenSidenav as setOpenSidenavAction,
  setSidenavType as setSidenavTypeAction,
  setSidenavColor as setSidenavColorAction,
  setTransparentNavbar as setTransparentNavbarAction,
  setFixedNavbar as setFixedNavbarAction,
  setOpenConfigurator as setOpenConfiguratorAction,
} from '@/store/slices/uiSlice';

export function useMaterialTailwindController() {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.ui);

  // Return in the same format as the old reducer: [controller, dispatch]
  const controller = {
    openSidenav: uiState.openSidenav,
    sidenavColor: uiState.sidenavColor,
    sidenavType: uiState.sidenavType,
    transparentNavbar: uiState.transparentNavbar,
    fixedNavbar: uiState.fixedNavbar,
    openConfigurator: uiState.openConfigurator,
  };

  // Create a dispatch function that matches the old API
  const customDispatch = (action) => {
    if (action.type === 'OPEN_SIDENAV') {
      dispatch(setOpenSidenavAction(action.value));
    } else if (action.type === 'SIDENAV_TYPE') {
      dispatch(setSidenavTypeAction(action.value));
    } else if (action.type === 'SIDENAV_COLOR') {
      dispatch(setSidenavColorAction(action.value));
    } else if (action.type === 'TRANSPARENT_NAVBAR') {
      dispatch(setTransparentNavbarAction(action.value));
    } else if (action.type === 'FIXED_NAVBAR') {
      dispatch(setFixedNavbarAction(action.value));
    } else if (action.type === 'OPEN_CONFIGURATOR') {
      dispatch(setOpenConfiguratorAction(action.value));
    }
  };

  return [controller, customDispatch];
}

// Keep MaterialTailwindControllerProvider for backward compatibility (no-op since Redux handles state)
export function MaterialTailwindControllerProvider({ children }) {
  return <>{children}</>;
}

// Backward compatibility action creators
export const setOpenSidenav = (dispatch, value) => {
  if (typeof dispatch === 'function') {
    // New Redux dispatch
    dispatch(setOpenSidenavAction(value));
  } else {
    // Old reducer dispatch
    dispatch({ type: 'OPEN_SIDENAV', value });
  }
};
export const setSidenavType = (dispatch, value) => {
  if (typeof dispatch === 'function') {
    dispatch(setSidenavTypeAction(value));
  } else {
    dispatch({ type: 'SIDENAV_TYPE', value });
  }
};
export const setSidenavColor = (dispatch, value) => {
  if (typeof dispatch === 'function') {
    dispatch(setSidenavColorAction(value));
  } else {
    dispatch({ type: 'SIDENAV_COLOR', value });
  }
};
export const setTransparentNavbar = (dispatch, value) => {
  if (typeof dispatch === 'function') {
    dispatch(setTransparentNavbarAction(value));
  } else {
    dispatch({ type: 'TRANSPARENT_NAVBAR', value });
  }
};
export const setFixedNavbar = (dispatch, value) => {
  if (typeof dispatch === 'function') {
    dispatch(setFixedNavbarAction(value));
  } else {
    dispatch({ type: 'FIXED_NAVBAR', value });
  }
};
export const setOpenConfigurator = (dispatch, value) => {
  if (typeof dispatch === 'function') {
    dispatch(setOpenConfiguratorAction(value));
  } else {
    dispatch({ type: 'OPEN_CONFIGURATOR', value });
  }
};

export { AuthProvider, useAuth } from './authContext';
