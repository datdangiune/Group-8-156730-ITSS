// ================= INTERFACES =================

export interface DashboardStats {
  totalUsers: number;
  activeBoarders: number;
  pendingServices: number;
  unreadNotifications: number;
}

export interface RevenueData {
  month: number;
  total: number;
}

export interface ServiceStatsByDay {
  day: string;
  status: string;
  type: string;
  count: number;
}

export interface Pet {
  name: string;
  type: string;
}

export interface Appointment {
  id: number;
  appointment_type: string;
  appointment_hour: string;
  appointment_status: string;
  pet: Pet;
}

export interface ServiceToday {
  id: number;
  hour: string;
  status: string;
  pet: Pet;
  service: {
    name: string;
  };
}

export interface TodaySchedule {
  appointments: Appointment[];
  services: ServiceToday[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
}

// ================ API URL =====================

const API_URL = "http://localhost:3000/api/v1/admin/dashboard";

// ================ FETCH FUNCTIONS =============

export const fetchDashboardStats = async (token: string): Promise<DashboardStats> => {
  try {
    const res = await fetch(`${API_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch dashboard stats");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    throw error;
  }
};

export const fetchMonthlyRevenue = async (token: string): Promise<RevenueData[]> => {
  try {
    const res = await fetch(`${API_URL}/monthly-revenue`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch revenue data");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching monthly revenue:", error);
    throw error;
  }
};

export const fetchServiceStatsByCategory = async (token: string): Promise<ServiceStatsByDay[]> => {
  try {
    const res = await fetch(`${API_URL}/service-stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch service stats");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching service stats:", error);
    throw error;
  }
};

export const fetchTodaySchedule = async (token: string): Promise<TodaySchedule> => {
  try {
    const res = await fetch(`${API_URL}/today-schedule`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch today's schedule");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching today schedule:", error);
    throw error;
  }
};

export const fetchRecentNotifications = async (token: string): Promise<Notification[]> => {
  try {
    const res = await fetch(`${API_URL}/recent-notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch notifications");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    throw error;
  }
};
