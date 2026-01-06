// Export the main pages
export { SignInPage } from './pages/SignInPage';
export { RegisterPage } from './pages/RegisterPage';

// Export API hooks
export {
  useSignInMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
} from './api/authApi';

