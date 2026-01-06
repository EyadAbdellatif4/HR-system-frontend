import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { LoadingSpinner } from "@/shared/components";
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
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
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
