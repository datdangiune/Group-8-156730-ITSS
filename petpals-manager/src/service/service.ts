import Cookies from "js-cookie";
export interface ServiceDetail {
    included: string[];
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
  export async function fetchServices(token: string): Promise<GetServicesResponse> {
    try {
      const response = await fetch('http://localhost:3000/api/v1/user/get-all-service', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      console.log(response.status)
      if (response.status === 401) {
        console.warn("Token expired. Removing token and redirecting to login...");
        Cookies.remove("token", { path: "/" }); // Đảm bảo xóa đúng path
        localStorage.removeItem("user");
        window.location.href = "/login";
        return null;
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
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
        if (response.status === 401) {
            console.warn("Token expired. Removing token and redirecting to login...");
            Cookies.remove("token", { path: "/" }); // Đảm bảo xóa đúng path
            localStorage.removeItem("user");
            window.location.href = "/login";
            return null;
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
  
      if (!response.ok) {
        throw new Error(`Failed to register service: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error registering service:', error);
      throw error;
    }
  }
  