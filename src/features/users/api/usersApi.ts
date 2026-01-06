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

    // Create user
    createUser: builder.mutation<UserResponse, CreateUserRequest>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, { type: 'Dashboard', id: 'LIST' }],
    }),

    // Update user
    updateUser: builder.mutation<UserResponse, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
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
      },
    }),

    // Update current user
    updateCurrentUser: builder.mutation<UserResponse, UpdateUserRequest>({
      query: (userData) => ({
        url: '/users/me',
        method: 'PATCH',
        body: userData,
      }),
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

