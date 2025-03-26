

export interface Pet {
  id: number;
  name: string;
  type: string;
  breed?: string;
  age?: number;
  gender: string;
  weight?: number;
  fur_color?: string;
  image?: string;
  health_status?: string;
  diet_plan?: string;
  medical_history?: string;
  vaccination_history?: string;
  lastCheckup?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}