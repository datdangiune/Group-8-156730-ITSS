import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getDashboardMetrics } from '@/services/AdminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTokenFromCookies } from '@/services/AdminAuthService';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState({
        pets: 0,
        appointments: 0,
        ongoingServices: 0,
        users: 0,
        services: 0,
    });
    const [loading, setLoading] = useState(true);
    const token = getTokenFromCookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    useEffect(() => {
        fetchDashboardMetrics();
    }, []);

    const fetchDashboardMetrics = async () => {
        try {
            const data = await getDashboardMetrics();
            setMetrics(data.data); // Ensure the correct property is used
            setLoading(false);
        } catch (err) {
            console.error('Error fetching dashboard metrics:', err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Pets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{metrics.pets}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{metrics.appointments}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Ongoing Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{metrics.ongoingServices}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{metrics.users}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{metrics.services}</p>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;
