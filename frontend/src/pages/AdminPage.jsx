import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as adminService from '../services/adminService';

function AdminPage() {
  const navigate = useNavigate();
  const { token, user, isAdmin } = useAuth();
  
  // State for different sections
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Error states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    fetchDashboardStats();
  }, [token, isAdmin, navigate]);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const stats = await adminService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoadingStats(false);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const ordersData = await adminService.getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await adminService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    
    // Fetch data based on tab
    if (tab === 'orders') {
      fetchOrders();
    } else if (tab === 'users') {
      fetchUsers();
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setSuccess('Order status updated successfully');
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    }
  };

  const handleUserAdminToggle = async (userId, makeAdmin) => {
    try {
      await adminService.updateUserAdminStatus(userId, makeAdmin);
      setSuccess(`User admin status updated successfully`);
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error('Error updating user admin status:', error);
      setError('Failed to update user admin status');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username}</h2>
          <p className="text-gray-600">Manage your store from the admin dashboard</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'orders', label: 'Orders' },
            { id: 'users', label: 'Users' },
            { id: 'products', label: 'Products' },
            { id: 'categories', label: 'Categories' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {dashboardStats ? (
              <>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">{dashboardStats['Total Users']}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
                  <p className="text-3xl font-bold text-green-600">{dashboardStats['Total Orders']}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
                  <p className="text-3xl font-bold text-purple-600">Rs.{dashboardStats['Total Revenue']}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
                  <p className="text-3xl font-bold text-orange-600">{dashboardStats['Total Products']}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Out of Stock</h3>
                  <p className="text-3xl font-bold text-red-600">{dashboardStats['Total out of Stock']}</p>
                </div>
              </>
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard statistics...</p>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">All Orders</h2>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No orders found</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            Customer: {order.user_details?.username || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: Rs.{order.total_amount}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {order.status || 'Processing'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <select
                            value={order.status || 'processing'}
                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">All Users</h2>
            </div>
            <div className="p-6">
              {users.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No users found</p>
              ) : (
                <div className="space-y-4">
                  {users.map((userItem) => (
                    <div key={userItem.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{userItem.username}</h3>
                          <p className="text-sm text-gray-600">{userItem.email}</p>
                          <p className="text-sm text-gray-600">
                            Role: {userItem.is_admin ? 'Admin' : 'Customer'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {userItem.id !== user?.id && (
                            <button
                              onClick={() => handleUserAdminToggle(userItem.id, !userItem.is_admin)}
                              className={`px-3 py-1 rounded text-sm ${
                                userItem.is_admin
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {userItem.is_admin ? 'Remove Admin' : 'Make Admin'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Product Management</h2>
              <p className="text-gray-600 mt-2">Product management features coming soon...</p>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Category Management</h2>
              <p className="text-gray-600 mt-2">Category management features coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage; 