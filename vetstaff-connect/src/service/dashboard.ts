import axios from "axios";

const API_BASE_URL = "https://api.datto.id.vn/api/v1/staff";

export interface DashboardStats {
  counts: {
    todayAppointments: number;
    todayServices: number;
    activeBoarders: number;
    totalMedicalRecords: number;
  };
  lists: {
    todayAppointments: Appointment[];
    todayServices: Service[];
    activeBoarders: BoardingPet[];
    recentMedicalRecords: MedicalRecord[];
  };
}

export interface Appointment {
  id: number;
  appointment_type: string;
  appointment_date: string;
  appointment_hour: string;
  reason: string;
  appointment_status: "Done" | "Scheduled" | "Cancel" | "In Progress";
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

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  serviceId: number;
  userId: number;
  petId: number;
  date: string;
  hour: string;
  status: "Completed" | "In Progress" | "Scheduled" | "Cancel";
  status_payment: "paid" | "pending";
  service: {
    id: number;
    name: string;
    type: string;
    price: number;
    duration: string;
  };
  pet: {
    id: number;
    name: string;
    breed: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface BoardingPet {
  id: number;
  total_price: number;
  start_date: string;
  end_date: string;
  boarding: {
    id: number;
    name: string;
    type: string;
    price: number;
    maxday: number;
  };
  pet: {
    id: number;
    name: string;
    type: string;
    breed: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
  };
  status: "Done" | "Scheduled" | "Cancel" | "In Progress";
  status_payment: "Paid" | "pending";
}

export interface MedicalRecord {
  id: number;
  appointment_id: number;
  diagnosis: string;
  prescription: string;
  follow_up_date: string;
  created_at: string;
  appointment: {
    appointment_date: string;
    pet: {
      id: number;
      name: string;
      breed: string;
    };
    owner: {
      id: number;
      username: string;
      email: string;
    };
  };
}

export const fetchDashboardStats = async (token: string): Promise<DashboardStats> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error.message);
    throw new Error(error.message || "Failed to fetch dashboard stats");
  }
};

export const fetchAppointments = async (token: string): Promise<Appointment[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments/today`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching appointments:", error.message);
    throw new Error(error.message || "Failed to fetch appointments");
  }
};

// export const fetchNotifications = async (token: string): Promise<Notification[]> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/notifications`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Error fetching notifications:", error.message);
//     throw new Error(error.message || "Failed to fetch notifications");
//   }
// };

// export const fetchServices = async (token: string): Promise<Service[]> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/services`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Error fetching services:", error.message);
//     throw new Error(error.message || "Failed to fetch services");
//   }
// };

// export const fetchBoardingPets = async (token: string): Promise<BoardingPet[]> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/boarding`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Error fetching boarding pets:", error.message);
//     throw new Error(error.message || "Failed to fetch boarding pets");
//   }
// };
