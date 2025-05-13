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


// Update boarding service
export const updateBoardingService = async (
  token: string,
  id: number,
  serviceData: NewBoardingServiceRequest
): Promise<NewBoardingServiceResponse> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/staff/boarding-services/${id}/edit`,
      serviceData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating boarding service:", error.message);
    throw new Error(error.response?.data?.message || "Failed to update boarding service");
  }
};


// Fetch user boardings
export const fetchUsersBoardings = async (token: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/user-boarding`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Map the response to include status_payment
    return response.data.data.map((boarding: any) => ({
      id: boarding.id,
      total_price: boarding.total_price,
      start_date: boarding.start_date,
      end_date: boarding.end_date,
      boardingId: boarding.boardingId,
      userId: boarding.userId,
      petId: boarding.petId,
      created_at: boarding.created_at,
      notes: boarding.notes,
      status: boarding.status,
      status_payment: boarding.status_payment, // Include status_payment
      boarding: boarding.boarding,
      pet: boarding.pet,
      user: boarding.user,
    }));
  } catch (error: any) {
    console.error("Error fetching user boardings:", error.message);
    throw new Error(error.message || "Failed to fetch user boardings");
  }
};

export const fetchCheckinBoarding = async (token: string, id: number): Promise<any> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/staff/user-boarding/${id}/checkin`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error checking in boarding:", error.message);
    throw new Error(error.response?.data?.message || "Failed to check in boarding");
  }
};

export const fetchCompleteBoarding = async (token: string, id: number): Promise<any> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/staff/user-boarding/${id}/complete`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error completing boarding:", error.message);
    throw new Error(error.response?.data?.message || "Failed to complete boarding");
  }
};

// Toggle boarding service status
export const toggleBoardingServiceStatus = async (
  token: string,
  id: number
): Promise<NewBoardingServiceResponse> => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/staff/boarding-services/${id}/status`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error toggling boarding service status:", error.message);
    throw new Error(error.response?.data?.message || "Failed to toggle boarding service status");
  }
};