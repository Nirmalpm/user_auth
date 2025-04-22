import express from "express";

import {
  addUser,
  isUserPresent,
  loadUserProfile,
  addUpdateUserHome,
  isUserProfileHomePresent,
  //getUserAboutInfo,
  addUpdateUserAbout,
  addFrontendSkills,
  addBackendSkills,
  addOtherSkills,
  updateFrontendSkills,
  updateBackendSkills,
  updateOtherSkills,
  addEducation,
  addCertification,
  addWorkExp,
  updateEducation,
  updateCertification,
  updateWorkExp,
  updateProject,
  deleteSkill,
} from "../controllers/user.controller.js";

import { getFreeNews } from "../controllers/freenewsapi.controller.js";


const router = express.Router();

router.post("/addUser", addUser);
router.post("/isUserPresent", isUserPresent);
router.post("/isUserProfileHomePresent", isUserProfileHomePresent);
router.post("/loadUserProfile", loadUserProfile);

router.post("/addUpdateUserHome", addUpdateUserHome);
router.post("/addUpdateUserAbout", addUpdateUserAbout);
router.post("/addFrontendSkills", addFrontendSkills);
router.post("/addBackendSkills", addBackendSkills);
router.post("/addOtherSkills", addOtherSkills);
router.post("/addEducation", addEducation);
router.post("/addCertification", addCertification);
router.post("/addWorkExp", addWorkExp);

//router.post("/userAboutInfo", getUserAboutInfo);

router.post("/updateFrontendSkills", updateFrontendSkills);
router.post("/updateBackendSkills", updateBackendSkills);
router.post("/updateOtherSkills", updateOtherSkills);
router.post("/updateEducation", updateEducation);
router.post("/updateCertification", updateCertification);
router.post("/updateWorkExp", updateWorkExp);
router.post("/updateProject", updateProject);

router.post("/deleteSkill", deleteSkill);

router.get("/getFreeNews", getFreeNews);


export default router;
