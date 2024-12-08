import React from 'react';
import { User, LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get username from localStorage
  const username = localStorage.getItem('username') || 'Guest';

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Navigate to dashboard
  const handleDashboardNavigation = () => {
    navigate('/dashboard');
  };

  // Determine if we're already on the dashboard
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <header className="bg-white h-16 top-0 left-0 right-0 shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Welcome Message */}
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold text-gray-800 hidden sm:block">
              Welcome back, {username}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Dashboard Button - Only show if not on dashboard page */}
            {!isDashboardPage && (
              <button
                onClick={handleDashboardNavigation}
                className="
                  flex items-center justify-center 
                  bg-blue-500 text-white 
                  px-3 py-2 
                  rounded-md 
                  hover:bg-blue-600 
                  transition-colors 
                  duration-300
                  group
                "
                title="Go to Dashboard"
              >
                <LayoutDashboard 
                  className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" 
                />
                <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
              </button>
            )}

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-yellow-800" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {username}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="
                flex items-center justify-center 
                bg-red-500 text-white 
                px-3 py-2 
                rounded-md 
                hover:bg-red-600 
                transition-colors 
                duration-300
                group
              "
              title="Logout"
            >
              <LogOut 
                className="w-5 h-5 mr-2 group-hover:rotate-6 transition-transform" 
              />
              <span className="hidden sm:inline text-sm font-medium">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;