import { baseApi } from '@/store/api/baseApi';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/api.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => {
        // Convert username to lowercase for case-insensitive login
        const usernameLower = credentials.username ? credentials.username.toLowerCase().trim() : credentials.username;
        return {
          url: '/auth/login',
          method: 'POST',
          body: {
            username: usernameLower,
            password: credentials.password,
          },
        };
      },
      // Handle token storage after successful login
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.access_token) {
            localStorage.setItem('authToken', data.access_token);
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user));
            }
            // Update Redux auth state
            dispatch({
              type: 'auth/login',
              payload: data.user,
            });
          }
        } catch (error) {
          // Error handling is done by RTK Query
        }
      },
    }),

    // Register mutation
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

