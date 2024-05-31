import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    user: {
      type: {},
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
