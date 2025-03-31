import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1"; // Adjusted base URL if necessary

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
