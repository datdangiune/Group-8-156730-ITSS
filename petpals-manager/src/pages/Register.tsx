import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Signup } from '@/service/auth'; 
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const [error, setError] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = "https://50f8ddd6-2f59-45d5-840d-5ee1daf6afb0.us-east-1.cloud.genez.io/auth/google"; // Chuyển hướng đến Google OAuth
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    }
    try {
        const data = await Signup(username, email, password);
        console.log(data)
        navigate('/login');
        
        alert('Đăng ký thành công!');
      } catch (error) {
        
        setError(error instanceof Error ? error.message : 'Có lỗi xảy ra!');
      }
      
};
  useEffect(()=>{
    console.log(token);
    if(token){
      navigate("/");
    }
  },[token, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{
      backgroundImage: "url('/bgr.jpg')",
    }}>
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4"> 
          {/* Username */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="flex items-center space-x-2">
            <input
              type="email"
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

          {/* Confirm Password */}
          <div className="flex items-center space-x-2">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            Create Account
          </button>
          <div className="my-4 flex items-center gap-4">
            <hr className="w-full border-slate-300" />
            <p className="text-sm text-slate-800 text-center">or</p>
            <hr className="w-full border-slate-300" />
          </div>
          <div className="space-x-6 flex justify-center">
          <button type="button" onClick={handleGoogleLogin}
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
          </div>
        </form>

        {/* Link quay lại trang đăng nhập */}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Already have an account? Login here.
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;