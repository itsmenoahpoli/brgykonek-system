import Complaint from "../models/Complaint";
import Notification from "../models/Notification";
import User from "../models/User";
import { Document, FilterQuery } from "mongoose";

const notifyAdmins = async (type: string, title: string, message: string, payload: any) => {
  try {
    const admins = await User.find({ user_type: 'admin' }).select('_id');
    for (const admin of admins) {
      await Notification.create({
        recipient_id: String(admin._id),
        type: type,
        title: title,
        message: message,
        payload: payload,
      });
    }
  } catch (error) {
    console.error('Error notifying admins:', error);
  }
};

export const createComplaint = async (data: Record<string, any>) => {
  let complaintData = { ...data };
  
  // If resident_id is provided, validate it exists
  if (data.resident_id) {
    const user = await User.findById(data.resident_id);
    if (!user) {
      throw new Error("Resident not found with the provided ID");
    }
    // Ensure the user is actually a resident
    if (user.user_type !== 'resident') {
      throw new Error("The selected user is not a resident");
    }
  }
  // Fallback: if resident_email is provided and no resident_id, look up by email
  else if (data.resident_email && !data.resident_id) {
    const user = await User.findOne({ email: data.resident_email });
    if (user) {
      complaintData.resident_id = String(user._id);
    } else {
      throw new Error("Resident not found with the provided email");
    }
  }
  else {
    throw new Error("Either resident_id or resident_email must be provided");
  }
  
  const c = await Complaint.create(complaintData);
  try {
    await Notification.create({
      recipient_id: String(c.resident_id),
      type: "complaint_update",
      title: "Complaint submitted",
      message: "Your complaint was submitted and is now pending",
      payload: { complaintId: c._id, status: c.status },
    });
  } catch {}
  
  // Notify admins about new complaint
  await notifyAdmins(
    "complaint_update",
    "New Complaint Submitted",
    "A new complaint has been submitted and requires review",
    { complaintId: c._id, status: c.status }
  );
  
  return c;
};

export const createAdminComplaint = async (data: Record<string, any>) => {
  let complaintData = { ...data };
  
  // Validate resident_id if provided
  if (data.resident_id) {
    const user = await User.findById(data.resident_id);
    if (!user) {
      throw new Error("Resident not found with the provided ID");
    }
    // Ensure the user is actually a resident
    if (user.user_type !== 'resident') {
      throw new Error("The selected user is not a resident");
    }
  }
  
  const c = await Complaint.create({ ...complaintData, created_by_admin: true });
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
