import axios from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://farmer-connect-27i9.vercel.app/api' : '/api');

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fmc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: standard error extraction
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('fmc_token');
        localStorage.removeItem('fmc_user');
        // Do not force reload if already on auth screens
        if (
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')
        ) {
          // Dispatch custom event for auth context to detect
          window.dispatchEvent(new Event('fmc_unauthorized'));
        }
      }

      const errorMessage =
        error.response.data?.message ||
        (error.response.data?.errors && error.response.data.errors[0]?.message) ||
        'An error occurred while communicating with the server.';

      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      return Promise.reject(new Error('Network error. Please check your internet connection or server status.'));
    }
    return Promise.reject(error);
  }
);

export default api;
