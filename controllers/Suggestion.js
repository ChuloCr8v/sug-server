import CompanyModel from "../models/CompanyModel.js";
import SuggestionModel from "../models/SuggestionModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import { sendMail } from "../utils/sendEmail.js";

export const newSuggestion = async (req, res, next) => {
  const companyId = req.params.id;
  const userId = req.employeeId || req.user;
  console.log(userId);
  try {
    const user = await EmployeeModel.findById(req.employeeId);

    const newSuggestion = new SuggestionModel({
      userId: userId,
      companyId: companyId,
      ...req.body,
    });

    const addSuggestion = await newSuggestion.save();
    const company = await CompanyModel.findById(companyId);
    await CompanyModel.findByIdAndUpdate(req.params.id, {
      $push: { suggestions: addSuggestion._id },
    });

    await EmployeeModel.findByIdAndUpdate(req.employeeId, {
      $push: { suggestions: addSuggestion._id },
    });

    res.status(200).json({
      message: "New suggestion added successfully",
      data: newSuggestion,
    });

    if (user.notifications.newSuggestionSubmitted) {
      sendMail({
        receiver: user.email,
        subject: "Suggestion Added Successfully",
        message: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hello ${user.firstName},</p>
        <p>Your suggestion <i style="color: blue; font-weight: bold">${req.body.title}</i> has been submitted successfully.</p>
        <p>Thank you.</p>
      </div>`,
      });
    }

    const allEmployees = await EmployeeModel.find({ companyId: req.params.id });

    const suggestionLink = `${process.env.BASE_URL}/suggestion/${newSuggestion._id}`;
    console.log("user id:" + " " + userId);
    allEmployees.forEach((employee) => {
      if (
        employee.notifications.newSuggestionForOrganization &&
        employee._id !== userId
      ) {
        sendMail({
          receiver: employee.email,
          subject: `New Suggestion For Your Organization ${company.companyName}`,
          message: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Hello ${employee.firstName},</p>
          <p>A new suggestion, <i style="color: blue; font-weight: bold">${req.body.title}</i> has been added to your organization's Suggbox.
          </p>
          <p>Check it out here.<a href=${suggestionLink} style="color: blue; font-weight: bold">${req.body.title}</a>.
          </p>
          <p>Thank you.</p>
        </div>`,
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSuggestion = async (req, res, next) => {
  try {
    const suggestion = await SuggestionModel.findById(req.params.id);
    if (!suggestion) return res.status(404).json("Suggestion not found");
    res.status(200).json(suggestion);
  } catch (error) {
    next(error);
  }
};

export const getAllSuggestions = async (req, res, next) => {
  try {
    const company = await CompanyModel.findById(req.params.id);
    if (!company) {
      return res
        .status(404)
        .json("Company with the provided id does not exist.");
    }
    const suggestions = await SuggestionModel.find();
    const companySuggestions = suggestions.filter(
      (s) => s.companyId === company._id.toString(16)
    );
    res.status(200).json(companySuggestions);
  } catch (error) {
    next(error);
  }
};

export const editSuggestion = async (req, res, next) => {
  try {
    const suggestion = await SuggestionModel.findById({ _id: req.params.id });
    if (suggestion.userId !== req.user)
      return res.status(401).json("You can only edit your suggestion!");
    const timeElasped =
      Math.floor(
        new Date(suggestion.createdAt).getTime() - new Date().getTime()
      ) /
      (1000 * 60 * 60);

    if (timeElasped > 24)
      return res
        .status(401)
        .json(
          "you cant edit a suggestion that has surpassed 24 hours timeframe"
        );
    const updateSuggestion = await SuggestionModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Update successful", data: updateSuggestion });
  } catch (error) {
    next(error);
  }
};

//Approve Suggestion

export const approveSuggestion = async (req, res, next) => {
  try {
    const suggestion = await SuggestionModel.findById(req.params.id);
    const employee = await EmployeeModel.findById(suggestion.userId);
    if (suggestion.companyId !== req.user)
      return res.status(401).json("You are not authorized");
    const approve = await SuggestionModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "approved",
        },
      },
      { new: true }
    );
    res.status(200).json({
      msg: "Suggestion approved successfully",
      approve,
    });

    sendMail({
      receiver: employee.email,
      subject: "Your suggestion has been approved!",
      message: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hello ${employee.firstName},</p>
      <p>Congratulations. Your suggestion <i style="color: blue; font-weight: bold">${suggestion.title}</i> has been Approved.</p>
      <p>Thank you.</p>
    </div>`,
    });
  } catch (error) {
    next(error);
  }
};

//Reject Suggestion

export const rejectSuggestion = async (req, res, next) => {
  try {
    const suggestion = await SuggestionModel.findById(req.params.id);
    if (suggestion.companyId !== req.user)
      return res.status(401).json("You are not authorized");
    const approve = await SuggestionModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "rejected",
        },
      },
      { new: true }
    );
    res.status(200).json({
      msg: "Suggestion rejected successfully",
      approve,
    });
  } catch (error) {
    next(error);
  }
};

// export const approveSuggestion = async (req, res, next) => {
//   try {
//     const suggestion = await SuggestionModel.findById(req.params.id);
//     if (suggestion.companyId !== req.user)
//       return res.status(401).json("You are not authorized");
//     const approve = await suggestion.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           isAdmin: true,
//         },
//       },
//       { new: true }
//     );
//     res.status(200).json({
//       msg: "Suggestion approved successfully",
//       approve,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteSuggestion = async (req, res, next) => {
  try {
    const suggestion = await SuggestionModel.findById(req.params.id);
    if (suggestion.status.toLowerCase() === "approved") {
      return res.status(403).json("You can't delete an approved suggestion.");
    }

    if (suggestion.companyId !== req.user)
      return res
        .status(401)
        .json("You can only delete your suggestions for your company");

    const user = await EmployeeModel.findById(suggestion.userId);
    await CompanyModel.findByIdAndUpdate(suggestion.companyId, {
      $pull: { suggestions: suggestion._id },
    });
    await EmployeeModel.findByIdAndUpdate(suggestion.userId, {
      $pull: { suggestions: suggestion._id },
    });
    await SuggestionModel.findByIdAndDelete(req.params.id);

    res.status(200).json("Suggestion deleted successfully");

    if (user.notifications.suggestionDeleted) {
      sendMail({
        receiver: user.email,
        subject: "Suggestion Deleted",
        message: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hello ${user.firstName},</p>
        <p>Your suggestion <i style="color: blue; font-weight: bold; text-transform: capitalize ">${suggestion.title}</i> has been deleted successfully.</p>
        <p>Thank you.</p>
      </div>`,
      });
    }
  } catch (error) {
    next(error);
  }
};

//Upvote suggestion
export const upVoteSuggestion = async (req, res, next) => {
  if (!req.user) return res.status(401).json("Login to add your vote");
  try {
    const suggestion = await SuggestionModel.findById(req.params.id);

    if (suggestion.userId === req.user)
      return res.status(403).json("You cant vote your suggestion");

    if (suggestion.upVotes.includes(req.user)) {
      await SuggestionModel.findByIdAndUpdate(req.params.id, {
        $pull: { upVotes: req.user },
      });
      return res.status(200).json({
        message: "upvote removed successfully",
        data: suggestion,
      });
    }

    // return res.status(403).json("You have already upvoted");
    if (suggestion.downVotes.includes(req.user)) {
      await SuggestionModel.findByIdAndUpdate(req.params.id, {
        $pull: {
          downVotes: req.user,
        },
      });
    }

    await SuggestionModel.findByIdAndUpdate(req.params.id, {
      $push: { upVotes: req.user },
    });

    res.status(200).json({
      message: "upvote added successfully.",
      data: suggestion,
    });
  } catch (error) {
    next(error);
  }
};

//Downvote suggestion
export const downVoteSuggestion = async (req, res, next) => {
  if (!req.employeeId) return res.status(401).json("Login to add your vote");
  try {
    const suggestion = await SuggestionModel.findById(req.params.id);
    if (suggestion.userId === req.employeeId)
      return res.status(403).json("You cant vote your suggestion");
    if (suggestion.downVotes.includes(req.employeeId))
      if (suggestion.downVotes.includes(req.employeeId)) {
        // return res.status(403).json("You have already downvoted");
        await SuggestionModel.findByIdAndUpdate(req.params.id, {
          $pull: { downVotes: req.employeeId },
        });
        return res.status(200).json({
          message: "downvote removed successfully",
          data: suggestion,
        });
      }
    if (suggestion.upVotes.includes(req.employeeId)) {
      await SuggestionModel.findByIdAndUpdate(req.params.id, {
        $pull: {
          upVotes: req.employeeId,
        },
      });
    }
    await SuggestionModel.findByIdAndUpdate(req.params.id, {
      $push: { downVotes: req.employeeId },
    });
    res.status(200).json({
      message: "downvote added successfully",
      data: suggestion,
    });
  } catch (error) {
    next(error);
  }
};
