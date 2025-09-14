import axiosInstance from "../axios";
import { ApiDashboardStats } from "../mockData";

export const getDashboardStats = async (): Promise<ApiDashboardStats> => {
  try {
    const response = await axiosInstance.get("/admins/dashboard");
    return response.data;
  } catch (error: any) {
    // Fallback to zeros if API is unreachable
    console.warn("Dashboard API unavailable, using fallback data");
    return {
      totalUsers: 0,
      activeUsers: 0,
      pendingUsers: 0,
      pendingApplicationsForTeaching: 0,
    };
  }
};