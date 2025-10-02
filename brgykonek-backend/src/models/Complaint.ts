import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    resident_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
    },
    date_of_report: {
      type: Date,
      required: true,
    },
    location_of_incident: {
      type: String,
      required: false,
      trim: true,
      maxlength: 300,
    },
    complaint_content: {
      type: String,
      required: true,
    },
    attachments: {
      type: [String],
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "rejected"],
      default: "pending",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
      required: true,
    },
    resolution_note: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Complaint = mongoose.model("Complaint", ComplaintSchema);

export default Complaint;
