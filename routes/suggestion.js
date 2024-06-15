import express from "express";
import {
  deleteSuggestion,
  editSuggestion,
  newSuggestion,
  upVoteSuggestion,
  downVoteSuggestion,
  getSuggestion,
  getAllSuggestions,
  approveSuggestion,
  rejectSuggestion,
} from "../controllers/Suggestion.js";
import { verifyEmployeeToken } from "../verifyEmployeeToken.js";
import { verifyAdminToken } from "../verifyAdminToken.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/new-suggestion/:id", verifyEmployeeToken, newSuggestion);
router.put("/edit-suggestion/:id", verifyToken, editSuggestion);
router.put("/approve-suggestion/:id", verifyToken, approveSuggestion);
router.put("/reject-suggestion/:id", verifyToken, rejectSuggestion);
router.delete("/:id", verifyToken, deleteSuggestion);
router.put("/upvote/:id", verifyToken, upVoteSuggestion);
router.put("/downvote/:id", verifyEmployeeToken, downVoteSuggestion);
router.get("/get-suggestion/:id", getSuggestion);
router.get("/all/:id", getAllSuggestions);

export default router;
