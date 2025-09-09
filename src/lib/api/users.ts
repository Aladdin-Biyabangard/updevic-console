import axiosInstance from "../axios";
import { setAuthToken } from "../cookie";

interface UserCriteria {
  firstName?: string;
  email?: string;
  roles?: string[];
  status?: string;
}

interface PageRequest {
  page: number;
  size: number;
}

interface SearchRequest {
  userCriteria: UserCriteria;
  pageRequest: PageRequest;
}

export const getAllUsers = async (filters: UserCriteria = {}, page: number = 0, size: number = 100) => {
  try {
    // Build userCriteria object with only non-empty values
    const userCriteria: UserCriteria = {};
    
    if (filters.firstName?.trim()) {
      userCriteria.firstName = filters.firstName.trim();
    }
    if (filters.email?.trim()) {
      userCriteria.email = filters.email.trim();
    }
    if (filters.roles && filters.roles.length > 0) {
      userCriteria.roles = filters.roles;
    }
    if (filters.status?.trim()) {
      userCriteria.status = filters.status.trim();
    }

    const requestBody: SearchRequest = {
      userCriteria,
      pageRequest: {
        page,
        size
      }
    };

    const response = await axiosInstance.post("/admins/search", requestBody);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/sign-in", {
    email,
    password,
  });

  if (response.data.accessToken) {
    setAuthToken(response.data.accessToken);
  }
  return response.data;
};
