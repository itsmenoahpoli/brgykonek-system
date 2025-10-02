import Complaint from "../models/Complaint";
import Notification from "../models/Notification";
import { Document, FilterQuery } from "mongoose";

export const createComplaint = async (data: Record<string, any>) => {
  const c = await Complaint.create(data);
  try {
    await Notification.create({
      recipient_id: String(c.resident_id),
      type: "complaint_update",
      title: "Complaint submitted",
      message: "Your complaint was submitted and is now pending",
      payload: { complaintId: c._id, status: c.status },
    });
  } catch {}
  return c;
};

export const createAdminComplaint = async (data: Record<string, any>) => {
  const c = await Complaint.create({ ...data, created_by_admin: true });
  return c;
};

export const getComplaints = async (filter: FilterQuery<Document> = {}) => {
  return await Complaint.find({ ...filter })
    .sort({ created_at: -1 })
    .populate("resident_id");
};

export const getComplaintById = async (id: string) => {
  return await Complaint.findById(id).populate("resident_id");
};

export const updateComplaint = async (
  id: string,
  data: Record<string, any>
) => {
  const updated = await Complaint.findByIdAndUpdate(id, data, { new: true });
  if (updated) {
    try {
      await Notification.create({
        recipient_id: String(updated.resident_id),
        type: "complaint_update",
        title: `Complaint ${updated.status}`,
        message: `Your complaint was updated to ${updated.status}`,
        payload: { complaintId: updated._id, status: updated.status, resolution_note: updated.resolution_note },
      });
    } catch {}
  }
  return updated;
};

export const deleteComplaint = async (id: string) => {
  return await Complaint.findByIdAndDelete(id);
};

export const getComplaintsByResidentId = async (resident_id: string) => {
  return await Complaint.find({ resident_id }).sort({ created_at: -1 });
};
