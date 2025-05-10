type RevenueData = {
  month: number;
  total: number;
};

type DashboardStats = {
  totalUsers: number;
  activeBoarders: number;
  pendingServices: number;
  unreadNotifications: number;
};

type ServiceStatsByDay = {
  day: string;
  status: string;
  type: string;
  count: number;
};

type Appointment = {
  id: number;
  appointment_type: string;
  appointment_hour: string;
  appointment_status: string;
  pet: {
    name: string;
    type: string;
  };
};

type ServiceToday = {
  id: number;
  hour: string;
  status: string;
  pet: {
    name: string;
    type: string;
  };
  service: {
    name: string;
  };
};

type TodaySchedule = {
  appointments: Appointment[];
  services: ServiceToday[];
};

type Notification = {
  id: number;
  title: string;
  message: string;
  created_at: string;
};

const BASE_URL = 'http://localhost:3000/api/v1/admin/dashboard';

async function fetchDashboardStats(): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/stats`);
    const data: DashboardStats = await res.json();

    console.log("\n===== 📊 DASHBOARD OVERVIEW =====");
    console.log(`👥 Total Users: ${data.totalUsers}`);
    console.log(`🏠 Active Boarders: ${data.activeBoarders}`);
    console.log(`🛁 Pending Services: ${data.pendingServices}`);
    console.log(`🔔 Unread Notifications: ${data.unreadNotifications}`);
  } catch (err) {
    console.error("❌ Error fetching dashboard stats:", err);
  }
}

async function fetchMonthlyRevenue(): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/monthly-revenue`);
    const data: RevenueData[] = await res.json();

    console.log("\n===== 💰 Revenue Overview =====");
    console.log("Monthly revenue in USD for the current year:");
    data.forEach(d => {
      console.log(`- Month ${d.month}: $${d.total}`);
    });
  } catch (err) {
    console.error("❌ Error fetching revenue:", err);
  }
}

async function fetchServiceStatsByCategory(): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/service-stats`);
    const data: ServiceStatsByDay[] = await res.json();

    console.log("\n===== 📊 Services by Category =====");
    console.log("Weekly breakdown of services by category:");
    data.forEach(s => {
      console.log(`- ${s.day} | ${s.type} (${s.status}): ${s.count}`);
    });
  } catch (err) {
    console.error("❌ Error fetching service stats:", err);
  }
}

async function fetchTodaySchedule(): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/today-schedule`);
    const data: TodaySchedule = await res.json();

    console.log("\n===== 📅 Today's Schedule =====");
    console.log("Appointments and services for today:\n");

    console.log("👉 Appointments:");
    data.appointments.forEach(a => {
      console.log(`- ${a.pet.name} (${a.pet.type}) | ${a.appointment_type} at ${a.appointment_hour}`);
    });

    console.log("\n👉 Services:");
    data.services.forEach(s => {
      console.log(`- ${s.pet.name} (${s.pet.type}) | ${s.service.name} at ${s.hour}`);
    });
  } catch (err) {
    console.error("❌ Error fetching today's schedule:", err);
  }
}

async function fetchRecentNotifications(): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/recent-notifications`);
    const data: Notification[] = await res.json();

    console.log("\n===== 🔔 Recent Notifications =====");
    console.log("Updates and alerts:");
    data.forEach(n => {
      console.log(`- [${n.created_at}] ${n.title}: ${n.message}`);
    });
  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
  }
}

// ======= RUN ALL =======
(async () => {
  await fetchDashboardStats();
  await fetchMonthlyRevenue();
  await fetchServiceStatsByCategory();
  await fetchTodaySchedule();
  await fetchRecentNotifications();
})();