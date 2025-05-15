import axios from "axios";

const API_BASE_URL = "https://api.datto.id.vn/api/v1";

// Utility function to retrieve the token
const getAuthToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authentication token is missing.");
    return null;
  }
  return token;
};

export interface DashboardTotalCounts {
  totalUsers: number;
  totalAppointments: number;
  totalPets: number;
  totalServices: number;
  totalBoardings: number;
}

export const fetchDashboardTotalCounts = async (): Promise<DashboardTotalCounts> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard/total-counts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching dashboard total counts:", error.message);
    throw new Error(error.message || "Failed to fetch dashboard total counts");
  }
};

// === Analytics fetch functions moved from analytics.ts ===

export interface RevenueDataItem {
  name: string;
  value: number;
}

export interface ServiceDataItem {
  name: string;
  value: number;
}

export interface AnalyticsData {
  revenueData: RevenueDataItem[];
  serviceData: ServiceDataItem[];
}

export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/analytics/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching analytics data:", error.message);
    throw new Error(error.message || "Failed to fetch analytics data");
  }
};
