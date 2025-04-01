export interface BoardingService {
  type: string;
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  maxStay: number;
  status: "available" | "unavailable";  // Giới hạn giá trị status để tránh lỗi
  createdAt: string;
  image?: string;
  amenities?: string[];  // Thêm trường amenities (danh sách tiện ích)
}

  export type BoardingServiceFormValues = Omit<BoardingService, "id" | "createdAt"> & {
    amenities?: string[]; // Add amenities as an optional property
    image?: string;
  };
  