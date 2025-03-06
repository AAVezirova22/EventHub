import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userImage: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    image: String,
    isPublic: Boolean,
    guestLimit: Number,
    attending: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: {
      type: [commentSchema],
      default: [],
    },
    photos: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["approved", "flagged", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;