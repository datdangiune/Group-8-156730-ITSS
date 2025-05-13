// Service cho quản lý Appointment
import { apiGet } from './api';

// Interface cho Appointment
export interface Appointment {
  id: number;
  appointment_type: string;
  pet_id: number;
  owner_id: number;
  appointment_date: string;
  appointment_hour: string;
  reason?: string;
  appointment_status: string;
  created_at: string;
  pet?: {
    name: string;
    type: string;
  };
  staff?: {
    name: string;
  };
  owner?: {
    name: string;
  };
}

// Lấy các cuộc hẹn sắp tới
export const getUpcomingAppointments = async (): Promise<Appointment[]> => {
  return apiGet<Appointment[]>('/appointments/upcoming');
};

// Lấy các cuộc hẹn gần đây
export const getRecentAppointments = async (): Promise<Appointment[]> => {
  return apiGet<Appointment[]>('/appointments/recent');
};