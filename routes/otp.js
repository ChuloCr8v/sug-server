import express from "express";
import { generateOTP, verifyOTP } from "../controllers/OTP.js";
import { verifyEmployeeToken } from "../verifyEmployeeToken.js";

const router = express.Router();

router.post("/generate-otp/:id", verifyEmployeeToken, generateOTP);
router.put("/verify-otp/:id", verifyEmployeeToken, verifyOTP);

export default router;
