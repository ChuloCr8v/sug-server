import CompanyModel from "../models/CompanyModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import OTPModel from "../models/OTPModel.js";
import { sendMail } from "../utils/sendEmail.js";

//Generate OTP

export const generateOTP = async (req, res, next) => {
  try {
    const { isAdmin, action } = req.body;
    const { id } = req.params;

    const employee = await EmployeeModel.findById(id);
    const organization = await CompanyModel.findById(id);

    if (!isAdmin && !employee) {
      return res.status(404).json("Employee doesn't exist.");
    }
    if (isAdmin && !organization) {
      return res.status(404).json("Organization doesn't exist.");
    }

    const verifyExistingOTPs = await OTPModel.find({ userId: req.params.id });
    if (verifyExistingOTPs.length > 0) {
      await OTPModel.deleteMany({ userId: req.params.id });
    }

    const newOTP = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
    const OTP = new OTPModel({
      userId: req.params.id,
      OTP: newOTP,
      expireAt: Date.now() + 30 * 60 * 1000, // 30 minutes from now
      createdAt: Date.now(),
    });

    const saveOTP = await OTP.save();

    await sendMail({
      receiver: isAdmin ? organization.companyEmail : employee.email,
      subject: "Authentication OTP",
      message: `Hello ${
        isAdmin ? organization.companyName : employee.firstName
      }, use this OTP to ${action}. <span style="background: green; color: white; padding; 4px; border-radius: 10px"> ${newOTP}`,
    });

    res
      .status(200)
      .json({ message: "OTP Generated Successfully", data: saveOTP });
  } catch (error) {
    next(error);
  }
};

//Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { isAdmin, OTP: _otp } = req.body;
    const { id } = req.params;

    const model = isAdmin ? CompanyModel : EmployeeModel;
    const user = await model.findById(id);

    if (!user) {
      return res.status(404).json("This account does not exist.");
    }

    const OTP = await OTPModel.findOne({ userId: id });
    if (!OTP) {
      return res
        .status(404)
        .json("No OTP has beeen generated for this account yet.");
    }

    if (OTP.OTP !== _otp) {
      return res.status(403).json("Incorrect OTP.");
    }

    if (OTP.expireAt < new Date().getTime()) {
      await OTPModel.findByIdAndDelete(OTP._id);
      return res.status(401).json("This OTP has expired.");
    }

    await OTPModel.findByIdAndDelete(OTP._id);
    res.status(200).json("OTP verification successful!");
  } catch (error) {
    next(error);
  }
};
