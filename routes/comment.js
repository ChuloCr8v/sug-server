import express from "express";
import {
  addComment,
  deleteComment,
  downVoteComment,
  editComment,
  getAllComments,
  getComment,
  upVoteComment,
} from "../controllers/Comment.js";
import { verifyEmployeeToken } from "../verifyEmployeeToken.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/new-comment/:id", verifyToken, addComment);
router.put("/edit-comment/:id", verifyToken, editComment);
router.delete("/delete-comment/:id", verifyToken, deleteComment);
router.put("/upvote/:id", verifyToken, upVoteComment);
router.put("/downvote/:id", verifyToken, downVoteComment);
router.get("/:id", verifyToken, getComment);
router.get("/comments/all", verifyEmployeeToken, getAllComments);

export default router;
