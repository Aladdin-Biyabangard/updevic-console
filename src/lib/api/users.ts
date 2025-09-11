import axiosInstance from "../axios";
import { setAuthToken } from "../cookie";

interface UserCriteria {
  firstName?: string;
  email?: string;
  roles?: string[];
  status?: string;
}

export const getAllUsers = async (filters: UserCriteria = {}, page: number = 0, size: number = 100) => {
  try {
    // Query param üçün yalnız dəyəri olan field-ları saxlayırıq
    const params: Record<string, any> = {
      page,
      size
    };

    if (filters.firstName?.trim()) params.firstName = filters.firstName.trim();
    if (filters.email?.trim()) params.email = filters.email.trim();
    if (filters.roles && filters.roles.length > 0) params.roles = filters.roles.join(","); // array üçün CSV format
    if (filters.status?.trim()) params.status = filters.status.trim();

    const response = await axiosInstance.get("/admins/search", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/sign-in", { email, password });

  if (response.data.accessToken) {
    setAuthToken(response.data.accessToken);
  }
  return response.data;
};

export const activateUser = async (id: number) => {
  await axiosInstance.put(`/admins/users/${id}/activate`);
};

// User deaktivləşdirmək
export const deactivateUser = async (id: number) => {
  await axiosInstance.put(`/admins/users/${id}/deactivate`);
};

// Role əlavə etmək
export const addUserRole = async (id: number, role: "ADMIN" | "TEACHER" | "STUDENT") => {
  await axiosInstance.put(`/admins/users/${id}/assign/role`, null, { params: { role } });
};

// Role silmək
export const removeUserRole = async (id: number, role: "ADMIN" | "TEACHER" | "STUDENT") => {
  await axiosInstance.put(`/admins/users/${id}/role`, null, { params: { role } });
};

export const deleteUser = async (id: number) => {
  await axiosInstance.delete(`/admins/users/${id}`);
};