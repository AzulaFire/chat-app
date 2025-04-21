import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

let pollingInterval = null;

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      set({ users: res.data });
    } catch (error) {
      console.error('getUsers error:', error);
      toast.error(error?.response?.data?.error || 'Failed to fetch users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error('getMessages error:', error);
      toast.error(error?.response?.data?.error || 'Failed to fetch messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error('sendMessage error:', error);
      toast.error(error?.response?.data?.error || 'Failed to send message');
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    // Clear any existing polling
    if (pollingInterval) clearInterval(pollingInterval);

    // Poll every 3 seconds
    pollingInterval = setInterval(async () => {
      try {
        const res = await axiosInstance.get(`/messages/${selectedUser._id}`);
        set({ messages: res.data });
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
  },

  unsubscribeFromMessages: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
