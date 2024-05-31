import express from "express";
import {
  editCompany,
  deleteCompany,
  getCompanies,
  getCompany,
} from "../controllers/Company.js";
import { verifyAdminToken } from "../verifyAdminToken.js";

const router = express.Router();

router.put("/edit-company/:id", verifyAdminToken, editCompany);
router.delete("/:id", verifyAdminToken, deleteCompany);
router.get("/all", getCompanies);
router.get("/:id", getCompany);

export default router;
