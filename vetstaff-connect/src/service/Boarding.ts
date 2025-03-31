import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
const API_BASE_URL = "http://localhost:3000/api/v1"; // Adjusted base URL if necessary

socket.on("connect", () => {
  console.log("Connected to WebSocket server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

// Define interfaces
export interface BoardingService {
    id: number;
    name: string;
    description: string;
    pricePerDay: number;
    maxStay: number;
    status: "available" | "unavailable";  // Giới hạn giá trị status để tránh lỗi
    createdAt: string;
    image?: string;
    amenities?: string[];  // Thêm trường amenities (danh sách tiện ích)
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
  serviceName: string;
  pricePerDay: number;
  maxStayDays: number;
  status: string;
  image?: string;
  amenities: string[];
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
  serviceData: NewBoardingServiceRequest
): Promise<NewBoardingServiceResponse> => {
  try {
    const formData = new FormData();

    // Ensure all required fields are properly formatted
    formData.append('serviceName', serviceData.serviceName.trim() || 'Unnamed Service');
    formData.append('pricePerDay', serviceData.pricePerDay.toString());
    formData.append('maxStayDays', serviceData.maxStayDays.toString());
    formData.append('status', serviceData.status || 'unavailable');

    if (serviceData.image) {
      formData.append('image', serviceData.image); // Ensure image is a File object
    }

    if (serviceData.amenities && Array.isArray(serviceData.amenities)) {
      formData.append('amenities', JSON.stringify(serviceData.amenities)); // Send amenities as a JSON string
    }

    const response = await axios.post(`${API_BASE_URL}/staff/boarding-services/new`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error adding new boarding service:', error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to add new boarding service');
  }
};
