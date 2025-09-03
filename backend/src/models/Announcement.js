// models/Announcement.js
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now }, // auto timestamp
    eventDate: { type: Date }, // optional
    location: { type: String }, // optional
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    viewedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
