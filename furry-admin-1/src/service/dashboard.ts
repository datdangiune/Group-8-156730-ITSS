// Service cho quản lý Dashboard
import { apiGet } from './api';

// Interface cho dashboard stats
export interface DashboardStats {
  totalUsers: number;
  activeBoarders: number;
  pendingServices: number;
  unreadNotifications: number;
}

// Interface cho doanh thu theo tháng
export interface MonthlyRevenue {
  month: number;
  total: number;
}

// Interface cho dịch vụ theo danh mục
export interface ServiceStat {
  day: string;
  type: string;
  count: number;
  status?: string;
}

// Interface cho lịch hẹn hôm nay
export interface TodayAppointment {
  id: number;
  appointment_type: string;
  appointment_hour: string;
  appointment_status: string;
  pet: {
    name: string;
    type: string;
  };
}

// Interface cho dịch vụ hôm nay
export interface TodayService {
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
}

// Interface cho lịch trình hôm nay
export interface TodaySchedule {
  appointments: TodayAppointment[];
  services: TodayService[];
}

// Interface cho thông báo
export interface Notification {
  id: number;
  title: string;
  message: string;
  url?: string;
  is_read: boolean;
  created_at: string;
}

// Lấy thống kê dashboard
export const fetchDashboardStats = async (token?: string): Promise<DashboardStats> => {
  return apiGet<DashboardStats>('/dashboard/stats');
};

// Lấy doanh thu theo tháng
export const fetchMonthlyRevenue = async (token?: string): Promise<MonthlyRevenue[]> => {
  return apiGet<MonthlyRevenue[]>('/dashboard/monthly-revenue');
};

// Lấy thống kê dịch vụ theo danh mục
export const fetchServiceStatsByCategory = async (token?: string): Promise<ServiceStat[]> => {
  return apiGet<ServiceStat[]>('/dashboard/service-stats');
};

// Lấy lịch trình hôm nay
export const fetchTodaySchedule = async (token?: string): Promise<TodaySchedule> => {
  return apiGet<TodaySchedule>('/dashboard/today-schedule');
};

// Lấy thông báo gần đây
export const fetchRecentNotifications = async (token?: string): Promise<Notification[]> => {
  return apiGet<Notification[]>('/dashboard/recent-notifications');
};