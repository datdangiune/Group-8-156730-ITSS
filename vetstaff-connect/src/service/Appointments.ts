import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

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

export interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export const fetchTodayAppointments = async (token: string): Promise<Appointment[]> => {
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

export const fetchAllAppointments = async (token: string): Promise<Appointment[]> => {
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

export const fetchAppointmentById = async (token: string, appointmentId: number): Promise<Appointment> => {
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
  token: string,
  appointmentId: number,
  status: string
): Promise<void> => {
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

export const fetchVetAppointments = async (token: string): Promise<Appointment[]> => {
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

export const fetchUsers = async (token: string): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
    throw new Error(error.message || "Failed to fetch users");
  }
};

export const fetchPetsByUserId = async (token: string, userId: number): Promise<Pet[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/pets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching pets for user ID ${userId}:`, error.message);
    throw new Error(error.message || `Failed to fetch pets for user ID ${userId}`);
  }
};

