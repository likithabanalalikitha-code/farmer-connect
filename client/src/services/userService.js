import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/user/notifications');
    return response.data;
  },

  markNotificationRead: async (id) => {
    const response = await api.put(`/user/notifications/${id}/read`);
    return response.data;
  }
};

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (id, data) => {
    const response = await api.put(`/admin/users/${id}/status`, data);
    return response.data;
  },

  getProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  updateProductStatus: async (id, isActive) => {
    const response = await api.put(`/admin/products/${id}/status`, { isActive });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  getOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  assignDeliveryAgent: async (orderId, agentId) => {
    const response = await api.put(`/admin/orders/${orderId}/assign-agent`, { agentId });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  getAISummary: async () => {
    const response = await api.get('/admin/ai-summary');
    return response.data;
  }
};
