import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/pas"
    : "/api/pas";
const EmpType = {
  SPR: 1,
  DOC: 2,
  REC: 3,
  ATD: 4,
  SEC: 5,
  PHA: 6,
  NUR: 7,
  HNR: 8,
  HKP: 9,
  STF: 10,
  LAB: 11,
  DIT: 12,
  CLN: 13,
  MGR: 14,
  ADM: 15,
};
export const usePasStore = create((set, get) => ({
  getHealthNews: async (page, pageSize) => {
    //console.log("inside getFreeNews:", category);
    const pg = page || 1;
    const pgSz = pageSize || 10;
    //console.log(`${API_URL}/getHealthNews?page=${pg}&pageSize=${pgSz}`)
    try {
      const response = await axios.get(
        `${API_URL}/getHealthNews?page=${pg}&pageSize=${pgSz}`
      );
      // console.log(response.data);

      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error at getFreeNews",
      });
      throw error;
    }
  },
  addDepartment: async (name) => {
    try {
      const response = await axios.post(`${API_URL}/addDept`, { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getDepartments: async () => {
    try {
      const response = await axios.get(`${API_URL}/getDepts`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addDoctor: async (doctor) => {
    const data = { ...doctor, empType: EmpType.DOC };
    try {
      const response = await axios.post(`${API_URL}/addEmployee`, data);
      return await get().getDoctors();
    } catch (error) {
      throw error;
    }
  },
  getDoctors: async () => {
    try {
      const response = await axios.get(`${API_URL}/getDoctors`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addWard: async (ward) => {
    try {
      const response = await axios.post(`${API_URL}/addWard`, ward);
      return await get().getWards();
    } catch (error) {
      throw error;
    }
  },
  getWards: async () => {
    try {
      const response = await axios.get(`${API_URL}/getWards`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPatientsByWard: async (wardId) => {
    try {
      const response = await axios.get(
        `${API_URL}/getPatientsByWard?wardId=${wardId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));
