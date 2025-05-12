interface BoardingService {
    id: number;
    name: string;
    price: number; // giá trên ngày
    type: string;
    maxday: number;  // Số ngày tối đa
    image?: string;  // Hình ảnh có thể là null
    status: 'available' | 'unavailable';  // Trạng thái có thể là available hoặc unavailable
    details?: {
        amenities: string[]
    };  // Có thể có hoặc không, lưu thông tin chi tiết trong dạng JSON
}
interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
}
import Cookies from "js-cookie";
export interface BoardingResponse {
    message: string;
    boarding: BoardingService[];
  }
  export interface BoardingResponseID {
    message: string;
    boardings: BoardingService;
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
export const fetchBoardingServiceById = async (token: string, id: string): Promise<BoardingResponseID> => {
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
  
      const data: BoardingResponseID = await response.json();
      console.log(data) // Assuming the response has 'boarding' key
      return data; 
    } catch (error) {
      console.error('Error fetching boarding services:', error);
      throw error;
    }
};

interface RegisterBoardingRequest {
  petId: number;
  boardingId: number;
  start_date: string; // Định dạng YYYY-MM-DD
  end_date: string;
  notes: string;
}

interface RegisterBoardingResponse {
  message: string;
}

export async function fetchRegisterBaording(
  token: string,
  requestData: RegisterBoardingRequest
): Promise<RegisterBoardingResponse> {
  try {
    const response = await fetch('http://localhost:3000/api/v1/user/boarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Truyền token vào header
      },
      body: JSON.stringify(requestData),
    });
    if (response.status === 401){
      Cookies.remove("token", { path: '/' });  // Add the correct path if needed
    }
    if (!response.ok) {
      throw new Error(`Failed to register service: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering service:', error);
    throw error;
  }
}

type BoardingStatusUser = 'pending'| 'paid' | 'canceled';
export interface UserBoarding {
    id: number;
    boardingId: number;
    userId: number;
    petId: number;
    start_date: string;
    end_date: string;
    notes: string;
    status_payment: BoardingStatusUser;
    boarding: BoardingService;
    pet: Pet;
    total_price: number;
    status: 'In Progress' | 'Completed' | 'Scheduled' | 'Cancelled';
  }

  export const fetchUserBoarding = async (token: string, status: string): Promise<UserBoarding[]> => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/boarding?status=${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Unauthorized - removing token");
      if (response.status === 401){
        Cookies.remove("token", { path: '/' });  // Add the correct path if needed
      }
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to fetch user services.");
      }

      const { data } = await response.json();
      return data as UserBoarding[];
    } catch (error) {
      console.error("Error fetching user services:", error);
      throw error;
    }
  };
  

  export const getPaymentUrl = async (boardingId: number, token: string): Promise<string | null> => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/pay-boarding/${boardingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch payment URL');
      }
  
      const data = await response.json();
      return data.url || null;
    } catch (error) {
      console.error('Error fetching payment URL:', error);
      return null;
    }
  };