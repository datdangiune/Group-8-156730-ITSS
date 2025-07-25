import axios from "axios";

const API_BASE_URL = "https://api.datto.id.vn/api/v1/pet";

const getAuthToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authentication token is missing.");
    return null;
  }
  return token;
};

export const fetchPets = async (): Promise<any[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/pets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching pets:", error.message);
    throw new Error(error.message || "Failed to fetch pets");
  }
};

export const fetchPetRecordCounts = async (): Promise<any[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/pets/record-counts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching pet record counts:", error.message);
    throw new Error(error.message || "Failed to fetch pet record counts");
  }
};
