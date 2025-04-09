import express from "express";

import {
  addUser,
  isUserPresent,
  loadUserProfile,
  addUserHome,
  isUserProfileHomePresent,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/addUser", addUser);
router.post("/isUserPresent", isUserPresent);
router.post("/loadUserProfile", loadUserProfile);
router.post("/addUserHome", addUserHome);
router.post("/isUserProfileHomePresent", isUserProfileHomePresent);

export default router;
