import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getFarmerStats: async () => {
    const response = await api.get('/orders/farmer/stats');
    return response.data;
  },

  startDelivery: async (id) => {
    const response = await api.put(`/orders/${id}/status`, { status: 'out_for_delivery' });
    return response.data;
  },

  acceptDeliveryOrder: async (id) => {
    const response = await api.post(`/orders/${id}/delivery/accept`);
    return response.data;
  },

  verifyDeliveryOtp: async (id, otp) => {
    const response = await api.post(`/orders/${id}/delivery/verify`, { otp });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateDeliveryAddress: async (id, address) => {
    const response = await api.put(`/orders/${id}/delivery-address`, address);
    return response.data;
  },

  updateOrderStatus: async (id, status, note = '') => {
    const response = await api.put(`/orders/${id}/status`, { status, note });
    return response.data;
  },

  cancelOrder: async (id, reason = '') => {
    const response = await api.put(`/orders/${id}/cancel`, { reason });
    return response.data;
  }
};
