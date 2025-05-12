interface AppointmentFormValues {
    appointment_type: string;
    pet_id: number;
    appointment_date: string;
    appointment_hour: string;
    reason?: string;
}
interface Pet {
    id: number;
    name: string;
}
export interface AppointmentResult {
  id: number;
  appointment_id: number;
  diagnosis: string;
  prescription: string;
  follow_up_date: string; // ISO date string
  created_at: string; // ISO date string
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string; // thường không nên gửi xuống client, trừ khi cần debug nội bộ
  role: 'admin' | 'staff' | 'pet_owner'; // bạn có thể mở rộng nếu có thêm role khác
  phone_number: string | null;
  created_at: string; // ISO date string
}

export type AppointmentStatus = 'Scheduled' | 'Done' | 'Cancel' | 'In Progress';
export interface Appointment {
    id: number;
    appointment_type: string;
    pet_id: number;
    owner_id: number;
    appointment_date: string; // Dạng "YYYY-MM-DDTHH:mm:ss.sssZ"
    appointment_hour: string; // Dạng "HH:mm"
    reason?: string;
    pet: Pet;
    appointment_status: AppointmentStatus;
    owner?: User;
    result?: AppointmentResult | null;
  }
  

const API_URL = "http://localhost:3000/api/v1/user/appointments";

export const createAppointment = async (data: AppointmentFormValues, token: string): Promise<void> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data), 
        });
        
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || "Failed to book appointment.");
        }
    } catch (error) {
        console.error("Failed to book appointment:", error);
        throw error;
    }
};





export const fetchUserAppointments = async (token: string, status: string): Promise<Appointment[]> => {
    try {
      const response = await fetch(`${API_URL}?status=${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to fetch appointments.");
      }
  
      const { data } = await response.json();
      return data.map((appointment: any) => ({
        ...appointment,
        appointment_date: new Date(appointment.appointment_date).toISOString().split("T")[0], // Chuyển thành YYYY-MM-DD
      })) as Appointment[];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
};

export interface FetchAppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment;
}
export const fetchAppointmentResultById = async(token:string, id: number): Promise<FetchAppointmentResponse> => {
    const res = await fetch(`http://localhost:3000/api/v1/user/appointment-result/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch appointment result');
  }

  const data = await res.json();
  console.log(data)
  return data;
}

export const deleteScheduledAppointment = async (token: string, id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || "Failed to delete appointment.");
        }
    } catch (error) {
        console.error("Failed to delete appointment:", error);
        throw error;
    }
};