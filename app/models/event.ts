import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  image: String,
  isPublic: Boolean,
  guestLimit: Number,
  attending : Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;
