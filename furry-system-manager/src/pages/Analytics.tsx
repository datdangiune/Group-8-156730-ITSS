import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getAnalyticsData } from '@/services/AdminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { getTokenFromCookies } from '@/services/AdminAuthService';
import { useNavigate } from 'react-router-dom';

const Analytics: React.FC = () => {
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalPets: 0,
        totalAppointments: 0,
        totalRevenue: 0,
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
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const data = await getAnalyticsData();
            setAnalytics(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching analytics data:', err.message);
            toast({
                title: 'Error',
                description: err.message || 'Failed to fetch analytics data.',
                variant: 'destructive',
            });
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{analytics.totalUsers}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Pets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{analytics.totalPets}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{analytics.totalAppointments}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">${analytics.totalRevenue}</p>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Analytics;
