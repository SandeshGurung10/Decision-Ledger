import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
};

export const decisionsAPI = {
  getAll: (params) => api.get('/decisions', { params }),
  getOne: (id) => api.get(`/decisions/${id}`),
  create: (data) => api.post('/decisions', data),
  update: (id, data) => api.patch(`/decisions/${id}`, data),
  delete: (id) => api.delete(`/decisions/${id}`),
  archive: (id) => api.patch(`/decisions/${id}/archive`),
  review: (id, status) => api.patch(`/decisions/${id}/review`, { status }),
};

export const referenceAPI = {
  getAll: () => api.get('/reference'),
};

export default api;