import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Utility function to retrieve the token
const getAuthToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authentication token is missing.");
    return null;
  }
  return token;
};

export interface SimpleUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Fetch all users in simple format
export const fetchSimpleUserList = async (): Promise<SimpleUser[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/users/simple`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching simple user list:", error.message);
    throw new Error(error.message || "Failed to fetch simple user list");
  }
};

// Set user as Admin
export const setUserAsAdmin = async (userId: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    await axios.patch(`${API_BASE_URL}/admin/users/${userId}/set-admin`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error("Error setting user as admin:", error.message);
    throw new Error(error.message || "Failed to set user as admin");
  }
};

// Set user as Vet
export const setUserAsVet = async (userId: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    await axios.patch(`${API_BASE_URL}/admin/users/${userId}/set-vet`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error("Error setting user as vet:", error.message);
    throw new Error(error.message || "Failed to set user as vet");
  }
};

// Set user as Staff
export const setUserAsStaff = async (userId: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    await axios.patch(`${API_BASE_URL}/admin/users/${userId}/set-staff`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    console.error("Error setting user as staff:", error.message);
    throw new Error(error.message || "Failed to set user as staff");
  }
};

// Add user (with password)
export interface AddUserRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export const addUser = async (user: AddUserRequest): Promise<any> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/users`, user, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error adding user:", error.message);
    throw new Error(error.message || "Failed to add user");
  }
};
