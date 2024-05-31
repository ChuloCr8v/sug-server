import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  newSuggestionSubmitted: {
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
  suggestionStatusUpdate: {
    type: Boolean,
    default: true,
  },
  adminCommentsOnSuggestion: {
    type: Boolean,
    default: true,
  },
  suggestionDeleted: {
    type: Boolean,
    default: true,
  },
  suggestionEdited: {
    type: Boolean,
    default: true,
  },
});

export default NotificationSchema;
