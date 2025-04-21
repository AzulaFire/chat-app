import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

let onlineInterval;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });

      // Start polling for online users every 15 seconds
      if (!onlineInterval) {
        onlineInterval = setInterval(get().fetchOnlineUsers, 15000);
      }
    } catch (error) {
      console.log('Error in checkAuth:', error);
      set({ authUser: null });

      // Stop polling if checkAuth fails
      clearInterval(onlineInterval);
      onlineInterval = null;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  fetchOnlineUsers: async () => {
    try {
      const res = await axiosInstance.get('/auth/online');
      set({ onlineUsers: res.data });
    } catch (err) {
      console.log('Error fetching online users:', err);
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success('Account created successfully');

      // Start polling after signup
      if (!onlineInterval) {
        onlineInterval = setInterval(get().fetchOnlineUsers, 15000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success('Logged in successfully');

      // Start polling after login
      if (!onlineInterval) {
        onlineInterval = setInterval(get().fetchOnlineUsers, 15000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null, onlineUsers: [] });
      toast.success('Logged out successfully');

      // Stop polling after logout
      clearInterval(onlineInterval);
      onlineInterval = null;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({ authUser: res.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.log('error in update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
