import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
      required: true,
    },
    suggestionId: {
      type: String,
      required: true,
    },
    upVotes: {
      type: [],
    },
    downVotes: {
      type: [],
    },
    replies: {
      type: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
