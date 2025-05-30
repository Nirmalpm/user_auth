import express from "express";
import {
  login,
  checkAuth,
  logout,
} from "../controllers/pas.login.controller.js";
import {
  getHealthNews,
  getDepts,
  addDept,
  addEmployee,
  getDoctors,
  registerPatient,
  getVacantBedNumbers,
  getPatients,
  vacatePatientWard,
  admitPatient,
  getPatientsByWard,
  addOpConsultation,
  addPatientConsumables,
  getPatientConsumables,
  getPatientConsumablesHistory,
  setFullPaidStatus,
  setItemPaidStatus,
  setTestPaidStatus,
  setFullTestPaidStatus,
  getPatientTestHistory,
  getPatientTests,
  addPatientTest,
  getMiscBillItemTypes,
  getBillings,
  getItemsByBill,
  addMiscItems,
  getMiscItems,
  getMiscItemsHistory,
  payOutstandingBills,
  getTestPatients,
  getDeptDoctors,
  addFoodOrder,
  getFoodOrders,
  getPatientFoodOrderHistory,
  setFoodPaidStatus,
  setFullFoodPaidStatus,
} from "../controllers/pas.controller.js";

import {
  addTest,
  editTest,
  deleteTest,
  addPharmacyItem,
  editPharmacyItem,
  deletePharmacyItem,
  addCanteenItem,
  editCanteenItem,
  deleteCanteenItem,
  addWard,
  editWard,
  deleteWard,
  getTests,
  searchTests,
  getPharmacyItems,
  searchPharmacyItems,
  getCanteenItems,
  searchCanteenItems,
  getWards,
  searchWards,
} from "../controllers/pas.mastercontroller.js";
import { verifyToken } from "../middleware/verifyPasToken.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);

router.get("/getHealthNews", getHealthNews);
router.get("/getDepts", getDepts);
router.post("/addDept", addDept);
router.post("/addEmployee", addEmployee);
router.get("/getDoctors", getDoctors);

router.post("/addTest", addTest);
router.post("/editTest", editTest);
router.post("/deleteTest", deleteTest);
router.post("/addPharmacyItem", addPharmacyItem);
router.post("/editPharmacyItem", editPharmacyItem);
router.post("/deletePharmacyItem", deletePharmacyItem);
router.post("/addCanteenItem", addCanteenItem);
router.post("/editCanteenItem", editCanteenItem);
router.post("/deleteCanteenItem", deleteCanteenItem);
router.post("/addWard", addWard);
router.post("/editWard", editWard);
router.post("/deleteWard", deleteWard);
router.post("/vacatePatientWard", vacatePatientWard);
router.post("/registerPatient", registerPatient);
router.post("/admitPatient", admitPatient);
router.post("/addOpConsultation", addOpConsultation);

router.get("/checkAuth", verifyToken(["user"]), checkAuth);
router.get("/getTests", getTests);
router.get("/searchTests", searchTests);
router.get("/getPharmacyItems", getPharmacyItems);
router.get("/searchPharmacyItems", searchPharmacyItems);
router.get("/getCanteenItems", getCanteenItems);
router.get("/searchCanteenItems", searchCanteenItems);
router.get("/getWards", getWards);
router.get("/searchWards", searchWards);
router.get("/getPatientsByWard", getPatientsByWard);
router.get("/getVacantBedNumbers", getVacantBedNumbers);
router.get("/getPatients", getPatients);
router.post("/addPatientConsumables", addPatientConsumables);
router.get("/getPatientConsumables", getPatientConsumables);
router.get("/getPatientConsumablesHistory", getPatientConsumablesHistory);
router.post("/setFullPaidStatus", setFullPaidStatus);
router.post("/setItemPaidStatus", setItemPaidStatus);
router.post("/addPatientTest", addPatientTest);
router.get("/getPatientTests", getPatientTests);
router.get("/getPatientTestHistory", getPatientTestHistory);
router.post("/setFullTestPaidStatus", setFullTestPaidStatus);
router.post("/setTestPaidStatus", setTestPaidStatus);
router.get("/getMiscBillItemTypes", getMiscBillItemTypes);
router.get("/getBillings", getBillings);
router.get("/getItemsByBill", getItemsByBill);
router.post("/addMiscItems", addMiscItems);
router.get("/getMiscItems", getMiscItems);
router.get("/getMiscItemsHistory", getMiscItemsHistory);
router.post("/payOutstandingBills", payOutstandingBills);
router.get("/getTestPatients", getTestPatients);
router.get("/getDeptDoctors", getDeptDoctors);
router.post("/addFoodOrder", addFoodOrder);
router.get("/getFoodOrders", getFoodOrders);
router.get("/getPatientFoodOrderHistory", getPatientFoodOrderHistory);
router.post("/setFoodPaidStatus", setFoodPaidStatus);
router.post("/setFullFoodPaidStatus", setFullFoodPaidStatus);
export default router;
