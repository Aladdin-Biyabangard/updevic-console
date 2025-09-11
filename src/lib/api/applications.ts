import axiosInstance from "../axios";

export interface ApplicationCriteria {
  fullName?: string;
  email?: string;
  teachingField?: string;
  phone?: string;
  status?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export interface PageRequest {
  page: number;
  size: number;
}

export interface ApplicationSearchRequest {
  applicationCriteria: ApplicationCriteria;
  pageRequest: PageRequest;
}

export interface BasicApplication {
  id: string;
  fullName: string;
  email: string;
  teachingField: string;
  status: string;
  createdAt: string;
  isRead?: boolean;
}

export interface DetailedApplication extends BasicApplication {
  linkedinProfile?: string;
  githubProfile?: string;
  portfolio?: string;
  additionalInfo?: string;
  phoneNumber?: string;
  resultMessage?: string;
  completedAt?: string;
}

export interface ApplicationSearchResponse {
  content: BasicApplication[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const searchApplications = async (
    criteria: ApplicationCriteria = {},
    page: number = 0,
    size: number = 20
): Promise<ApplicationSearchResponse> => {
  try {
    // Filter only non-empty fields
    const params: any = { page, size };

    if (criteria.fullName?.trim()) params.fullName = criteria.fullName.trim();
    if (criteria.email?.trim()) params.email = criteria.email.trim();
    if (criteria.teachingField?.trim()) params.teachingField = criteria.teachingField.trim();
    if (criteria.phone?.trim()) params.phone = criteria.phone.trim();
    if (criteria.status?.trim()) params.status = criteria.status.trim();
    if (criteria.createdAtFrom?.trim()) params.createdAtFrom = criteria.createdAtFrom.trim();
    if (criteria.createdAtTo?.trim()) params.createdAtTo = criteria.createdAtTo.trim();

    const response = await axiosInstance.get("/applications/search", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch applications");
  }
};

export const getApplicationDetails = async (id: string): Promise<DetailedApplication> => {
  try {
    const response = await axiosInstance.get(`/applications/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch application details");
  }
};

export const deleteApplication = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/applications/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete application");
  }
};

export const markAsRead = async (id: string): Promise<void> => {
  try {
    await axiosInstance.put(`/applications/${id}/read`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to mark as read");
  }
};

export const rejectApplication = async (id: string, message: string): Promise<void> => {
  try {
    await axiosInstance.put(`/applications/${id}/reject`, { message });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to reject application");
  }
};

export const approveApplication = async (id: string, message: string): Promise<void> => {
  try {
    await axiosInstance.put(`/applications/${id}/success`, { message });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to approve application");
  }
};