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
    const googleLogin = () => {
        window.location.href = 'https://50f8ddd6-2f59-45d5-840d-5ee1daf6afb0.us-east-1.cloud.genez.io/auth/google'
    }
    const twitterLogin = () => {
        window.location.href = 'https://50f8ddd6-2f59-45d5-840d-5ee1daf6afb0.us-east-1.cloud.genez.io/auth/twitter'
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
            <div className="space-x-6 flex justify-center">
            <button type="button" onClick={googleLogin}
                className="border-none outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 512 512">
                    <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" data-original="#fbbd00" />
                    <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" data-original="#0f9d58" />
                    <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z" data-original="#31aa52" />
                    <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" data-original="#3c79e6" />
                    <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z" data-original="#cf2d48" />
                    <path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z" data-original="#eb4132" />
                </svg>
            </button>
            <button type="button" onClick={twitterLogin}
                className="border-none outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 50 50">
                <path d="M 11 4 C 7.1456661 4 4 7.1456661 4 11 L 4 39 C 4 42.854334 7.1456661 46 11 46 L 39 46 C 42.854334 46 46 42.854334 46 39 L 46 11 C 46 7.1456661 42.854334 4 39 4 L 11 4 z M 11 6 L 39 6 C 41.773666 6 44 8.2263339 44 11 L 44 39 C 44 41.773666 41.773666 44 39 44 L 11 44 C 8.2263339 44 6 41.773666 6 39 L 6 11 C 6 8.2263339 8.2263339 6 11 6 z M 13.085938 13 L 22.308594 26.103516 L 13 37 L 15.5 37 L 23.4375 27.707031 L 29.976562 37 L 37.914062 37 L 27.789062 22.613281 L 36 13 L 33.5 13 L 26.660156 21.009766 L 21.023438 13 L 13.085938 13 z M 16.914062 15 L 19.978516 15 L 34.085938 35 L 31.021484 35 L 16.914062 15 z"></path>
                </svg>
            </button>
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