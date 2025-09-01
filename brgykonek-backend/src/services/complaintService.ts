import Complaint from "../models/Complaint";
import { Document, FilterQuery } from "mongoose";

export const createComplaint = async (data: Record<string, any>) => {
  return await Complaint.create(data);
};

export const getComplaints = async (filter: FilterQuery<Document> = {}) => {
  return await Complaint.find({ ...filter, status: "published" })
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
  return await Complaint.findByIdAndUpdate(id, data, { new: true });
};

export const deleteComplaint = async (id: string) => {
  return await Complaint.findByIdAndDelete(id);
};

export const getComplaintsByResidentId = async (resident_id: string) => {
  return await Complaint.find({ resident_id }).sort({ created_at: -1 });
};
