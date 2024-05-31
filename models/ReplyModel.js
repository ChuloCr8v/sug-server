import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    reply: {
      type: String,
      required: true,
    },
    commentId: {
      type: String,
      required: true,
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

export default mongoose.model("replies", ReplySchema);
