import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosInstance';

function ProfilePage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  
  // Profile state
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: ''
  });
  
  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Error states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile/');
      setProfile(response.data);
      setEditForm({
        username: response.data.username,
        email: response.data.email
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Don't show error for orders, just log it
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchOrders();
    }
  }, [token]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/profile/update', editForm);
      setProfile(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setUpdating(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setError('');
    setSuccess('');

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New passwords do not match');
      setChangingPassword(false);
      return;
    }

    try {
      await api.put('/profile/update-password', {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      });
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      setIsChangingPassword(false);
      setSuccess('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Failed to update password');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle order details
  const handleOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
      setShowOrderDetails(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-gray-600 mb-4">You need to be logged in to view your profile.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            
            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-lg">{profile?.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-lg">{profile?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Type</label>
                  <p className="text-lg">{profile?.is_admin ? 'Admin' : 'Customer'}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        username: profile?.username || '',
                        email: profile?.email || ''
                      });
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            
            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.old_password}
                    onChange={(e) => setPasswordForm({...passwordForm, old_password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({
                        old_password: '',
                        new_password: '',
                        confirm_password: ''
                      });
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Order History</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No orders found</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">Total: Rs.{order.total_amount}</p>
                    </div>
                    <button
                      onClick={() => handleOrderDetails(order.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Order Details</h3>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Order Information</h4>
                    <p>Order ID: #{selectedOrder.id}</p>
                    <p>Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                    <p>Total: Rs.{selectedOrder.total_amount}</p>
                    <p>Status: {selectedOrder.status || 'Processing'}</p>
                  </div>
                  
                  {selectedOrder.shipping_info && (
                    <div>
                      <h4 className="font-semibold">Shipping Information</h4>
                      <p>Name: {selectedOrder.shipping_info.full_name}</p>
                      <p>Email: {selectedOrder.shipping_info.email}</p>
                      <p>Phone: {selectedOrder.shipping_info.phone}</p>
                      <p>Method: {selectedOrder.shipping_info.delivery_method}</p>
                      {selectedOrder.shipping_info.delivery_method === 'pickup' && (
                        <>
                          <p>Pickup Time: {selectedOrder.shipping_info.pickup_time ? new Date(selectedOrder.shipping_info.pickup_time).toLocaleString() : 'To be confirmed'}</p>
                          <p>Pickup Location: YourStore HQ, 123 Main Street, Mumbai, MH 400001</p>
                        </>
                      )}
                      {selectedOrder.shipping_info.delivery_method === 'delivery' && (
                        <>
                          <p>Address: {selectedOrder.shipping_info.address}</p>
                          <p>City: {selectedOrder.shipping_info.city}</p>
                          <p>State: {selectedOrder.shipping_info.state}</p>
                          <p>ZIP: {selectedOrder.shipping_info.zip}</p>
                          <p>Country: {selectedOrder.shipping_info.country}</p>
                        </>
                      )}
                    </div>
                  )}
                  
                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Order Items</h4>
                      <div className="space-y-2">
                        {selectedOrder.order_items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <div>
                              <p className="font-medium">{item.product?.name || `Product ${item.product_id}`}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">Rs.{item.price_at_purchase}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;