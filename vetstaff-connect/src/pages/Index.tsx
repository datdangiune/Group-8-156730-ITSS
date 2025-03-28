import React, { useEffect, useState } from "react";
import { Calendar, Heart, Home, Stethoscope, Clock, Calendar as CalendarIcon, Bell } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AppointmentList from "@/components/dashboard/AppointmentList";
import MetricsCard from "@/components/dashboard/MetricsCard";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import { fetchDashboardStats, fetchAppointments, fetchNotifications, fetchServices, fetchBoardingPets } from "@/service/dashboard";

const Index = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [statsRes, setStatsRes] = useState<any>({});
  const [services, setServices] = useState<any[]>([]);
  const [boardingPets, setBoardingPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setError("Authentication token is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Query backend using service functions
        const [stats, appointmentsData, notificationsData, servicesData, boardingData] = await Promise.all([
          fetchDashboardStats(token), // Fetch dashboard stats
          fetchAppointments(token), // Fetch appointments
          // fetchNotifications(token), // Fetch notifications
          // fetchServices(token), // Fetch services
          // fetchBoardingPets(token), // Fetch boarding pets
        ]);

        // Update state with fetched data
        setStatsRes(stats || {});
        setAppointments(appointmentsData || []);
        // setNotifications(notificationsData || []);
        // setServices(servicesData || []);
        // setBoardingPets(boardingData || []);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err.message);
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const unreadNotifications = notifications?.filter((notif: any) => !notif.read) || [];
  const activeServices = services?.filter((svc: any) => svc.status === "in-progress") || [];

  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <h1 className="text-2xl font-medium mb-6">Dashboard</h1>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricsCard
                title="Today's Appointments"
                value={statsRes?.counttodayAppointments || 0}
                icon={<Calendar className="h-5 w-5" />}
              />
              <MetricsCard
                title="Active Boarders"
                value={statsRes?.activeBoarders || 0}
                icon={<Home className="h-5 w-5" />}
              />
              <MetricsCard
                title="Pending Services"
                value={statsRes?.pendingServices || 0}
                icon={<Stethoscope className="h-5 w-5" />}
              />
              <MetricsCard
                title="Unread Notifications"
                value={unreadNotifications.length}
                icon={<Bell className="h-5 w-5" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content - upcoming appointments */}
              <div className="lg:col-span-2 space-y-6">
                <DashboardCard
                  title="Today's Appointments"
                  description="Scheduled appointments for today"
                  className="h-full"
                  contentClassName="h-[400px] overflow-auto"
                >
                  <AppointmentList appointments={appointments} />
                </DashboardCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DashboardCard title="Active Services" description="Currently in progress">
                    {activeServices.length > 0 ? (
                      <div className="divide-y">
                        {activeServices.map((service: any) => (
                          <div key={service.id} className="p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{service.petName}</p>
                              <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                                <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
                                {service.serviceType}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">Started</div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                {service.startTime}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <Stethoscope className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No active services</p>
                      </div>
                    )}
                  </DashboardCard>

                  <DashboardCard title="Boarding Status" description="Current boarders">
                    {boardingPets.length > 0 ? (
                      <div className="divide-y">
                        {boardingPets.slice(0, 3).map((pet: any) => (
                          <div key={pet.id} className="p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{pet.petName}</p>
                              <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                                <Heart className="h-3.5 w-3.5 mr-1.5" />
                                {pet.petType}, {pet.petBreed}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">Check out</div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                                {pet.checkOutDate}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <Home className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No pets boarding</p>
                      </div>
                    )}
                  </DashboardCard>
                </div>
              </div>

              {/* Sidebar - notifications */}
              <div>
                <DashboardCard
                  title="Recent Notifications"
                  description="Updates and alerts"
                  className="h-full"
                  contentClassName="h-[600px] overflow-auto"
                >
                  <NotificationPanel notifications={notifications.slice(0, 6)} />
                </DashboardCard>
              </div>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default Index;
