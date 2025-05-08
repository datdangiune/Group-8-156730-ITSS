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

export interface ExaminationRecord {
  id: number;
  appointment_id: number;
  created_at: string;
  diagnosis: string;
  prescription: string;
  follow_up_date?: string;
}

export const fetchPetMedicalHistory = async (petId: number): Promise<ExaminationRecord[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/pet/pets/${petId}/medical-history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data.filter((record: ExaminationRecord | null) => record !== null);
  } catch (error: any) {
    console.error(`Error fetching medical history for pet ID ${petId}:`, error.message);
    throw new Error(error.message || `Failed to fetch medical history for pet ID ${petId}`);
  }
};
