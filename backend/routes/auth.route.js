import express from "express";
import {
  addUser,
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  passwordReset,
  checkAuth,
  usersByRole,
  createUser,
  updateRole,
  removeRole,
  getAccessLogs,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { visitorLogger } from "../middleware/visitorLogger.js";

const router = express.Router();

router.get("/check-auth", verifyToken("user"), checkAuth); // called when page is refreshed

router.post("/signup", signup);
router.post("/login", visitorLogger(), login);
router.post("/logout", logout);
router.post("/addUser", addUser);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/password-reset/:token", passwordReset);

router.get("/usersbyrole", verifyToken("admin"), usersByRole);
router.post("/createuser", verifyToken("admin"), createUser);
router.post("/updaterole", verifyToken("admin"), updateRole);
router.post("/removerole", verifyToken("admin"), removeRole);

router.get("/getAccessLogs", verifyToken("admin"), getAccessLogs);

export default router;
