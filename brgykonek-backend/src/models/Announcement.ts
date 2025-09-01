import mongoose, { Document, Schema } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  title_slug: string;
  header: string;
  body: string;
  banner_image: string;
  status: "published" | "draft";
  created_at: Date;
  posted_by: string;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    title_slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 200,
    },
    header: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    body: {
      type: String,
      required: true,
    },
    banner_image: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      required: true,
      default: "draft",
    },
    created_at: {
      type: Date,
      default: Date.now,
      required: true,
    },
    posted_by: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IAnnouncement>(
  "Announcement",
  announcementSchema
);
