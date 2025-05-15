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

export interface BoardingItem {
  id: string;
  name: string;
  price: number;
  type: string;
  maxday: number;
  isActive: boolean;
  activeUses: number;
  totalUses: number;
}

export interface BoardingUserEntry {
  id: string;
  petName: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  statusPayment: string;
  notes?: string;
}

// Fetch all boarding services with stats
export const fetchBoardingsWithStats = async (): Promise<BoardingItem[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/boarding-with-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching boardings with stats:", error.message);
    throw new Error(error.message || "Failed to fetch boardings with stats");
  }
};

// Fetch boarding users by boarding (mock-like grouped data)
export const fetchBoardingUsersByBoarding = async (): Promise<Record<string, BoardingUserEntry[]>> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/boarding-users-by-boarding`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching boarding users by boarding:", error.message);
    throw new Error(error.message || "Failed to fetch boarding users by boarding");
  }
};
