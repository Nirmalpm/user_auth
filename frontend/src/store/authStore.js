import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  appUsers: [],
  signup: async (email, password, name, phoneNumber) => {
    set({ isLoading: true, error: null });
    //console.log(email, password, name, phoneNumber);
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
        phoneNumber,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error loggin in",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  addUserProfile: async (user) => {
    //console.log("inside addprofile:", user);
    try {
      const response = await axios.post(`${API_URL}/addUser`, {
        email: user.email,
        userId: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      });
      set({
        userProfile: response.data.userProfile,
      });
    } catch (error) {
      set({
        error: error.message || "Error adding profile",
      });
      throw error;
    }
  },
  checkAuth: async () => {
    //await new Promise((resolve) => setTimeout(resolve, 2000));
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
      throw error;
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response.data.message || "Error sending reset password email",
        isLoading: false,
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/password-reset/${token}`, {
        password,
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response.data.message || "Error sending resetting password",
        isLoading: false,
      });
      throw error;
    }
  },
  getUsersByRole: async () => {
    try {
      const response = await axios.get(`${API_URL}/usersbyrole`);
      set({ appUsers: response.data.users });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateUserRole: async (userId, role) => {
    try {
      const response1 = await axios.post(`${API_URL}/updaterole`, {
        userId,
        role,
      });
      const response2 = await axios.get(`${API_URL}/usersbyrole`);
      set({ appUsers: response2.data.users });
      return response2.data.users;
    } catch (error) {
      throw error;
    }
  },
  removeUserRole: async (userId, role) => {
    try {
      const response1 = await axios.post(`${API_URL}/removerole`, {
        userId,
        role,
      });
      const response2 = await axios.get(`${API_URL}/usersbyrole`);
      set({ appUsers: response2.data.users });
      return response2.data.users;
    } catch (error) {
      throw error;
    }
  },
  addUser: async (name, email, password, phoneNumber) => {
    try {
      const response1 = await axios.post(`${API_URL}/createuser`, {
        name,
        email,
        password,
        phoneNumber,
      });
      const response2 = await axios.get(`${API_URL}/usersbyrole`);
      set({ appUsers: response2.data.users });
      return response2.data.users;
    } catch (error) {
      throw error;
    }
  },
  getAccesLogs: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAccessLogs`);
      //console.log(response);
      return response.data;
    } catch (error) {}
  },
  deleteAccessLogs: async (selectedIds) => {
    //console.log(selectedIds)
    try {
      const response = await axios.post(`${API_URL}/deleteAccessLogs`, {
        ids: selectedIds,
      });
      //console.log(response);
      return response.data;
    } catch (error) {}
  },
}));
