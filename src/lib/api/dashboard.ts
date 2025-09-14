import axiosInstance from "../axios";

export interface ApiDashboardStats {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
  };
  activeCourseCount: number;
  activeCertificateCount: number;
  pendingApplicationsForTeaching: number;
}

export const getDashboardStats = async (): Promise<ApiDashboardStats> => {
  try {
    const response = await axiosInstance.get("/admins/dashboard");
    return response.data;
  } catch (error: any) {
    // Fallback to zeros if API is unreachable
    console.warn("Dashboard API unavailable, using fallback data");
    return {
      userStats: {
        totalUsers: 0,
        activeUsers: 0,
        pendingUsers: 0,
      },
      activeCourseCount: 0,
      activeCertificateCount: 0,
      pendingApplicationsForTeaching: 0,
    };
  }
};
