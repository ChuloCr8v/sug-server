import express from "express";
import {
  companyLogin,
  companySignup,
  employeeLogin,
  employeeSignup,
  forgotPassword,
  resetEmail,
  resetEmployeePassword,
  verifyEmployeePasswordMatch,
  verifyAccount,
} from "../controllers/auth.js";
import { verifyAdminToken } from "../verifyAdminToken.js";
import { verifyEmployeeToken } from "../verifyEmployeeToken.js";

const router = express.Router();

router.post("/auth/organization/new", companySignup);
router.post("/auth/employee/new/:id", verifyAdminToken, employeeSignup);
router.put("/auth/company/login-company", companyLogin);
router.put("/auth/employee/login-employee", employeeLogin);
router.put("/auth/employee/reset-password/:email", resetEmployeePassword);
router.put(
  "/auth/employee/verifyOldPassword/:id",
  verifyEmployeeToken,
  verifyEmployeePasswordMatch
);
router.put("/auth/employee/forgot-password/:email", forgotPassword);
router.put("/auth/reset-email/:id", resetEmail);
router.put("/auth/verify-organization/:token/:id", verifyAccount);

export default router;
