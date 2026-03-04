import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../lib/auth';

export function AppShell({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">LMS</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              {isAuthenticated ? (
                <>
                  <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
                    Subjects
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-gray-900 font-medium">
                    Profile
                  </Link>
                  <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                    <span className="text-sm text-gray-600">
                      {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
