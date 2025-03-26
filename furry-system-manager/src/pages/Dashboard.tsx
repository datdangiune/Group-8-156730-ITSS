import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getDashboardMetrics } from '@/services/AdminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState({
        pets: 0,
        revenue: 0,
        appointments: 0,
        ongoingServices: 0,
    });

    useEffect(() => {
        getDashboardMetrics()
            .then((data) => setMetrics(data))
            .catch((err) => console.error('Error fetching dashboard metrics:', err));
    }, []);

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">${metrics.revenue}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Appointments</CardTitle>
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
            </div>
        </Layout>
    );
};

export default Dashboard;
