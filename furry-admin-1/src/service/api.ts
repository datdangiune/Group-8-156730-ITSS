// Base API service để xử lý các request API
import Cookies from 'js-cookie';

// Base URL cho tất cả các API request
const API_BASE_URL = 'http://localhost:3000/api/v1/admin';

// Hàm tiện ích để xử lý các request
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || 'Đã xảy ra lỗi');
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
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const apiPost = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const apiPut = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const apiPatch = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const apiDelete = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};