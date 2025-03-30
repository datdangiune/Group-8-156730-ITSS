import React from 'react';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import AreaChart from '@/components/AreaChart';
import BarChart from '@/components/BarChart';
import NotificationItem from '@/components/NotificationItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, PawPrint, Home, Calendar, FileText, Clock, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  // Mock data for statistics
  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 7000 },
    { name: 'Aug', value: 8000 },
    { name: 'Sep', value: 7500 },
    { name: 'Oct', value: 9000 },
    { name: 'Nov', value: 8500 },
    { name: 'Dec', value: 10000 },
  ];

  const serviceCategoryData = [
    { name: 'Mon', grooming: 30, boarding: 15, medical: 25 },
    { name: 'Tue', grooming: 20, boarding: 25, medical: 22 },
    { name: 'Wed', grooming: 15, boarding: 30, medical: 18 },
    { name: 'Thu', grooming: 25, boarding: 20, medical: 32 },
    { name: 'Fri', grooming: 35, boarding: 25, medical: 30 },
    { name: 'Sat', grooming: 40, boarding: 20, medical: 25 },
    { name: 'Sun', grooming: 20, boarding: 15, medical: 15 },
  ];

  const serviceCategories = [
    { key: 'grooming', name: 'Grooming', color: '#4990ff' },
    { key: 'boarding', name: 'Boarding', color: '#33af76' },
    { key: 'medical', name: 'Medical', color: '#f83a55' },
  ];

  // Recent notifications data
  const recentNotifications = [
    {
      id: 1,
      title: 'New appointment request',
      description: 'Max (Golden Retriever) - Vaccination',
      time: '2 minutes ago',
      icon: <Calendar className="h-5 w-5 text-vetblue-600" />,
      read: false,
    },
    {
      id: 2,
      title: 'Lab results ready',
      description: 'Luna (Siamese) - Blood work',
      time: '1 hour ago',
      icon: <FileText className="h-5 w-5 text-vetred-500" />,
      read: false,
    },
    {
      id: 3,
      title: 'Service completed',
      description: 'Charlie (Labrador) - Grooming',
      time: '3 hours ago',
      icon: <PawPrint className="h-5 w-5 text-vetgreen-500" />,
      read: true,
    },
    {
      id: 4,
      title: 'Boarding check-out',
      description: 'Bella (Persian) - 3 days stay',
      time: '5 hours ago',
      icon: <Home className="h-5 w-5 text-vetblue-500" />,
      read: true,
    },
  ];

  // Today's appointments
  const todayAppointments = [
    {
      id: 1,
      petName: 'Rex',
      petType: 'German Shepherd',
      service: 'Check-up',
      time: '9:00 AM',
      status: 'completed',
    },
    {
      id: 2,
      petName: 'Luna',
      petType: 'Siamese',
      service: 'Blood work',
      time: '10:30 AM',
      status: 'in-progress',
    },
    {
      id: 3,
      petName: 'Buddy',
      petType: 'Golden Retriever',
      service: 'Vaccination',
      time: '1:00 PM',
      status: 'scheduled',
    },
    {
      id: 4,
      petName: 'Whiskers',
      petType: 'Maine Coon',
      service: 'Dental cleaning',
      time: '3:30 PM',
      status: 'scheduled',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Admin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={248}
            icon={<Users className="h-5 w-5 text-vetblue-600" />}
            change={{ value: 12, timeframe: 'from last month', positive: true }}
          />
          <StatCard
            title="Active Boarders"
            value={7}
            icon={<Home className="h-5 w-5 text-vetgreen-600" />}
            change={{ value: 2, timeframe: 'from last month', positive: true }}
          />
          <StatCard
            title="Pending Services"
            value={5}
            icon={<PawPrint className="h-5 w-5 text-vetblue-600" />}
            change={{ value: 3, timeframe: 'from last month', positive: false }}
          />
          <StatCard
            title="Unread Notifications"
            value={4}
            icon={<Bell className="h-5 w-5 text-vetred-600" />}
            change={{ value: 50, timeframe: 'from last month', positive: true }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AreaChart
            title="Revenue Overview"
            data={revenueData}
            dataKey="value"
            description="Monthly revenue in USD for the current year"
          />
          <BarChart
            title="Services by Category"
            data={serviceCategoryData}
            dataKey="total"
            categories={serviceCategories}
            description="Weekly breakdown of services by category"
          />
        </div>

        {/* Schedule and Notifications */}
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
                <TabsContent value="all" className="m-0">
                  <div className="space-y-1">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="flex items-center">
                          <div className="mr-4 flex items-center justify-center">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              appointment.status === 'completed' && "bg-vetgreen-500",
                              appointment.status === 'in-progress' && "bg-vetblue-500",
                              appointment.status === 'scheduled' && "bg-muted-foreground"
                            )} />
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
                <TabsContent value="scheduled" className="m-0">
                  <div className="space-y-1">
                    {todayAppointments
                      .filter(a => a.status === 'scheduled')
                      .map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="flex items-center">
                          <div className="mr-4 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
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
                <TabsContent value="in-progress" className="m-0">
                  <div className="space-y-1">
                    {todayAppointments
                      .filter(a => a.status === 'in-progress')
                      .map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="flex items-center">
                          <div className="mr-4 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-vetblue-500" />
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
                <TabsContent value="completed" className="m-0">
                  <div className="space-y-1">
                    {todayAppointments
                      .filter(a => a.status === 'completed')
                      .map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="flex items-center">
                          <div className="mr-4 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-vetgreen-500" />
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
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="-m-4">
                {recentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    title={notification.title}
                    description={notification.description}
                    time={notification.time}
                    icon={notification.icon}
                    read={notification.read}
                  />
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
