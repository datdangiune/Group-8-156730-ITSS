// Service cho quản lý User
import { apiGet, apiPost, apiPut, apiPatch } from './api';

// Interface cho thông tin user
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  username?: string;
  phone_number?: string;
  created_at: string;
}

// Interface cho thông tin đăng nhập
export interface LoginData {
  email: string;
  password: string;
}

// Interface cho kết quả đăng nhập
export interface LoginResponse {
  message: string;
  token: string;
}

// Interface cho dữ liệu thêm user mới
export interface AddUserData {
  name: string;
  email: string;
  role: string;
  username: string;
  phone_number?: string;
}

// Interface cho dữ liệu cập nhật user
export interface UpdateUserData {
  name?: string;
  email?: string;
  phone_number?: string;
  role?: string;
}

// Interface cho dữ liệu đổi mật khẩu
export interface ChangePasswordData {
  newPassword: string;
}

// Đăng nhập
export const loginAdmin = async (data: LoginData): Promise<LoginResponse> => {
  return apiPost<LoginResponse>('/login', data);
};

// Lấy tất cả users
export const getAllUsers = async (): Promise<User[]> => {
  return apiGet<User[]>('/users');
};

// Thêm user mới
export const addUser = async (data: AddUserData): Promise<{ success: boolean; message: string; user: User }> => {
  return apiPost('/users', data);
};

// Cập nhật thông tin user
export const updateUser = async (id: number, data: UpdateUserData): Promise<{ message: string; user: User }> => {
  return apiPut(`/users/${id}`, data);
};

// Đổi mật khẩu user
export const changeUserPassword = async (id: number, data: ChangePasswordData): Promise<{ message: string }> => {
  return apiPatch(`/users/${id}/password`, data);
};