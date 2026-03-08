import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

// Conversation API
export const conversationAPI = {
  sendMessage: (data) => api.post('/conversations/message', data),
  getConversations: () => api.get('/conversations'),
  getConversation: (id) => api.get(`/conversations/${id}`)
};

// Profile API
export const profileAPI = {
  getUserProfile: () => api.get('/profile'),
  getTraitHistory: () => api.get('/profile/history'),
  updateIkigai: (data) => api.put('/profile/ikigai', data)
};

// Recommendation API
export const recommendationAPI = {
  generate: () => api.post('/recommendations/generate'),
  getRecommendations: () => api.get('/recommendations'),
  submitFeedback: (data) => api.post('/recommendations/feedback', data)
};

export default api;
