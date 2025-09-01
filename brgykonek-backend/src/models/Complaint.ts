import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    resident_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
    },
    date_of_report: {
      type: Date,
      required: true,
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
      enum: ["published", "draft"],
      default: "draft",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Complaint = mongoose.model("Complaint", ComplaintSchema);

export default Complaint;
