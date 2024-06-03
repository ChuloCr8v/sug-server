import express from "express";
import { uploadProfilePicture } from "../controllers/profilePicture.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post(`/profile-picture/:id`, verifyToken, uploadProfilePicture);

export default router;
