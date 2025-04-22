import express from "express";
import {
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
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken("user"), checkAuth); // called when page is refreshed

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/password-reset/:token", passwordReset);

router.get("/usersbyrole", verifyToken("admin"), usersByRole);
router.post("/createuser", verifyToken("admin"), createUser);
router.post("/updaterole", verifyToken("admin"), updateRole);
router.post("/removerole", verifyToken("admin"), removeRole);

export default router;
