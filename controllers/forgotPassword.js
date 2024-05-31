import bcrypt from "bcrypt";
import EmployeeModel from "../models/EmployeeModel.js";
import TokenModel from "../models/TokenModel.js";

export const forgotPassword = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOne({ email: req.email });
    if (!employee) {
      return res.status(404).json("Employee does not exist");
    }
    const existingToken = TokenModel.findOne({ userId: employee._id });
    if (!existingToken) {
      await TokenModel.findByIdAndDelete(existingToken._id);
    }

    const newToken = crypto.randomBytes(32).toString("hex");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hash(newToken, salt);

    await TokenModel({
      token: hash,
      userId: employee._id,
      createdAt: new Date().getTime(),
      expireAt: Date.now() + 30 * 60 * 1000, // 30 minutes from now
    }).save();
  } catch (error) {
    next(error);
  }
};
