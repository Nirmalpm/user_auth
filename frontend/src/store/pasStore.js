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
      console.log(response.data);
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
  addPatientConsumables: async (patient_id, patient_code, items) => {
    try {
      const response = await axios.post(`${API_URL}/addPatientConsumables`, {
        patient_code,
        patient_id,
        items,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPatientConsumables: async (patient_id, buy_date) => {
    try {
      const response = await axios.get(
        `${API_URL}/getPatientConsumables?patient_id=${patient_id}&buy_date=${buy_date}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPatientConsumablesHistory: async (patient_id) => {
    try {
      const response = await axios.get(
        `${API_URL}/getPatientConsumablesHistory?patient_id=${patient_id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  setFullPaidStatus: async (patient_id, buy_date) => {
    try {
      const response = await axios.post(`${API_URL}/setFullPaidStatus`, {
        patient_id,
        buy_date,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  setItemPaidStatus: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/setItemPaidStatus`, { id });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addPatientTest: async (patient_id, patient_code, tests) => {
    try {
      const response = await axios.post(`${API_URL}/addPatientTest`, {
        patient_id,
        patient_code,
        tests,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPatientTests: async (patient_id, test_date) => {
    try {
      const response = await axios.get(
        `${API_URL}/getPatientTests?patient_id=${patient_id}&test_date=${test_date}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPatientTestHistory: async (patient_id) => {
    try {
      const response = await axios.get(
        `${API_URL}/getPatientTestHistory?patient_id=${patient_id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  setFullTestPaidStatus: async (patient_id, test_date) => {
    try {
      const response = await axios.post(`${API_URL}/setFullTestPaidStatus`, {
        patient_id,
        test_date,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  setTestPaidStatus: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/setTestPaidStatus`, { id });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addMiscItems: async (patient_id, patient_code, ward_id, doctor_id, items) => {
    try {
      const response = await axios.post(`${API_URL}/addMiscItems`, {
        patient_id,
        patient_code,
        ward_id,
        doctor_id,
        items,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getMiscBillItemTypes: async () => {
    try {
      const response = await axios.get(`${API_URL}/getMiscBillItemTypes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getBillings: async (patient_code) => {
    try {
      const response = await axios.get(
        `${API_URL}/getMiscBillItemTypes?patient_code=${patient_code}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getItemsByBill: async (patient_code) => {
    try {
      const response = await axios.get(
        `${API_URL}/getItemsByBill?user_id=${patient_code}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getMiscItems: async (patient_id, item_date) => {
    try {
      const response = await axios.get(
        `${API_URL}/getMiscItems?patient_id=${patient_id}&item_date=${item_date}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getMiscItemsHistory: async (patient_id) => {
    try {
      const response = await axios.get(
        `${API_URL}/getMiscItemsHistory?patient_id=${patient_id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  payOutstandingBills: async (outstandingBills) => {
    try {
      const response = await axios.post(`${API_URL}/payOutstandingBills`, {
        outstandingBills,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getTestPatients: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/getTestPatients?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getDeptDoctors: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/getDeptDoctors?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addFoodOrder: async (user_id, items) => {
    try {
      const response = await axios.post(`${API_URL}/addFoodOrder`, {
        user_id,
        items,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getFoodOrders: async (user_id, buy_date) => {
    try {
      const response = await axios.get(
        `${API_URL}/getFoodOrders?user_id=${user_id}&buy_date=${buy_date}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPatientFoodOrderHistory: async (patient_code) => {
    try {
      const response = await axios.get(
        `${API_URL}/getPatientConsumablesHistory?patient_code=${patient_code}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  setFullFoodPaidStatus: async (user_id, buy_date) => {
    try {
      const response = await axios.post(`${API_URL}/setFullFoodPaidStatus`, {
        user_id,
        buy_date,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  setFoodPaidStatus: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/setFoodPaidStatus`, { id });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));
