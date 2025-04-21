import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId'); // store user ID after login
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});
