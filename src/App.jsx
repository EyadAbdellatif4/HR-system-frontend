import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/features/admin/dashboard/layouts/DashboardLayout";
import { AuthLayout } from "@/features/auth/layouts/AuthLayout";
import { LoadingSpinner } from "@/common/components";
import { useAppSelector } from "@/store";

function AppRoutes() {
  const { user, loading } = useAppSelector((state) => ({
    user: state.auth.user,
    loading: state.auth.loading,
  }));

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      <Route path="/dashboard/*" element={<DashboardLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route 
        path="*" 
        element={
          <Navigate 
            to={user ? "/dashboard/home" : "/auth/sign-in"} 
            replace 
          />
        } 
      />
    </Routes>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
