// Export the main page
export { EmployeesPage } from './pages/EmployeesPage';

// Export API hooks
export {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetCurrentUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateCurrentUserMutation,
} from './api/usersApi';

// Export types
export type { User, UserFilters, CreateUserRequest, UpdateUserRequest } from '@/types/api.types';

