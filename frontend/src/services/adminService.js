import api from './axiosInstance';

// Dashboard Stats
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
};

// Product Management
export const createProduct = async (productData) => {
  const response = await api.post('/admin/add-product', productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/admin/update/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/admin/${productId}`);
  return response.data;
};

// Category Management
export const createCategory = async (categoryData) => {
  const response = await api.post('/admin/add-category', categoryData);
  return response.data;
};

export const updateCategory = async (categoryId, categoryData) => {
  const response = await api.put(`/admin/update/${categoryId}`, categoryData);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/admin/${categoryId}`);
  return response.data;
};

// Order Management
export const getAllOrders = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.user_id) params.append('user_id', filters.user_id);
  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  
  const response = await api.get(`/admin/view-all-orders?${params.toString()}`);
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await api.get(`/admin/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/admin/order/status/${orderId}`, { status });
  return response.data;
};

export const getShippingInfo = async (orderId) => {
  const response = await api.get(`/admin/shipping-info/${orderId}`);
  return response.data;
};

// User Management
export const getAllUsers = async () => {
  const response = await api.get('/admin/all-users');
  return response.data;
};

export const updateUserAdminStatus = async (userId, makeAdmin) => {
  const response = await api.put(`/admin/users/${userId}`, { make_admin: makeAdmin });
  return response.data;
}; 