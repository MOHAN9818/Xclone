import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const fetchPosts = () => api.get('/tweets');
export const createPost = formData => api.post('/tweets', formData);
export const toggleLike = id => api.put(`/tweets/like/${id}`);
export const deletePost = id => api.delete(`/tweets/${id}`);
export const addComment = (id, content) => api.post(`/tweets/${id}/comments`, { content });
export const fetchUsers = () => api.get('/users');
export const fetchMe = () => api.get('/users/me');
export const toggleFollow = id => api.put(`/users/${id}/follow`);
export const loginRequest = credentials => api.post('/auth/login', credentials);
export const registerRequest = details => api.post('/auth/signup', details);

export const getMediaUrl = path => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default api;
