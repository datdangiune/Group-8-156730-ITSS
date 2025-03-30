import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1/staff";

export const fetchServices = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/services`, {
      headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching services:", error.message);
    throw new Error(error.message || "Failed to fetch services");
  }
};
