import DocumentRequest from "../models/DocumentRequest";
import { logger } from "../utils/logger";

export const createDocumentRequest = async (data: {
  resident_id: string;
  document_type: string;
  notes?: string;
}) => {
  try {
    const documentRequest = new DocumentRequest(data);
    await documentRequest.save();
    logger.info("Document request created successfully", { documentRequestId: documentRequest._id });
    return documentRequest;
  } catch (error) {
    logger.error("Error creating document request", { error });
    throw error;
  }
};

export const getDocumentRequestsByResidentId = async (residentId: string) => {
  try {
    const documentRequests = await DocumentRequest.find({ resident_id: residentId })
      .populate('resident_id', 'name email mobile_number')
      .sort({ created_at: -1 });
    
    logger.info("Document requests retrieved successfully", { residentId, count: documentRequests.length });
    return documentRequests;
  } catch (error) {
    logger.error("Error retrieving document requests", { error });
    throw error;
  }
};

export const getAllDocumentRequests = async () => {
  try {
    const documentRequests = await DocumentRequest.find()
      .populate('resident_id', 'name email mobile_number')
      .sort({ created_at: -1 });
    
    logger.info("All document requests retrieved successfully", { count: documentRequests.length });
    return documentRequests;
  } catch (error) {
    logger.error("Error retrieving all document requests", { error });
    throw error;
  }
};

export const updateDocumentRequestStatus = async (id: string, data: {
  status: string;
  staff_notes?: string;
  completed_at?: Date;
}) => {
  try {
    const documentRequest = await DocumentRequest.findByIdAndUpdate(
      id,
      { ...data, updated_at: new Date() },
      { new: true }
    ).populate('resident_id', 'name email mobile_number');
    
    if (!documentRequest) {
      throw new Error("Document request not found");
    }
    
    logger.info("Document request status updated successfully", { documentRequestId: id, status: data.status });
    return documentRequest;
  } catch (error) {
    logger.error("Error updating document request status", { error });
    throw error;
  }
};

export const deleteDocumentRequest = async (id: string) => {
  try {
    const documentRequest = await DocumentRequest.findByIdAndDelete(id);
    
    if (!documentRequest) {
      throw new Error("Document request not found");
    }
    
    logger.info("Document request deleted successfully", { documentRequestId: id });
    return documentRequest;
  } catch (error) {
    logger.error("Error deleting document request", { error });
    throw error;
  }
};
