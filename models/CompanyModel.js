import mongoose, { Mongoose } from "mongoose";
import AdminNotificationSchema from "./AdminNotification.js";

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
    employees: {
      type: [],
    },
    suggestions: {
      type: [],
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    approvedSuggestions: {
      type: [],
    },
    rejectedSuggestions: {
      type: [],
    },
    notifications: {
      type: AdminNotificationSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);
