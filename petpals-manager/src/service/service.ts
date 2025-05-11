import Cookies from "js-cookie";

export interface ServiceDetail {
    included: string[];
  }
  interface Pet {
    id: number;
    name: string;
    type: string;
    breed: string;
  }
export interface Service {
    id: number;
    type: 'boarding' | 'grooming' | 'training';
    name: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    status: 'available' | 'unavailable';
    details: ServiceDetail;
  }
  
export interface GetServicesResponse {
    message: string;
    services: Service[];
  }

type ServiceStatusUser = 'In Progress' | 'Completed' | 'Scheduled' | 'Cancelled';
type StatusPayment = 'pending' | 'paid' | 'canceled';
export interface UserService {
    id: number;
    serviceId: number;
    userId: number;
    petId: number;
    date: string;
    hour: string;
    status: ServiceStatusUser;
    status_payment: StatusPayment;
    service: Service;
    pet: Pet;
  }
  export async function fetchServices(token: string): Promise<GetServicesResponse> {
    try {
      const response = await fetch('http://localhost:3000/api/v1/user/get-all-service', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401){
        Cookies.remove("token", { path: '/' });  // Add the correct path if needed
      }
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data: GetServicesResponse = await response.json();
  
      // Trả về dữ liệu dịch vụ
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Bạn có thể ném lỗi lên cao hơn nếu cần thiết
    }
  }
  export async function fetchServicesById(id: string, token: string): Promise<GetServicesResponse> {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/get-service/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401){
        Cookies.remove("token", { path: '/' });  // Add the correct path if needed
      }
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data: GetServicesResponse = await response.json();
      
      // Trả về dữ liệu dịch vụ
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Bạn có thể ném lỗi lên cao hơn nếu cần thiết
    }
  }


  interface RegisterServiceRequest {
    petId: number;
    serviceId: number;
    date: Date; // Định dạng YYYY-MM-DD
    hour: string; // Định dạng HH:mm
  }
  
  interface RegisterServiceResponse {
    message: string;
    serviceUser?: {
      id: number;
      serviceId: number;
      userId: number;
      petId: number;
      date: string;
      hour: string;
    };
  }
  
  export async function fetchRegisterService(
    token: string,
    requestData: RegisterServiceRequest
  ): Promise<RegisterServiceResponse> {
    try {
      const response = await fetch('http://localhost:3000/api/v1/user/service', {
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

  export const fetchUserServices = async (token: string): Promise<UserService[]> => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/service`, {
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
      return data as UserService[];
    } catch (error) {
      console.error("Error fetching user services:", error);
      throw error;
    }
  };
  export const getPaymentUrl = async (serviceId: number, token: string): Promise<string | null> => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/pay/${serviceId}`, {
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
  