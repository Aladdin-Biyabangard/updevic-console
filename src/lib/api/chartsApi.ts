import axiosInstance from "../axios";

// ---- Types ----
export interface UserRoleData {
  name: string;
  value: number;
  color: string;
}

export interface ApplicationStatusData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyActivityData {
  month: string;
  applications: number;
  certificates: number;
  courses: number;
}

export interface ChartsData {
  userRoles: UserRoleData[];
  applicationStatus: ApplicationStatusData[];
  monthlyActivity: MonthlyActivityData[];
}

// ---- API Calls ----

// GET /api/v1/admins/charts
export const getChartsData = async (): Promise<ChartsData> => {
  try {
    const response = await axiosInstance.get("/admins/charts");
    return response.data;
  } catch (error) {
    // Fallback to mock data if API is unavailable
    console.warn("Charts API unavailable, using fallback data");
    return getMockChartsData();
  }
};

// Mock data for development/fallback
export const getMockChartsData = (): ChartsData => ({
  userRoles: [
    { name: 'Admin', value: 2, color: '#3b82f6' },
    { name: 'Teacher', value: 3, color: '#10b981' },
    { name: 'Student', value: 1, color: '#f59e0b' },
  ],
  applicationStatus: [
    { name: 'Pending', value: 2, color: '#f59e0b' },
    { name: 'Approved', value: 1, color: '#10b981' },
    { name: 'Rejected', value: 1, color: '#ef4444' },
  ],
  monthlyActivity: [
    { month: 'Sep', applications: 12, certificates: 8, courses: 3 },
    { month: 'Oct', applications: 19, certificates: 15, courses: 5 },
    { month: 'Nov', applications: 8, certificates: 12, courses: 2 },
    { month: 'Dec', applications: 15, certificates: 18, courses: 4 },
    { month: 'Jan', applications: 22, certificates: 20, courses: 6 },
  ],
});