// Backward compatibility wrapper for useAuth hook
// This allows existing code to continue using useAuth() while using Redux under the hood
import { useAppSelector, useAppDispatch } from '@/store';
import { login, logout } from '@/store/slices/authSlice';

export function useAuth() {
    const dispatch = useAppDispatch();
    const { user, loading, isAuthenticated } = useAppSelector((state) => state.auth);

    return {
        user,
        loading,
        isAuthenticated,
        login: (userData) => dispatch(login(userData)),
        logout: () => dispatch(logout()),
    };
}

// Keep AuthProvider for backward compatibility (no-op since Redux handles state)
export function AuthProvider({ children }) {
    return <>{children}</>;
}
