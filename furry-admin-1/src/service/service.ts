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

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  isActive: boolean;
  activeUses: number;
  totalUses: number;
}

export interface ServiceUserEntry {
  id: string;
  petName: string;
  ownerName: string;
  time: string;
  status: string;
}

// Fetch all services with stats
export const fetchServicesWithStats = async (): Promise<ServiceItem[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/services-with-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching services with stats:", error.message);
    throw new Error(error.message || "Failed to fetch services with stats");
  }
};

// Fetch service users by service (mock-like grouped data)
export const fetchServiceUsersByService = async (): Promise<Record<string, ServiceUserEntry[]>> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/service-users-by-service`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching service users by service:", error.message);
    throw new Error(error.message || "Failed to fetch service users by service");
  }
};
