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

export interface Appointment {
  id: number;
  appointment_type: string;
  appointment_date: string;
  appointment_hour: string;
  reason: string;
  appointment_status: string;
  pet: {
    id: number;
    name: string;
    breed: string;
    age: number;
  };
  owner: {
    id: number;
    username: string;
    email: string;
  };
}

export const fetchTodayAppointments = async (): Promise<Appointment[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/appointments/today`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching today's appointments:", error.message);
    throw new Error(error.message || "Failed to fetch today's appointments");
  }
};

export const fetchAllAppointments = async (authToken: string): Promise<Appointment[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching all appointments:", error.message);
    throw new Error(error.message || "Failed to fetch all appointments");
  }
};

export const fetchAppointmentById = async (appointmentId: number): Promise<Appointment> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/appointments/${appointmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching appointment with ID ${appointmentId}:`, error.message);
    throw new Error(error.message || `Failed to fetch appointment with ID ${appointmentId}`);
  }
};

export const updateAppointmentStatus = async (
authToken: string, appointmentId: number, status: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    console.log(`Updating appointment status: ID=${appointmentId}, Status=${status}`); // Debugging log
    const response = await axios.patch(
      `${API_BASE_URL}/staff/appointments/${appointmentId}/status`,
      { appointment_status: status }, // Payload being sent
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Update response:", response.data); // Debugging log
  } catch (error: any) {
    console.error(`Error updating appointment status for ID ${appointmentId}:`, error.message);
    console.error("Error details:", error.response?.data || error); // Log detailed error response
    throw new Error(error.message || `Failed to update appointment status for ID ${appointmentId}`);
  }
};

export const fetchVetAppointments = async (): Promise<Appointment[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching vet appointments:", error.message);
    throw new Error(error.message || "Failed to fetch vet appointments");
  }
};

export const createAppointment = async (
  appointmentData: {
    appointment_type: string;
    pet_id: number;
    owner_id: number;
    appointment_date: string;
    appointment_hour: string;
    reason?: string;
  }
): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.post(
      `${API_BASE_URL}/staff/appointments/new`,
      appointmentData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Appointment created successfully:", response.data);
  } catch (error: any) {
    console.error("Error creating appointment:", error.message);
    throw new Error(error.message || "Failed to create appointment");
  }
};

export const fetchOwners = async (): Promise<{ id: number; username: string; email: string }[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/owners`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching owners:", error.message);
    throw new Error(error.message || "Failed to fetch owners");
  }
};

export const fetchPetsByOwner = async (ownerId: number): Promise<{ id: number; name: string; type: string; breed: string; age: number }[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/staff/owners/${ownerId}/pets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching pets for owner ID ${ownerId}:`, error.message);
    throw new Error(error.message || `Failed to fetch pets for owner ID ${ownerId}`);
  }
};

export const submitExaminationRecord = async (
  appointmentId: string,
  data: {
    diagnosis: string;
    medications: { name: string; dosage: string; instructions: string }[];
    needsFollowUp: boolean;
    followUpDate?: string;
  }
): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/vet/appointments/${appointmentId}/examination`,
      {
        diagnosis: data.diagnosis,
        medications: data.medications.map((med) => ({
          name: med.name,
          dosage: med.dosage,
          instructions: med.instructions,
        })),
        follow_up_date: data.needsFollowUp ? data.followUpDate : null,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Examination record submitted successfully:", response.data);
  } catch (error: any) {
    console.error("Error submitting examination record:", error.message);
    throw new Error(error.message || "Failed to submit examination record");
  }
};

