import express from "express";
import { generateOTP, verifyOTP } from "../controllers/OTP.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/generate-otp/:id", verifyToken, generateOTP);
router.put("/verify-otp/:id", verifyToken, verifyOTP);

export default router;
