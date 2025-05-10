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
export interface Pet {
  id: number;
  name: string;
  breed: string;
}

export interface Service {
  id: number;
  type: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  status: string;
  date: string;
  hour: string;
  pet?: Pet;
  image?: string;
}
interface ClinicService {
  id: number;
  type: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image?: string;
  status: 'available' | 'unavailable';
}
interface CreateServiceRequest {
  id: number;
  type: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status?: string;
  image?: string;
  details?: {
    included: string[];
  };
}

interface CreateServiceResponse {
  message: string;
  service: Service;
}

interface EditServiceRequest {
  id: number;
  type: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status?: string;
  image?: string;
  details?: {
    included: string[];
  };
}

interface EditServiceResponse {
  message: string;
  service: Service;
}

export const fetchServices = async (token: string): Promise<ClinicService[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/clinic-services`, {
      headers: { Authorization: `Bearer ${token}` }, 
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching services:", error.message);
    throw new Error(error.message || "Failed to fetch services");
  }
};

export const fetchUserServices = async (token: string): Promise<Service[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/user-services`, {
      headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching user services:", error.message);
    throw new Error(error.message || "Failed to fetch user services");
  }
};

export const fetchCreateService = async (
  token: string,
  requestData: CreateServiceRequest,
  image: string
): Promise<CreateServiceResponse> => {
  try {
    const payload = {...requestData, image: image}
    const response = await axios.post(`${API_BASE_URL}/staff/clinic-services/create`, payload, {
      headers: { Authorization: `Bearer ${token}` },
      
    });
    socket.emit("updateService", response.data);
    console.log("Backend response:", response.data); // Log the response for debugging

    if (response.status !== 201) {
      throw new Error(response.data.message || "Failed to create service");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error creating service:", error.message);
    throw new Error(error.message || "Failed to create service");
  }
};

export const fetchEditService = async (
  token: string,
  serviceId: number,
  requestData: EditServiceRequest
): Promise<EditServiceResponse> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/staff/clinic-services/${serviceId}/edit`,
      requestData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    socket.emit("updateService", response.data);
    console.log("Backend response:", response.data); // Log the response for debugging

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to edit service");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error editing service:", error.message);
    throw new Error(error.message || "Failed to edit service");
  }
};

export const fetchToggleServiceStatus = async (token: string, serviceId: number): Promise<{ status: string }> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/staff/clinic-services/${serviceId}/status`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to toggle service status");
    }

    console.log("Service status toggled successfully:", response.data.message);
    return { status: response.data.status }; // Return the updated status
  } catch (error: any) {
    console.error("Error toggling service status:", error.message);
    throw new Error(error.message || "Failed to toggle service status");
  }
};
