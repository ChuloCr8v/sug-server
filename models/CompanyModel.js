import mongoose, { Mongoose } from "mongoose";

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
  },
  { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);
