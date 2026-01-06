import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Search, Bell, User } from "lucide-react";
import {
  useMaterialTailwindController,
  setOpenSidenav,
  useAuth,
} from "@/providers";
import { getApiUrl } from "@/config/env";
import { useSearch } from "@/contexts/SearchContext";
import { useAppDispatch } from "@/store";
import { setOpenSidenav as setOpenSidenavRedux } from "@/store/slices/uiSlice";

// Page title and subtitle mapping
const getPageInfo = (pathname, userName) => {
  const path = pathname.toLowerCase();
  
  if (path.includes("/dashboard/home") || path === "/dashboard" || path === "/dashboard/") {
    return {
      title: "Dashboard",
      subtitle: `Welcome back, ${userName}`,
    };
  }
  if (path.includes("/dashboard/profile")) {
    return {
      title: "Profile",
      subtitle: "Manage your account settings and preferences",
    };
  }
  if (path.includes("/dashboard/users")) {
    return {
      title: "Users Management",
      subtitle: "Manage system users and permissions",
    };
  }
  if (path.includes("/dashboard/vouchers")) {
    return {
      title: "Vouchers Management",
      subtitle: "Manage and track gift vouchers",
    };
  }
  if (path.includes("/dashboard/projects")) {
    return {
      title: "Projects Management",
      subtitle: "Manage projects and configurations",
    };
  }
  if (path.includes("/dashboard/my-email-tracking")) {
    return {
      title: "My Email Tracking",
      subtitle: "View all your email tracking records",
    };
  }
  if (path.includes("/dashboard/send-email")) {
    return {
      title: "Send Email",
      subtitle: "Send emails using configured email transporters",
    };
  }
  
  return {
    title: "Dashboard",
    subtitle: `Welcome back, ${userName}`,
  };
};

export function DashboardNavbar() {
  const [controller] = useMaterialTailwindController();
  const reduxDispatch = useAppDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef(null);
  
  // Get user display info
  const userName = user?.name || user?.email || 'User';
  const userEmail = user?.email || '';
  const userRole = user?.role?.name || user?.role_name || 'User';
  
  // Get user profile image from attachments
  const userProfileImage = user?.attachments?.[0]?.path_URL;
  const userAvatarUrl = userProfileImage 
    ? `${getApiUrl()}/files/${userProfileImage}`
    : null;
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`;
  const hasUserImage = userAvatarUrl && !imageError;
  
  // Get page info
  const pageInfo = getPageInfo(pathname, userName);

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false);
  }, [user?.attachments?.[0]?.path_URL]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="relative z-[9998] bg-gradient-to-r from-white via-gray-50 to-white shadow-lg border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => reduxDispatch(setOpenSidenavRedux(true))}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        
        {/* Page Title */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <div className="hidden sm:block w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full flex-shrink-0"></div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              {pageInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 flex items-center truncate">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="truncate">{pageInfo.subtitle}</span>
            </p>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Bell Notification Icon */}
          <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div ref={menuRef} className="relative flex items-center space-x-2 sm:space-x-4 bg-white rounded-xl sm:rounded-2xl px-2 sm:px-4 py-1.5 sm:py-2 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="relative hidden sm:block">
              {hasUserImage ? (
                <img
                  src={userAvatarUrl}
                  alt="User"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-white shadow-md hover:border-blue-600 transition-all duration-200 object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-white shadow-md hover:border-blue-600 transition-all duration-200 bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="text-xs sm:text-sm hidden sm:block">
              <p className="font-semibold text-gray-900 truncate max-w-[100px] sm:max-w-none">
                {userName}
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110 touch-manipulation"
              >
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-50 rounded-t-xl">
                      <div className="flex items-center space-x-3">
                        {hasUserImage ? (
                          <img
                            src={userAvatarUrl}
                            alt="User"
                            className="w-12 h-12 rounded-lg border-2 border-white shadow-md object-cover"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg border-2 border-white shadow-md bg-blue-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-600">{userEmail}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                            {userRole}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Profile Button */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/dashboard/profile");
                      }}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group touch-manipulation min-h-[44px]"
                    >
                      <UserCircleIcon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600 transition-colors duration-200 flex-shrink-0" />
                      Profile
                    </button>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group touch-manipulation min-h-[44px]"
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-600 transition-colors duration-200 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
