import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { Login } from "@/service/auth";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const location = useLocation();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        try {
            await Login(email, password);
            navigate("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Có lỗi xảy ra!');
        }
        
    }
    useEffect(()=>{
        console.log(token);
        if(token){
            navigate("/");
        }
    },[token, navigate]);
    useEffect(() => {
        console.log("Full URL:", window.location.href);
        console.log("Current Path:", location.pathname);
        console.log("Query Params:", location.search);
        const queryParams = new URLSearchParams(location.search);
        const token1 = queryParams.get("token");
        console.log(token1);
        if (token1) {
            Cookies.set("token", token1);
            navigate("/");
        }
    }, [location, navigate]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{
        backgroundImage: "url('/bgr.jpg')",
        }}>
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="flex items-center space-x-2">
                <input
                type="text"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            {/* Password */}
            <div className="flex items-center space-x-2">
                <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
                Login
            </button>
            <div className="my-4 flex items-center gap-4">
                <hr className="w-full border-slate-300" />
                <p className="text-sm text-slate-800 text-center">or</p>
                <hr className="w-full border-slate-300" />
            </div>
            </form>

            <div className="mt-2 text-center">
            <Link to="/forgot-password" className="text-red-500 hover:underline">
                Forgot your password?
            </Link>
            </div>

            {/* Link quay lại trang đăng ký */}
            <div className="mt-4 text-center">
            <Link to="/register" className="text-blue-500 hover:underline">
                Don't have an account? Register here.
            </Link>
            </div>

        </div>
        </div>
    );
}

export default LoginPage;