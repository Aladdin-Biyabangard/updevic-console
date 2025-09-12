import axiosInstance from "../axios";
import { validateAndSanitizeInput, applicationSearchSchema, paginationSchema, applicationActionSchema } from "../validation/schemas";
import { sanitizeErrorMessage } from "../errors";

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
    // Validate input
    const validatedCriteria = validateAndSanitizeInput(applicationSearchSchema, criteria);
    const validatedPagination = validateAndSanitizeInput(paginationSchema, { page, size });
    
    const params: any = { 
      page: validatedPagination.page, 
      size: validatedPagination.size 
    };

    if ((validatedCriteria as any).fullName?.trim()) params.fullName = (validatedCriteria as any).fullName.trim();
    if ((validatedCriteria as any).email?.trim()) params.email = (validatedCriteria as any).email.trim();
    if ((validatedCriteria as any).teachingField?.trim()) params.teachingField = (validatedCriteria as any).teachingField.trim();
    if ((validatedCriteria as any).status?.trim()) params.status = (validatedCriteria as any).status.trim();

    const response = await axiosInstance.get("/applications/search", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const getApplicationDetails = async (id: string): Promise<DetailedApplication> => {
  try {
    const response = await axiosInstance.get(`/applications/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const deleteApplication = async (id: string): Promise<void> => {
  try {
    const validatedData = validateAndSanitizeInput(applicationActionSchema, { id });
    await axiosInstance.delete(`/applications/${(validatedData as any).id}`);
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const markAsRead = async (id: string): Promise<void> => {
  try {
    const validatedData = validateAndSanitizeInput(applicationActionSchema, { id });
    await axiosInstance.put(`/applications/${(validatedData as any).id}/read`);
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const rejectApplication = async (id: string, message: string): Promise<void> => {
  try {
    const validatedData = validateAndSanitizeInput(applicationActionSchema, { id, message });
    await axiosInstance.put(`/applications/${(validatedData as any).id}/reject`, { 
      message: (validatedData as any).message 
    });
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const approveApplication = async (id: string, message: string): Promise<void> => {
  try {
    const validatedData = validateAndSanitizeInput(applicationActionSchema, { id, message });
    await axiosInstance.put(`/applications/${(validatedData as any).id}/success`, { 
      message: (validatedData as any).message 
    });
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};