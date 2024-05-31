import CommentModel from "../models/CommentModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import SuggestionModel from "../models/SuggestionModel.js";
import ReplyModel from "../models/ReplyModel.js";

export const addReply = async (req, res, next) => {
  const userId = req.employeeId;
  const commentId = req.params.id;
  const newReply = new ReplyModel({
    userId: userId,
    commentId: commentId,
    ...req.body,
  });
  try {
    const addReply = await newReply.save();
    await CommentModel.findByIdAndUpdate(req.params.id, {
      $push: { replies: newReply._id },
    });
    res.status(200).json({
      message: "Reply added successfully",
      data: newReply,
    });
  } catch (error) {
    next(error);
  }
};

export const editReply = async (req, res, next) => {
  try {
    const reply = await ReplyModel.findById(req.params.id);
    if (!reply) return res.status(404).json("Reply not found");
    if (reply.userId !== req.employeeId)
      return res.status(404).json("You can only edit your reply");

    const updateReply = await ReplyModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Reply updated successfully",
      data: updateReply,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReply = async (req, res, next) => {
  try {
    const reply = await ReplyModel.findById(req.params.id);
    if (!reply) return res.status(404).json("Reply not found");
    if (reply.userId !== req.employeeId)
      return res.status(401).json("You can only delete your reply");
    await CommentModel.findByIdAndUpdate(reply.commentId, {
      $pull: { replies: reply._id },
    });
    await ReplyModel.findByIdAndDelete(req.params.id);

    res.status(200).json("Reply deleted successfully");
  } catch (error) {
    next(error);
  }
};

//Upvote reply
export const upVoteReply = async (req, res, next) => {
  if (!req.employeeId) return res.status(401).json("Login to add your vote");
  try {
    const reply = await ReplyModel.findById(req.params.id);
    if (reply.userId === req.employeeId)
      return res.status(403).json("You cant vote your reply");
    if (reply.upVotes.includes(req.employeeId))
      return res.status(403).json("You have already upvoted");
    if (reply.downVotes.includes(req.employeeId)) {
      await ReplyModel.findByIdAndUpdate(req.params.id, {
        $pull: {
          downVotes: req.employeeId,
        },
      });
    }
    await ReplyModel.findByIdAndUpdate(req.params.id, {
      $push: { upVotes: req.employeeId },
    });
    res.status(200).json({
      message: "upvote added successfully",
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

//Downvote reply
export const downVoteReply = async (req, res, next) => {
  if (!req.employeeId) return res.status(401).json("Login to add your vote");
  try {
    const reply = await ReplyModel.findById(req.params.id);
    if (reply.userId === req.employeeId)
      return res.status(403).json("You cant vote your reply");
    if (reply.downVotes.includes(req.employeeId))
      return res.status(403).json("You have already downvoted");
    if (reply.upVotes.includes(req.employeeId)) {
      await ReplyModel.findByIdAndUpdate(req.params.id, {
        $pull: {
          upVotes: req.employeeId,
        },
      });
    }
    await ReplyModel.findByIdAndUpdate(req.params.id, {
      $push: { downVotes: req.employeeId },
    });
    res.status(200).json({
      message: "downvote added successfully",
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

export const getReply = async (req, res, next) => {
  try {
    const reply = await ReplyModel.findById(req.params.id);
    if (!reply) return res.status(404).json("Reply not found");
    res.status(200).json(reply);
  } catch (error) {
    next(error);
  }
};

export const getAllReplies = async (req, res, next) => {
  try {
    const replies = await ReplyModel.find();
    res.status(200).json(replies);
  } catch (error) {
    next(error);
  }
};
