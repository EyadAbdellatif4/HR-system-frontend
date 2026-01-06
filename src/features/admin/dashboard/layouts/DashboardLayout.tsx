import { Routes, Route, Navigate } from "react-router-dom";
import {
  Sidenav,
  DashboardNavbar,
} from "@/common/layout";
import { adminRoutes } from "../routes";
import { useMaterialTailwindController, useAuth } from "@/common/providers";
import { DashboardPage } from "../pages/DashboardPage";
import { ProfilePage } from "@/features/admin/profile";
import { AssetsPage } from "@/features/admin/assets";
import { EmployeesPage } from "@/features/admin/users";
import { LoadingSpinner, ProtectedRoute, ToastContainer } from "@/common/components";
import { SearchProvider } from "@/common/hooks/useSearch";

// Add CSS for toast animation
const toastStyles = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;

export function DashboardLayout() {
  // ===== STEP 1: GET THEME SETTINGS =====
  // This is for UI customization (light/dark mode, sidebar type, etc.)
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  
  // ===== STEP 2: GET USER INFO =====
  // useAuth() gives us the logged-in user data and loading state
  const { user, loading, logout } = useAuth();

  // ===== STEP 3: SHOW LOADING SPINNER =====
  // While checking if user is logged in, show loading spinner
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // ===== STEP 4: USE ADMIN ROUTES =====
  // All authenticated users see admin routes (home and profile)
  const routesToShow = adminRoutes;

  // ===== STEP 6: RENDER THE DASHBOARD =====
  // This is where we actually show the UI
  return (
    <ProtectedRoute user={user} loading={loading}>
      <style>{toastStyles}</style>
      <SearchProvider>
        <div className="flex h-screen bg-gray-50">
          {/* LEFT SIDEBAR - Shows menu items based on user role */}
          <Sidenav
            routes={[{ layout: "dashboard", pages: routesToShow }]}
            brandImg={
              sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
            }
          />
          
          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 w-full min-w-0">
            {/* TOP NAVBAR - Shows user info and search */}
            <DashboardNavbar />
            
            {/* PAGE CONTENT - Shows different pages based on URL */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
              <Routes>
                {/* If URL is "/dashboard", redirect to home */}
                <Route path="/" element={<Navigate to="home" replace />} />
                
                {/* Home - Everyone can access */}
                <Route path="home" element={<DashboardPage />} />
                
                {/* Profile - Everyone can access */}
                <Route path="profile" element={<ProfilePage />} />
                
                {/* Employees - Everyone can access */}
                <Route path="employees" element={<EmployeesPage />} />
                
                {/* Assets - Everyone can access */}
                <Route path="assets" element={<AssetsPage />} />
              </Routes>
            </main>
          </div>
        </div>
        <ToastContainer />
      </SearchProvider>
    </ProtectedRoute>
  );
}

DashboardLayout.displayName = "/src/features/admin/dashboard/layouts/DashboardLayout.tsx";

export default DashboardLayout;
