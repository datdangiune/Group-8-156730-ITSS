// Service cho quản lý Appointment
import { apiGet } from './api';
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
}


export interface AppointmentItem {
  id: string;
  petName: string;
  petType: string;
  ownerName: string;
  appointmentType: string;
  appointmentDate: string;
  reason: string;
  status: string;
}

// Fetch all appointments in mock-like format
export const fetchAppointmentsMockFormat = async (): Promise<AppointmentItem[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/appointments-mock-format`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching appointments in mock format:", error.message);
    throw new Error(error.message || "Failed to fetch appointments in mock format");
  }
};