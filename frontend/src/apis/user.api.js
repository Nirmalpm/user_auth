import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/user"
    : "/api/user";

export const isUserProfilePresent = async (userId) => {
  const response = await axios.post(`${API_URL}/isUserPresent`, {
    userId,
  });

  return response.data;
};
