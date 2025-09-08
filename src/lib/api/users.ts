import axiosInstance from "../axios";
import { setAuthToken } from "../cookie";

export const getAllUsers = async (searchTerm) => {
  try {
    const response = await axiosInstance.get(
      `/admins/search?page=0&size=100`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const login = async () => {
  const response = await axiosInstance.post("/auth/sign-in", {
    email: "aladdin19.11.21@gmail.com",
    password: "Admin12",
  });

  if (response.data.accessToken) {
    setAuthToken(response.data.accessToken);
  }
  return response.data;
};
