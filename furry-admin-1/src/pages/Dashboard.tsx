import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import AreaChart from '@/components/AreaChart';
import BarChart from '@/components/BarChart';
import NotificationItem from '@/components/NotificationItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, PawPrint, Home, Calendar, FileText, Clock, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';

import {
  fetchDashboardStats,
  fetchMonthlyRevenue,
  fetchServiceStatsByCategory,
  fetchTodaySchedule,
  fetchRecentNotifications
} from '@/service/dashboard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBoarders: 0,
    pendingServices: 0,
    unreadNotifications: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [serviceCategoryData, setServiceCategoryData] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);

  const serviceCategories = [
    { key: 'grooming', name: 'Grooming', color: '#4990ff' },
    { key: 'boarding', name: 'Boarding', color: '#33af76' },
    { key: 'medical', name: 'Medical', color: '#f83a55' },
  ];

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    const fetchAll = async () => {
      try {
        const [
          statsRes,
          revenueRes,
          serviceRes,
          scheduleRes,
          notificationsRes
        ] = await Promise.all([
          fetchDashboardStats(token),
          fetchMonthlyRevenue(token),
          fetchServiceStatsByCategory(token),
          fetchTodaySchedule(token),
          fetchRecentNotifications(token)
        ]);

        setStats(statsRes);

        setRevenueData(revenueRes.map(r => ({
          name: `Month ${r.month}`,
          value: r.total
        })));

        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const categoryKeys = ['grooming', 'boarding', 'medical'];

        const weeklyStats = weekdays.map(day => {
          const entry: any = { name: day };
          categoryKeys.forEach(cat => {
            const found = serviceRes.find(s => s.day === day && s.type.toLowerCase() === cat);
            entry[cat] = found?.count || 0;
          });
          return entry;
        });

        setServiceCategoryData(weeklyStats);

        setTodayAppointments(scheduleRes.appointments.map(a => ({
          id: a.id,
          petName: a.pet.name,
          petType: a.pet.type,
          service: a.appointment_type,
          time: a.appointment_hour,
          status: a.appointment_status.toLowerCase()
        })));

        setRecentNotifications(notificationsRes.map(n => ({
          id: n.id,
          title: n.title || 'Notification',
          description: n.message,
          time: new Date(n.created_at).toLocaleTimeString(),
          icon: <Bell className="h-5 w-5 text-vetblue-600" />,
          read: n.is_read ?? false
        })));
      } catch (err) {
        console.error("❌ Failed to load dashboard:", err);
      }
    };

    fetchAll();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Admin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} icon={<Users className="h-5 w-5 text-vetblue-600" />} change={{ value: 12, timeframe: 'from last month', positive: true }} />
          <StatCard title="Active Boarders" value={stats.activeBoarders} icon={<Home className="h-5 w-5 text-vetgreen-600" />} change={{ value: 2, timeframe: 'from last month', positive: true }} />
          <StatCard title="Pending Services" value={stats.pendingServices} icon={<PawPrint className="h-5 w-5 text-vetblue-600" />} change={{ value: 3, timeframe: 'from last month', positive: false }} />
          <StatCard title="Unread Notifications" value={stats.unreadNotifications} icon={<Bell className="h-5 w-5 text-vetred-600" />} change={{ value: 50, timeframe: 'from last month', positive: true }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AreaChart title="Revenue Overview" data={revenueData} dataKey="value" description="Monthly revenue in USD for the current year" />
          <BarChart title="Services by Category" data={serviceCategoryData} dataKey="total" categories={serviceCategories} description="Weekly breakdown of services by category" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Appointments and services for today</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                {['all', 'scheduled', 'in-progress', 'completed'].map(status => (
                  <TabsContent key={status} value={status} className="m-0">
                    <div className="space-y-1">
                      {todayAppointments
                        .filter(a => status === 'all' || a.status === status)
                        .map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                            <div className="flex items-center">
                              <div className="mr-4 flex items-center justify-center">
                                <div className={cn("w-2 h-2 rounded-full", appointment.status === 'completed' && "bg-vetgreen-500", appointment.status === 'in-progress' && "bg-vetblue-500", appointment.status === 'scheduled' && "bg-muted-foreground")} />
                              </div>
                              <div>
                                <p className="font-medium">{appointment.petName} ({appointment.petType})</p>
                                <p className="text-sm text-muted-foreground">{appointment.service}</p>
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="-m-4">
                {recentNotifications.map((notification) => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
