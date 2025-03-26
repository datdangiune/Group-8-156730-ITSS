import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getReports } from '@/services/AdminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Reports: React.FC = () => {
    const [revenueReport, setRevenueReport] = useState(null);
    const [petRegistrationStats, setPetRegistrationStats] = useState(null);
    const [healthTrends, setHealthTrends] = useState(null);

    useEffect(() => {
        getReports('revenue').then(setRevenueReport).catch(console.error);
        getReports('pet-registration').then(setPetRegistrationStats).catch(console.error);
        getReports('health-trends').then(setHealthTrends).catch(console.error);
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg">{revenueReport ? `$${revenueReport.revenue}` : 'Loading...'}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pet Registration Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg">{petRegistrationStats ? petRegistrationStats.count : 'Loading...'}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Health Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {healthTrends ? (
                            <ul>
                                {healthTrends.map((trend: any, index: number) => (
                                    <li key={index}>{trend.medical_history}: {trend.count}</li>
                                ))}
                            </ul>
                        ) : (
                            'Loading...'
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Reports;
