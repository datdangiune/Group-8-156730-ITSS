 interface BoardingService {
  id: number;
  name: string;
  price: number; // giá trên ngày
  type: string;
  maxday: number;  // Số ngày tối đa
  image?: string;  // Hình ảnh có thể là null
  status: 'available' | 'unavailable';  // Trạng thái có thể là available hoặc unavailable
  details?: string[];  // Có thể có hoặc không, lưu thông tin chi tiết trong dạng JSON
}

import Cookies from "js-cookie";
export interface BoardingResponse {
    message: string;
    boarding: BoardingService[];
  }
// Function to fetch the boarding services
export const fetchBoardingServices = async (token: string): Promise<BoardingResponse> => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/user/get-all-boarding', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass the token in headers
        },
      });
      if(response.status === 401){
        Cookies.remove('token');
      }
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to fetch boarding services');
      }
  
      const data: BoardingResponse = await response.json(); // Assuming the response has 'boarding' key
      return data; 
    } catch (error) {
      console.error('Error fetching boarding services:', error);
      throw error;
    }
};
export const fetchBoardingServiceById = async (token: string, id: string): Promise<BoardingResponse> => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/get-boarding/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass the token in headers
        },
      });
      if(response.status === 401){
        Cookies.remove('token');
      }
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to fetch boarding services');
      }
  
      const data: BoardingResponse = await response.json(); // Assuming the response has 'boarding' key
      return data; 
    } catch (error) {
      console.error('Error fetching boarding services:', error);
      throw error;
    }
};
  