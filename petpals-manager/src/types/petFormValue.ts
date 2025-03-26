export type PetType = "dog" | "cat" | "bird" | "rabbit" | "fish" | "other";
export type PetGender = "male" | "female";
export type HealthStatus = "healthy" | "under-treatment" | "requires-attention";

export interface PetFormValues {
  name: string;
  age: number;
  gender: string;
  type: string;
  breed: string;
  fur_color: string;
  health_status?: string;
  diet_plan?: string;
  medical_history?: string;
  vaccination_history?: string;
  image?: File | null; // Nếu có ảnh kèm theo
}
