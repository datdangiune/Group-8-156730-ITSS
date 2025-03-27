import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRegister } from '@/services/AdminAuthService';
import { getTokenFromCookies } from '@/services/AdminAuthService';
import { emit } from 'process';
const AdminRegister: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const token = getTokenFromCookies()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminRegister(username, password, email, password);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000); // Redirect to login page
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        }
    };
    useEffect(()=>{
        if(token){
            navigate('/dashboard')
        }
    }, [token])
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Registration</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;
