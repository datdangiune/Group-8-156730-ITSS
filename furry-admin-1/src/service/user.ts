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
  try {
    return await apiPost<LoginResponse>('/login', data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi đăng nhập');
  }
};

// Lấy tất cả users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await apiGet<User[]>('/users');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách người dùng');
  }
};

// Thêm user mới
export const addUser = async (data: AddUserData): Promise<{ success: boolean; message: string; user: User }> => {
  try {
    return await apiPost('/users', data);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi thêm người dùng');
  }
};

// Cập nhật thông tin user
export const updateUser = async (id: number, data: UpdateUserData): Promise<{ message: string; user: User }> => {
  try {
    return await apiPut(`/users/${id}`, data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin người dùng');
  }
};

// Đổi mật khẩu user
export const changeUserPassword = async (id: number, data: ChangePasswordData): Promise<{ message: string }> => {
  try {
    return await apiPatch(`/users/${id}/password`, data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Lỗi khi đổi mật khẩu người dùng');
  }
};