import express from "express";
import { deleteFiles, uploadFiles } from "../controllers/suggestionFiles.js";
import upload from "../utils/multerMiddleware.js";

const router = express.Router();

router.post("/upload-files", upload, uploadFiles);
router.delete("/delete-files/:filename", deleteFiles);

export default router;
