import express from "express";
import { verifyEmployeeToken } from "../verifyEmployeeToken.js";
import {
  addReply,
  deleteReply,
  downVoteReply,
  editReply,
  getAllReplies,
  getReply,
  upVoteReply,
} from "../controllers/Reply.js";

const router = express.Router();

router.post("/new-reply/:id", verifyEmployeeToken, addReply);
router.put("/edit-reply/:id", verifyEmployeeToken, editReply);
router.delete("/:id", verifyEmployeeToken, deleteReply);
router.put("/upvote/:id", verifyEmployeeToken, upVoteReply);
router.put("/downvote/:id", verifyEmployeeToken, downVoteReply);
router.get("/:id", verifyEmployeeToken, getReply);
router.get("/replies/all", verifyEmployeeToken, getAllReplies);

export default router;
