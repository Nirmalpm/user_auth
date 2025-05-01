import express from "express";
import {
    sendErrorMail
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/send-error",  sendErrorMail);


export default router;
