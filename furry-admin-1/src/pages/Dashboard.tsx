import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import AreaChart from '@/components/AreaChart';
import BarChart from '@/components/BarChart';
import NotificationItem from '@/components/NotificationItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, PawPrint, Home, Calendar, FileText, Clock, Bell, Activity, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchDashboardTotalCounts, DashboardTotalCounts } from '@/service/dashboard';

const Dashboard = () => {
  const [counts, setCounts] = useState<DashboardTotalCounts | null>(null);

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
      </div>
    </Layout>
  );
};

export default Dashboard;
