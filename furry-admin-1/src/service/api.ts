// Base API service để xử lý các request API
import Cookies from 'js-cookie';

// Base URL cho tất cả các API request
// Sử dụng import.meta.env thay vì process.env cho Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.datto.id.vn/api/v1/admin';

// Hàm tiện ích để xử lý các request
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Đã xảy ra lỗi');
    } catch (e) {
      // Nếu response không phải là JSON
      throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
};

// Hàm để lấy token từ cookie
export const getAuthHeader = () => {
  const token = Cookies.get('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Các hàm API wrapper
export const apiGet = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  } catch (error: any) {
    console.error(`[API] GET ${endpoint} error:`, error);
    throw error;
  }
};

export const apiPost = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (error: any) {
    console.error(`[API] POST ${endpoint} error:`, error);
    throw error;
  }
};

export const apiPut = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (error: any) {
    console.error(`[API] PUT ${endpoint} error:`, error);
    throw error;
  }
};

export const apiPatch = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (error: any) {
    console.error(`[API] PATCH ${endpoint} error:`, error);
    throw error;
  }
};

export const apiDelete = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  } catch (error: any) {
    console.error(`[API] DELETE ${endpoint} error:`, error);
    throw error;
  }
};