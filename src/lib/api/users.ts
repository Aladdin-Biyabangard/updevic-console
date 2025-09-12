import axiosInstance from "../axios";
import { setAuthToken } from "../cookie";
import { validateAndSanitizeInput, userSearchSchema, paginationSchema, userRoleSchema, loginSchema } from "../validation/schemas";
import { sanitizeErrorMessage } from "../errors";

interface UserCriteria {
  firstName?: string;
  email?: string;
  roles?: string[];
  status?: string;
}

export const getAllUsers = async (filters: UserCriteria = {}, page: number = 0, size: number = 100) => {
  try {
    // Validate and sanitize input
    const validatedFilters = validateAndSanitizeInput(userSearchSchema, filters);
    const validatedPagination = validateAndSanitizeInput(paginationSchema, { page, size });
    
    const params: Record<string, any> = {
      page: validatedPagination.page,
      size: validatedPagination.size
    };

    if (validatedFilters.firstName?.trim()) params.firstName = validatedFilters.firstName.trim();
    if (validatedFilters.email?.trim()) params.email = validatedFilters.email.trim();
    if (validatedFilters.roles && validatedFilters.roles.length > 0) params.roles = validatedFilters.roles.join(",");
    if (validatedFilters.status?.trim()) params.status = validatedFilters.status.trim();

    const response = await axiosInstance.get("/admins/search", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const login = async (email: string, password: string) => {
  try {
    // Validate input
    const validatedData = validateAndSanitizeInput(loginSchema, { email, password });
    
    const response = await axiosInstance.post("/auth/sign-in", { 
      email: (validatedData as any).email, 
      password: (validatedData as any).password 
    });

    if (response.data.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    return response.data;
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const activateUser = async (id: number) => {
  try {
    await axiosInstance.put(`/admins/users/${id}/activate`);
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const deactivateUser = async (id: number) => {
  try {
    await axiosInstance.put(`/admins/users/${id}/deactivate`);
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const addUserRole = async (id: number, role: "ADMIN" | "TEACHER" | "STUDENT") => {
  try {
    const validatedData = validateAndSanitizeInput(userRoleSchema, { id, role });
    await axiosInstance.put(`/admins/users/${validatedData.id}/assign/role`, null, { 
      params: { role: validatedData.role } 
    });
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const removeUserRole = async (id: number, role: "ADMIN" | "TEACHER" | "STUDENT") => {
  try {
    const validatedData = validateAndSanitizeInput(userRoleSchema, { id, role });
    await axiosInstance.put(`/admins/users/${validatedData.id}/role`, null, { 
      params: { role: validatedData.role } 
    });
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};

export const deleteUser = async (id: number) => {
  try {
    await axiosInstance.delete(`/admins/users/${id}`);
  } catch (error: any) {
    throw new Error(sanitizeErrorMessage(error));
  }
};