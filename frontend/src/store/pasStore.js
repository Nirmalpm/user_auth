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
  doctors: [],
  depts: [],
  patients: [],
  wards: [],
  pharmacyItems: [],
  canteenItems: [],
  tests: [],
  isLoading: false,
  employee: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  error: null,
  login: async (userId, password) => {
    console.log(userId, password);
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        emp_code: userId,
        password,
      });
      set({
        employee: response.data.employee,
        isAuthenticated: response.data.isAuthenticated,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error at login",
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/checkAuth`);
      set({
        employee: response.data.employee,
        isAuthenticated: response.data.isAuthenticated,
        isLoading: false,
        isCheckingAuth: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Error at check Auth",
      });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        employee: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
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
      set({ doctors: response.data });
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
      set({ wards: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addPharmacyItem: async (item) => {
    try {
      const response = await axios.post(`${API_URL}/addPharmacyItem`, item);
      return await get().getPharmacyItems();
    } catch (error) {
      throw error;
    }
  },
  getPharmacyItems: async () => {
    try {
      const response = await axios.get(`${API_URL}/getPharmacyItems`);
      set({ pharmacyItems: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addCanteenItem: async (item) => {
    try {
      const response = await axios.post(`${API_URL}/addCanteenItem`, item);
      return await get().getPharmacyItems();
    } catch (error) {
      throw error;
    }
  },
  getCanteenItems: async () => {
    try {
      const response = await axios.get(`${API_URL}/getCanteenItems`);
      set({ canteenItems: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addTest: async (test) => {
    try {
      const response = await axios.post(`${API_URL}/addTest`, test);
      return await get().getTests();
    } catch (error) {
      throw error;
    }
  },
  getTests: async () => {
    try {
      const response = await axios.get(`${API_URL}/getTests`);
      set({ tests: response.data });
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
  vacatePatientWard: async (wardId, patient_id) => {
    try {
      const response = await axios.post(`${API_URL}/vacatePatientWard`, {
        wardId,
        patient_id,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getVacantBeds: async (wardId) => {
    try {
      const response = await axios.get(
        `${API_URL}/getVacantBedNumbers?wardId=${wardId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  registerPatient: async (patient) => {
    try {
      const response = await axios.post(`${API_URL}/registerPatient`, patient);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPatients: async () => {
    try {
      const response = await axios.get(`${API_URL}/getPatients`);
      set({ patients: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  admitPatient: async (patient) => {
    try {
      const response = await axios.post(`${API_URL}/admitPatient`, patient);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addOpConsultation: async (outPatientCounsult) => {
    try {
      const response = await axios.post(
        `${API_URL}/addOpConsultation`,
        outPatientCounsult
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));
