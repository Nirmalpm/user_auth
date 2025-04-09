import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/user"
    : "/api/user";

export const useUserStore = create((set) => ({
  isUserProfileAdded: false,
  userProfile: null,
  error: null,
  addUserProfile: async (user) => {
    console.log("inside addprofile:", user);
    try {
      const response = await axios.post(`${API_URL}/addUser`, {
        email: user.email,
        userId: user._id,
        name: user.name,
      });
      set({
        userProfile: {
          email: user.email,
          userId: user._id,
          name: user.name,
        },
        isUserProfileAdded: true,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error adding profile",
        isUserProfileAdded: false,
      });
      throw error;
    }
  },
  loadUserProfile: async (user) => {
    console.log("inside loadUserProfile:", user);
    try {
      const response = await axios.post(`${API_URL}/loadUserProfile`, {
        userId: user._id,
      });
      //set({ user, isUserProfileAdded: true });
    } catch (error) {
      set({
        error: error.response.data.message || "Error adding profile",
        isUserProfileAdded: false,
      });
      throw error;
    }
  },
  isUserProfilePresent: async (user) => {
    console.log("inside isUserProfilePresent:", user);
    try {
      const response = await axios.post(`${API_URL}/isUserPresent`, {
        userId: user._id,
      });
      console.log(response.data);
      const { id } = await response.data;
      set({
        isUserProfileAdded: id !== undefined && id !== null,
        userProfile: { userId: id },
      });
      return { userId: id };
    } catch (error) {
      set({
        error: error.message || "Error in isUserProfilePresent",
        isUserProfileAdded: false,
      });
      throw error;
    }
  },
  addUserHome: async ({ userId, fullName, userDesc, imagePath }) => {
    console.log("inside addUserHome:", userId, fullName, userDesc, imagePath);
    try {
      const response = await axios.post(`${API_URL}/addUserHome`, {
        userId,
        fullName,
        userDesc,
        imagePath,
      });
      set({
        isUserProfileAdded: true,
        userProfile: { userId, fullName, userDesc, imagePath },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        // Handle gracefully — no red error in console
        console.log("User already exists. Skipping insert.");
        // Optional: Show a toast, snackbar, or silent UI feedback
      } else {
        // Only log other errors
        console.error("Unexpected error while adding user:", error);
      }
    }
  },
  isUserProfileHomePresent: async ({ userId }) => {
    console.log("inside isUserProfileHomePresent:", userId);
    try {
      const response = await axios.post(`${API_URL}/isUserProfileHomePresent`, {
        userId,
      });
      console.log(response.data);
      set({
        isUserProfileAdded: true,
        userProfile: { ...response.data.user },
      });
      return response.data.user;
    } catch (error) {
      set({
        error: error.message || "Error in isUserProfileHomePresent",
        isUserProfileAdded: false,
      });
      throw error;
    }
  },
  reset: () => {
    set({ isUserProfileAdded: false, userProfile: null, error: null });
  },
}));
