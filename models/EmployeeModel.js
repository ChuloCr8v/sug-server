import mongoose from "mongoose";
import NotificationSchema from "./Notification.js";

const EmployeeSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: "general",
    },
    officeRole: {
      type: String,
      default: "",
    },
    isModerator: {
      type: Boolean,
      default: false,
    },
    defaultAnonymousSuggestion: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
    suggestions: {
      type: [],
    },
    upvotes: {
      type: [],
    },
    downVotes: {
      type: [],
    },
    comments: {
      type: [],
    },
    replies: {
      type: [],
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    rejectedSuggestions: {
      type: Array,
    },
    approvedSuggestions: {
      type: Array,
    },
    notifications: {
      type: NotificationSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

export default mongoose.model("employee", EmployeeSchema);
