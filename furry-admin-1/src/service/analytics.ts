import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Utility function to retrieve the token
const getAuthToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authentication token is missing.");
    return null;
  }
  return token;
};

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
