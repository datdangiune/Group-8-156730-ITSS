import Cookies from "js-cookie";
import { PetFormValues } from "@/types/petFormValue";
interface Pet {
    id: number; 
    owner_id: number;
    name: string;
    age: number;
    gender: string;
    breed: string;
    fur_color: string;
    health_status: string;
    diet_plan: string;
    medical_history: string;
    vaccination_history: string;
    created_at: string;
    image: string | null;
    type: string;
}
interface PetsResponse {
    success: boolean;
    message: string;
    data: Pet[];
}

export async function getPets(token: string): Promise<Pet[]> {
    try {
      const response = await fetch("http://localhost:3000/api/v1/user/pets", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        console.warn("Token expired. Removing token and redirecting to login...");
        Cookies.remove("token", { path: "/" }); // Đảm bảo xóa đúng path
        localStorage.removeItem("user");
        window.location.href = "/login";
        return null;
      }
      const result: PetsResponse = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch pets");
      }
      if (response.status === 401) {
        console.warn("Token expired. Removing token and redirecting to login...");
        Cookies.remove("token", { path: "/" }); // Đảm bảo xóa đúng path
        localStorage.removeItem("user");
        window.location.href = "/login";
        return null;
      }
      return result.data;
    } catch (error) {
      console.error("Error fetching pets:", error);
      return [];
    }
}

export async function getPet(token: string, id: number): Promise<Pet | null> {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/user/get-pet/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.status)
    if (response.status === 401) {
      console.warn("Token expired. Removing token and redirecting to login...");
      Cookies.remove("token", { path: "/" }); // Đảm bảo xóa đúng path
      localStorage.removeItem("user");
      window.location.href = "/login";
      return null;
    }
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch pet details");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching pet details:", error);
    return null;
  }
}


export const uploadFile = async (file: File, token: string): Promise<string | null> => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file); // 🔹 Đúng với key "file" mà backend yêu cầu

  try {
    const response = await fetch("http://localhost:3000/api/v1/user/image", {
      method: "POST",
      body: formData,
      headers: {
        // ❌ KHÔNG thêm "Content-Type", trình duyệt sẽ tự động tạo boundary
        Authorization: `Bearer ${token}`, // Nếu backend yêu cầu xác thực
      },
    });

    if (!response.ok) {
      throw new Error("Upload thất bại!");
    }
    if (response.status === 401) {
      console.warn("Token expired. Removing token and redirecting to login...");
      Cookies.remove("token", { path: "/" }); // Đảm bảo xóa đúng path
      localStorage.removeItem("user");
      window.location.href = "/login";
      return null;
    }
    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    return null;
  }
};

export const registerPet = async (petData: PetFormValues, imageUrl: string | null, token:string): Promise<void> => {
  try {
    const payload = { ...petData, image: imageUrl }; // Thêm URL ảnh nếu có

    const response = await fetch("http://localhost:3000/api/v1/user/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Token nếu cần
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to register pet");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering pet:", error);
    throw error;
  }
};



export const updatePet = async (petData: PetFormValues, imageUrl: string | null, token:string, petId: number): Promise<void> => {
  try {
    const payload = { ...petData, image: imageUrl }; // Thêm URL ảnh nếu có

    const response = await fetch(`http://localhost:3000/api/v1/user/pets/${petId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Token nếu cần
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to register pet");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering pet:", error);
    throw error;
  }
};
