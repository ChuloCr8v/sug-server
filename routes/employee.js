import express from "express";
import {
  disableEmployee,
  editEmployee,
  getEmployee,
  getEmployees,
  sendEmailToEmployee,
  updateEmployeeRole,
} from "../controllers/Employee.js";
import { verifyAdminToken } from "../verifyAdminToken.js";

const router = express.Router();

router.put("/edit-employee/:id", editEmployee);
router.put("/:id", verifyAdminToken, disableEmployee);
router.put("/update-role/:id", verifyAdminToken, updateEmployeeRole);
router.get("/all", getEmployees);
router.get("/:id", getEmployee);
router.post("/send-email", verifyAdminToken, sendEmailToEmployee);

export default router;
