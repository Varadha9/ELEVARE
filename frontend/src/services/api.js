// Import axios — HTTP client used for all API calls to the backend
import axios from 'axios';

// Base URL read from Vite env variable, falls back to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a shared axios instance so all requests share the same base URL and headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // 35s timeout — allows 30s for the AI service to respond + 5s backend overhead
  timeout: 35000
});

// Request interceptor — automatically attaches the JWT token to every request
// This means individual API calls don't need to manually set the Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — centralized error handling for all API responses
api.interceptors.response.use(
  (response) => response, // Pass successful responses through unchanged
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // If the server returns 401 (token expired/invalid), clear local storage and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API — authentication endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  // Backend uses /profile (not /auth/profile) for the authenticated user's data
  getProfile: () => api.get('/profile'),
  // Logout only clears local storage — no server call needed since JWTs are stateless
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

// Conversation API — chat and history endpoints
export const conversationAPI = {
  sendMessage:     (data) => api.post('/conversations/message', data),
  getHistory:      ()     => api.get('/conversations/history'),
  getConversation: (id)   => api.get(`/conversations/${id}`)
};

// Profile API — user profile and Ikigai endpoints
export const profileAPI = {
  getUserProfile: ()     => api.get('/profile'),
  updateProfile:  (data) => api.put('/profile', data),
  getTraitHistory:()     => api.get('/profile/history'),
  updateIkigai:   (data) => api.put('/profile/ikigai', data)
};

// Recommendation API — career recommendation endpoints
export const recommendationAPI = {
  generate:          ()     => api.post('/recommendations/generate'),
  getRecommendations:()     => api.get('/recommendations'),
  submitFeedback:    (data) => api.post('/recommendations/feedback', data)
};

// Health API — used to check if the backend is running
export const healthAPI = {
  // Uses absolute URL to bypass the /api base URL prefix
  check: () => api.get('/health', { baseURL: 'http://localhost:5000' })
};

export default api;
