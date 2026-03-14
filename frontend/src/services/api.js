import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 35000 // 35s to allow AI service (30s) + backend overhead
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // If token is invalid, clear it
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/profile'), // Fixed: backend uses /profile not /auth/profile
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

// Conversation API
export const conversationAPI = {
  sendMessage: (data) => api.post('/conversations/message', data),
  getHistory: () => api.get('/conversations/history'), // Fixed: backend uses /conversations/history
  getConversation: (id) => api.get(`/conversations/${id}`)
};

// Profile API
export const profileAPI = {
  getUserProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getTraitHistory: () => api.get('/profile/history'),
  updateIkigai: (data) => api.put('/profile/ikigai', data)
};

// Recommendation API
export const recommendationAPI = {
  generate: () => api.post('/recommendations/generate'),
  getRecommendations: () => api.get('/recommendations'),
  submitFeedback: (data) => api.post('/recommendations/feedback', data)
};

// Health check API
export const healthAPI = {
  check: () => api.get('/health', { baseURL: 'http://localhost:5000' }) // Direct health check
};

export default api;