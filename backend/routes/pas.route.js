import express from "express";
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

const router = express.Router();

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
export default router;
