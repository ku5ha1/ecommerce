import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminLayout() {
  const { token, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [token, isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                View Store
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout; 