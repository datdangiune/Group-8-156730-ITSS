import Cookies from "js-cookie";

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