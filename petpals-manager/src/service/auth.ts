import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
interface SignupResponse {
  message: string;
  success: boolean;
}
interface LoginResponse {
  message: string;
  token: string;

}
interface CheckResponse {
  success: boolean;
  message: string;
  token: string;
  role: string;
}
interface UserPayload {
  id: string;
  email: string;
  role?: string;
  username: string; 
}
export async function Signup(fullname: string, email: string, password: string): Promise<SignupResponse> {
    try {
    const response = await fetch(`http://localhost:3000/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: fullname, email, password}),
    });
    const data: SignupResponse = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
}
export async function Login(email: string, password: string): Promise<LoginResponse> {
  
  try {
    const response = await fetch(`http://localhost:3000/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });
    const data: LoginResponse = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    console.log(data)
    Cookies.set('token', data.token);
    const decoded: UserPayload = jwtDecode(data.token);
    console.log("Decoded Token:", decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    // Trường hợp lỗi không rõ ràng
    throw new Error('An unexpected error occurred');
  }
}
export async function handleLogout() {
  const navigate = useNavigate()
  const response = await fetch("http://localhost:3000/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",  // Gửi cookie khi logout
  });

  if (response.ok) {
    navigate('/login')
    console.log("ok")
  } else {
    console.error("Logout failed");
  }
}

export function getTokenFromCookies() {
  return Cookies.get("token");
}
export async function checkUser(){
  try {
    const res = await fetch("https://50f8ddd6-2f59-45d5-840d-5ee1daf6afb0.us-east-1.cloud.genez.io/api/v1/auth/me", {
      method: 'GET',
      credentials: "include", 
    });
    if (!res.ok) throw new Error("Unauthorized");
    const data: CheckResponse = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}
