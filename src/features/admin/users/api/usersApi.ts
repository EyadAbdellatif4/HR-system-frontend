import { baseApi } from '@/store/api/baseApi';
import type {
  User,
  UsersResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
} from '@/types/api.types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with filters
    getUsers: builder.query<UsersResponse, UserFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.role) params.append('role', filters.role);
        if (filters.is_active !== undefined && filters.is_active !== '') {
          params.append('is_active', String(filters.is_active === true || filters.is_active === 'true'));
        }
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        
        return {
          url: `/users?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...(result.users || result.data?.items || []).map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
              { type: 'Dashboard', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Get user by ID
    getUserById: builder.query<UserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Get current user
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => '/users/me',
      providesTags: (result) =>
        result?.user ? [{ type: 'User', id: result.user.id }] : [],
    }),

    // Create user (with file upload support)
    createUser: builder.mutation<UserResponse, { data: CreateUserRequest; files?: File[] }>({
      queryFn: async (arg, _api, _extraOptions, baseQuery) => {
        const { data, files } = arg;
        
        if (files && files.length > 0) {
          // Use FormData if files are provided
          const formData = new FormData();
          
          // Append all user data fields
          Object.keys(data).forEach((key) => {
            const value = data[key as keyof CreateUserRequest];
            if (value !== null && value !== undefined && value !== '') {
              if (Array.isArray(value)) {
                // Handle arrays (like personal_phone)
                value.forEach((item) => {
                  formData.append(key, String(item));
                });
              } else if (typeof value === 'boolean') {
                formData.append(key, String(value));
              } else {
                formData.append(key, String(value));
              }
            }
          });
          
          // Append files
          files.forEach((file) => {
            formData.append('images', file);
          });
          
          const result = await baseQuery({
            url: '/users',
            method: 'POST',
            body: formData,
          });
          
          if (result.error) {
            return { error: result.error };
          }
          return { data: result.data as UserResponse };
        } else {
          // Regular JSON request if no files
          const result = await baseQuery({
            url: '/users',
            method: 'POST',
            body: data,
          });
          
          if (result.error) {
            return { error: result.error };
          }
          return { data: result.data as UserResponse };
        }
      },
      invalidatesTags: [{ type: 'User', id: 'LIST' }, { type: 'Dashboard', id: 'LIST' }],
    }),

    // Update user (with file upload support)
    updateUser: builder.mutation<UserResponse, { id: string; data: UpdateUserRequest; files?: File[] }>({
      queryFn: async (arg, _api, _extraOptions, baseQuery) => {
        const { id, data, files } = arg;
        
        if (files && files.length > 0) {
          // Use FormData if files are provided
          const formData = new FormData();
          
          // Append all user data fields
          Object.keys(data).forEach((key) => {
            const value = data[key as keyof UpdateUserRequest];
            if (value !== null && value !== undefined && value !== '') {
              if (Array.isArray(value)) {
                // Handle arrays (like personal_phone)
                value.forEach((item) => {
                  formData.append(key, String(item));
                });
              } else if (typeof value === 'boolean') {
                formData.append(key, String(value));
              } else {
                formData.append(key, String(value));
              }
            }
          });
          
          // Append files
          files.forEach((file) => {
            formData.append('images', file);
          });
          
          const result = await baseQuery({
            url: `/users/${id}`,
            method: 'PATCH',
            body: formData,
          });
          
          if (result.error) {
            return { error: result.error };
          }
          return { data: result.data as UserResponse };
        } else {
          // Regular JSON request if no files
          const result = await baseQuery({
            url: `/users/${id}`,
            method: 'PATCH',
            body: data,
          });
          
          if (result.error) {
            return { error: result.error };
          }
          return { data: result.data as UserResponse };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
      // Optimistic update (only for non-file updates)
      async onQueryStarted({ id, data, files }, { dispatch, queryFulfilled }) {
        // Only do optimistic updates if no files (file uploads are slower, skip optimistic)
        if (!files || files.length === 0) {
          // Optimistically update the user in the list
          const patchResult = dispatch(
            usersApi.util.updateQueryData('getUsers', {} as UserFilters, (draft) => {
              const users = draft.users || draft.data?.items || [];
              const userIndex = users.findIndex((user) => user.id === id);
              if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...data };
              }
            })
          );

          // Also update the individual user query if it exists
          const userPatchResult = dispatch(
            usersApi.util.updateQueryData('getUserById', id, (draft) => {
              if (draft.user) {
                draft.user = { ...draft.user, ...data };
              }
            })
          );

          try {
            await queryFulfilled;
          } catch {
            // Rollback on error
            patchResult.undo();
            userPatchResult.undo();
          }
        }
      },
    }),

    // Update current user (with file upload support)
    updateCurrentUser: builder.mutation<UserResponse, { data: UpdateUserRequest; files?: File[] }>({
      queryFn: async (arg, _api, _extraOptions, baseQuery) => {
        const { data, files } = arg;
        
        if (files && files.length > 0) {
          // Use FormData if files are provided
          const formData = new FormData();
          
          // Append all user data fields
          Object.keys(data).forEach((key) => {
            const value = data[key as keyof UpdateUserRequest];
            if (value !== null && value !== undefined && value !== '') {
              if (Array.isArray(value)) {
                // Handle arrays (like personal_phone)
                value.forEach((item) => {
                  formData.append(key, String(item));
                });
              } else if (typeof value === 'boolean') {
                formData.append(key, String(value));
              } else {
                formData.append(key, String(value));
              }
            }
          });
          
          // Append files
          files.forEach((file) => {
            formData.append('images', file);
          });
          
          const result = await baseQuery({
            url: '/users/me',
            method: 'PATCH',
            body: formData,
          });
          
          if (result.error) {
            return { error: result.error };
          }
          return { data: result.data as UserResponse };
        } else {
          // Regular JSON request if no files
          const result = await baseQuery({
            url: '/users/me',
            method: 'PATCH',
            body: data,
          });
          
          if (result.error) {
            return { error: result.error };
          }
          return { data: result.data as UserResponse };
        }
      },
      invalidatesTags: (result) =>
        result?.user
          ? [
              { type: 'User', id: result.user.id },
              { type: 'User', id: 'LIST' },
            ]
          : [],
    }),

    // Delete user
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        // Store the user being deleted for rollback
        let deletedUser: User | null = null;

        // Optimistically remove the user from the list
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUsers', {} as UserFilters, (draft) => {
            const users = draft.users || draft.data?.items || [];
            const userIndex = users.findIndex((user) => user.id === id);
            if (userIndex !== -1) {
              deletedUser = users[userIndex];
              users.splice(userIndex, 1);
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
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetCurrentUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateCurrentUserMutation,
  useDeleteUserMutation,
} = usersApi;

