import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import AreaChart from '@/components/AreaChart';
import BarChart from '@/components/BarChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, PawPrint, Calendar, Activity, Layers, BarChart as BarChartIcon, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchDashboardTotalCounts, DashboardTotalCounts, fetchAnalyticsData, RevenueDataItem, ServiceDataItem } from '@/service/dashboard';

const Dashboard = () => {
  const [counts, setCounts] = useState<DashboardTotalCounts | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataItem[]>([]);
  const [serviceData, setServiceData] = useState<ServiceDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await fetchDashboardTotalCounts();
        setCounts(data);
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await fetchAnalyticsData();
        setRevenueData(analytics.revenueData);
        setServiceData(analytics.serviceData);
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Admin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Users"
            value={counts ? counts.totalUsers : 0}
            icon={<Users className="h-5 w-5 text-vetblue-600" />}
          />
          <StatCard
            title="Total Appointments"
            value={counts ? counts.totalAppointments : 0}
            icon={<Calendar className="h-5 w-5 text-vetgreen-600" />}
          />
          <StatCard
            title="Total Pets"
            value={counts ? counts.totalPets : 0}
            icon={<PawPrint className="h-5 w-5 text-vetred-600" />}
          />
          <StatCard
            title="Total Services"
            value={counts ? counts.totalServices : 0}
            icon={<Activity className="h-5 w-5 text-vetblue-600" />}
          />
          <StatCard
            title="Total Boardings"
            value={counts ? counts.totalBoardings : 0}
            icon={<Layers className="h-5 w-5 text-vetgreen-600" />}
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AreaChart 
                title="Revenue Overview" 
                data={revenueData} 
                dataKey="value" 
                height={280}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Breakdown</CardTitle>
              <CardDescription>Distribution of services provided</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart 
                title="Services Breakdown" 
                data={serviceData} 
                dataKey="value" 
                height={280}
              />
            </CardContent>
          </Card>
        </div>

        {/* KPIs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>Overview of important metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <BarChartIcon className="h-5 w-5 text-vetblue-600 mr-2" />
                  <h3 className="font-medium">New Patients</h3>
                </div>
                <p className="text-2xl font-bold">+24%</p>
                <p className="text-sm text-muted-foreground">Compared to last month</p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <PieChart className="h-5 w-5 text-vetblue-600 mr-2" />
                  <h3 className="font-medium">Revenue Growth</h3>
                </div>
                <p className="text-2xl font-bold">+12.5%</p>
                <p className="text-sm text-muted-foreground">Compared to last month</p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <BarChartIcon className="h-5 w-5 text-vetblue-600 mr-2" />
                  <h3 className="font-medium">Avg. Visit Value</h3>
                </div>
                <p className="text-2xl font-bold">$175</p>
                <p className="text-sm text-muted-foreground">+5% from previous month</p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <PieChart className="h-5 w-5 text-vetblue-600 mr-2" />
                  <h3 className="font-medium">Bookings</h3>
                </div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground">Capacity utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
