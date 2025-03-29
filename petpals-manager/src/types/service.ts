
export type ServiceType = 'grooming' | 'boarding'| 'training';
export type ServiceStatus = 'available' | 'unavailable' ;

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