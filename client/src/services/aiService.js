import api from './api';

export const aiService = {
  sendMessage: async (message, history = []) => {
    const response = await api.post('/ai/chat', { message, history });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/ai/history');
    return response.data;
  },

  clearHistory: async () => {
    const response = await api.delete('/ai/history');
    return response.data;
  }
};
