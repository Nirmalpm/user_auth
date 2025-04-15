import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/user"
    : "/api/user";

export const useUserStore = create((set) => ({
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
        userProfile: response.data.userProfile,
      });
    } catch (error) {
      set({
        error: error.message || "Error adding profile",
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
      console.log(response.data);
      set({ userProfile: response.data });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error adding profile",
      });
      throw error;
    }
  },
  addUpdateUserHome: async ({
    userId,
    profileUserId,
    fullName,
    userDesc,
    imagePath,
    isUpdate,
  }) => {
    console.log(
      "inside addUserHome:",
      userId,
      profileUserId,
      fullName,
      userDesc,
      imagePath,
      isUpdate
    );
    try {
      const response = await axios.post(`${API_URL}/addUpdateUserHome`, {
        userId,
        profileUserId,
        fullName,
        userDesc,
        imagePath,
        isUpdate,
      });
      set({
        userProfile: response.data,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        // Handle gracefully — no red error in console
        console.log("User Home already exists. Skipping insert.");
        // Optional: Show a toast, snackbar, or silent UI feedback
      } else {
        // Only log other errors
        console.error("Unexpected error while adding user:", error);
      }
    }
  },
  addUpdateUserAbout: async ({ userId, profileUserId, userDesc, isUpdate }) => {
    console.log(
      "inside addUpdateUserAbout:",
      userId,
      profileUserId,
      userDesc,
      isUpdate
    );
    try {
      const response = await axios.post(`${API_URL}/addUpdateUserAbout`, {
        userId,
        profileUserId,
        userDesc,
        isUpdate,
      });
      set({
        userProfile: response.data,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        // Handle gracefully — no red error in console
        console.log("User Home already exists. Skipping insert.");
        // Optional: Show a toast, snackbar, or silent UI feedback
      } else {
        // Only log other errors
        console.error("Unexpected error while adding user:", error);
      }
    }
  },
  saveFrontend: async ({ userId, profileUserId, skills }) => {
    console.log("inside saveFrontEnd:", userId, profileUserId, skills);
    try {
      const response = await axios.post(`${API_URL}/addFrontendSkills`, {
        userId,
        profileUserId,
        skills,
      });
      console.log(response.data);
      set({ userProfile: response.data });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error at saveFrontEnd",
      });
      throw error;
    }
  },
  saveBackend: async ({ userId, profileUserId, skills }) => {
    console.log("inside saveBackend:", userId, profileUserId, skills);
    try {
      const response = await axios.post(`${API_URL}/addBackendSkills`, {
        userId,
        profileUserId,
        skills,
      });
      console.log(response.data);
      set({ userProfile: response.data });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error at saveBackend",
      });
      throw error;
    }
  },
  saveOther: async ({ userId, profileUserId, skills }) => {
    console.log("inside saveOther:", userId, profileUserId, skills);
    try {
      const response = await axios.post(`${API_URL}/addOtherSkills`, {
        userId,
        profileUserId,
        skills,
      });
      console.log(response.data);
      set({ userProfile: response.data });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error at saveOther",
      });
      throw error;
    }
  },
  saveEducation: async (userId, profileUserId, education) => {
    console.log("inside updateEducation:", userId, profileUserId, education);
    try {
      const response = await axios.post(`${API_URL}/updateEducation`, {
        userId,
        profileUserId,
        education,
      });
      console.log(response.data);
      set({ userProfile: response.data });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error at saveEducation",
      });
      throw error;
    }
  },
  saveWork: async (userId, profileUserId, workexp) => {
    console.log("inside saveWork:", userId, profileUserId, workexp);
    try {
      const response = await axios.post(`${API_URL}/updateWorkExp`, {
        userId,
        profileUserId,
        workexp,
      });
      console.log(response.data);
      set({ userProfile: response.data });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error at saveWork",
      });
      throw error;
    }
  },
  saveCertification: async (userId, profileUserId, certification) => {
    console.log("inside saveWork:", userId, profileUserId, certification);
    try {
      const response = await axios.post(`${API_URL}/updateCertification`, {
        userId,
        profileUserId,
        certification,
      });
      console.log(response.data);
      set({ userProfile: response.data });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error at saveCertification",
      });
      throw error;
    }
  },
  saveProject: async (userId, profileUserId, project) => {
    console.log("inside saveProject:", userId, profileUserId, project);
    try {
      const response = await axios.post(`${API_URL}/updateProject`, {
        userId,
        profileUserId,
        project,
      });
      console.log(response.data);
      set({ userProfile: response.data });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error at saveProject",
      });
      throw error;
    }
  },
  reset: () => {
    set({ userProfile: null, error: null });
  },
}));
