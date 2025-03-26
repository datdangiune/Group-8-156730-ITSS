import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '@/services/AdminAuthService';
import { getTokenFromCookies } from '@/services/AdminAuthService';
const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = getTokenFromCookies();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Sending login request:', { username, password }); // Debugging log
            await adminLogin(username, password);
            console.log('Login successful, redirecting to dashboard'); // Debugging log
            navigate('/dashboard'); // Redirect to the admin dashboard
        } catch (err: any) {
            console.error('Login failed:', err.message); // Debugging log
            setError(err.message || 'Login failed');
        }
    };
    useEffect(() => {

        if (token) {
            navigate('/dashboard');
        }
    }, [token])
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;