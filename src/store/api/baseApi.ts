import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { getApiUrl } from '@/config/env';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Define tag types for cache invalidation
export const tagTypes = ['User', 'Asset', 'AssetTracking', 'Dashboard', 'Role', 'Department'] as const;
export type TagType = typeof tagTypes[number];

// Custom baseQuery that handles both JSON and FormData
const baseQuery = fetchBaseQuery({
  baseUrl: getApiUrl(),
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
});

// Custom baseQuery wrapper to handle errors and FormData
const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Handle FormData - don't set Content-Type header
  if (args && typeof args === 'object' && 'body' in args && args.body instanceof FormData) {
    const modifiedArgs = {
      ...args,
      // Remove Content-Type header for FormData - browser sets it automatically
    };
    const result = await baseQuery(modifiedArgs, api, extraOptions);
    
    // Handle 401 errors
    if (result.error && 'status' in result.error && result.error.status === 401) {
      const token = localStorage.getItem('authToken');
      const isAuthPage = window.location.pathname.includes('/auth/');
      
      if (token && !isAuthPage) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/sign-in';
      }
    }
    
    return result;
  }
  
  // Regular JSON request
  const result = await baseQuery(args, api, extraOptions);
  
  // Handle 401 errors
  if (result.error && 'status' in result.error && result.error.status === 401) {
    const token = localStorage.getItem('authToken');
    const isAuthPage = window.location.pathname.includes('/auth/');
    
    if (token && !isAuthPage) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/sign-in';
    }
  }
  
  return result;
};

// Base API slice
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes,
  endpoints: () => ({}),
});

