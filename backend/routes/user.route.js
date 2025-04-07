import express from "express";

import { addUser, isUserPresent } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/addUser", addUser);
router.post("/isUserPresent", isUserPresent);

export default router;
