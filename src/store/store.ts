import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import searchReducer from './slices/searchSlice';
import uiReducer from './slices/uiSlice';
import modalReducer from './slices/modalSlice';
import formReducer from './slices/formSlice';
import pageReducer from './slices/pageSlice';
import filterReducer from './slices/filterSlice';
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    ui: uiReducer,
    modal: modalReducer,
    form: formReducer,
    page: pageReducer,
    filter: filterReducer,
    // Add RTK Query API reducer
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

