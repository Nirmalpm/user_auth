import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  passwordReset,
  checkAuth
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken,checkAuth); // called when page is refreshed

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/password-reset/:token", passwordReset);

export default router;
