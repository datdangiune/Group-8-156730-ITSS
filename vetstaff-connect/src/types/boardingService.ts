export interface BoardingService {
    id: string;
    name: string;
    pricePerDay: number;
    maxDayStay: number;
    image?: string;
    status: "available" | "unavailable";
    details: {
      amenities: string[];
      [key: string]: any;
    };
    createdAt: string;
  }
  
  export type BoardingServiceFormValues = Omit<BoardingService, "id" | "createdAt"> & {
    image?: File | string;
  };
  