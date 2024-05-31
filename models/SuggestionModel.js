import mongoose from "mongoose";

const SuggestionSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    suggestion: {
      type: String,
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    comments: {
      type: [],
    },
    upVotes: {
      type: [],
    },
    downVotes: {
      type: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("suggestion", SuggestionSchema);
