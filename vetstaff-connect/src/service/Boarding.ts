import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
const API_BASE_URL = "http://localhost:3000/api/v1";

socket.on("connect", () => {
  console.log("Connected to WebSocket server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

// Define interfaces
export interface BoardingService {
    type: string;
    id: number;
    name: string;
    description: string;
    pricePerDay: number;
    maxStay: number;
    status: "available" | "unavailable";  // Giới hạn giá trị status để tránh lỗi
    createdAt: string;
    image?: string;
    details?: string[];  // Thêm trường amenities (danh sách tiện ích)
  }

export interface BoardingUserDetails {
  pet: {
    name: string;
    type: string;
    breed: string;
  };
  owner: {
    name: string;
    phone: string;
  };
  checkIn: string;
  checkOut: string;
  status: string;
  lastUpdated: string;
  medications: string[];
}

export interface NewBoardingServiceRequest {
  type: string;
  name: string;
  price: number;
  maxday: number;
  status?: string;
  image?: string;
  details?: string[];
}

export interface NewBoardingServiceResponse {
  success: boolean;
  message: string;
  data: BoardingService;
}

// Fetch available boarding services
export const fetchAvailableBoardingServices = async (token: string): Promise<BoardingService[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/boarding-services/available`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching available boarding services:", error.message);
    throw new Error(error.message || "Failed to fetch available boarding services");
  }
};

// Fetch boarding user details
export const fetchBoardingUserDetails = async (token: string): Promise<BoardingUserDetails[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/boarding-user-details`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching boarding user details:", error.message);
    throw new Error(error.message || "Failed to fetch boarding user details");
  }
};

// Add new boarding service
export const addNewBoardingService = async (
  token: string,
  serviceData: NewBoardingServiceRequest,
  image: string
): Promise<NewBoardingServiceResponse> => {
  try {
    console.log("Executing addNewBoardingService API call...");

    // Ensure default values for optional fields
    const payload = {
      ...serviceData,
      image: image || null, // Default to null if no image is provided
      details: serviceData.details || { included: [] }, // Default to an empty array if details are missing
    };

    console.log("Payload being sent:", payload);

    const response = await axios.post(`${API_BASE_URL}/staff/boarding-services/new`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Emit socket event to notify other clients
    socket.emit("updateService", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Error adding new boarding service:", error.message);
    console.error("Error details:", error.response?.data || error);

    throw new Error(error.response?.data?.message || error.message || "Failed to add new boarding service");
  }
};
