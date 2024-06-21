import mongoose from "mongoose";

const AdminNotificationSchema = new mongoose.Schema({
  newEmployeeIvited: {
    type: Boolean,
    default: true,
  },
  employeeDeactivated: {
    type: Boolean,
    default: true,
  },
  employeeActivated: {
    type: Boolean,
    default: true,
  },
  newSuggestionForOrganization: {
    type: Boolean,
    default: true,
  },
  suggestionApproved: {
    type: Boolean,
    default: true,
  },
  suggestionRejected: {
    type: Boolean,
    default: true,
  },
  suggestionDeleted: {
    type: Boolean,
    default: true,
  },
  newLikeOnSuggestion: {
    type: Boolean,
    default: true,
  },
  newCommentOnSuggestion: {
    type: Boolean,
    default: true,
  },
  highEngagementOnSuggestion: {
    type: Boolean,
    default: true,
  },
});

export default AdminNotificationSchema;
