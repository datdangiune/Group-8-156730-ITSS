
export type ServiceType = 'grooming' | 'boarding'| 'training';
export type ServiceStatus = 'available' | 'unavailable' ;
export type ServiceStatusUser = 'In Progess' | 'Scheduled' | 'Done';
export interface ServiceDetail {
    included: string[];
  }
  
export interface Service {
    id: number;
    type: ServiceType;
    name: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    status: ServiceStatus;
    details: ServiceDetail;
  }
  
export interface GetServicesResponse {
    message: string;
    services: Service[];
  }




export type PaymentStatus = 'paid' | 'unpaid';




export interface BoardingService {
  id: number;
  name: string;
  price: number; // giá trên ngày
  type: string;
  maxday: number;  // Số ngày tối đa
  image?: string;  // Hình ảnh có thể là null
  status: 'available' | 'unavailable';  // Trạng thái có thể là available hoặc unavailable
  details?: string[];  // Có thể có hoặc không, lưu thông tin chi tiết trong dạng JSON
}
