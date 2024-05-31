import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    OTP: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("OTP", OTPSchema);
