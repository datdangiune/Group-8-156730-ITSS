import React, { useEffect, useState } from "react";
import { Calendar, Home, Stethoscope, FileText } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import DashboardCard from "@/components/dashboard/DashboardCard";
import AppointmentList from "@/components/dashboard/AppointmentList";
import MetricsCard from "@/components/dashboard/MetricsCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchDashboardStats, DashboardStats } from "@/service/dashboard";
import StatusBadge from "@/components/dashboard/StatusBadge";

const Index = () => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const data = await fetchDashboardStats(token);
        setDashboardStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!dashboardStats) {
    return <div>Error loading dashboard data.</div>;
  }

  const { counts, lists } = dashboardStats;

  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-medium mb-6">Dashboard</h1>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricsCard
            title="Today's Appointments"
            value={counts.todayAppointments}
            icon={<Calendar className="h-5 w-5" />}
            variant="appointments"
          />
          <MetricsCard
            title="Today's Services"
            value={counts.todayServices}
            icon={<Stethoscope className="h-5 w-5" />}
            variant="services"
          />
          <MetricsCard
            title="Active Boarders"
            value={counts.activeBoarders}
            icon={<Home className="h-5 w-5" />}
            variant="boarding"
          />
          <MetricsCard
            title="Total Medical Records"
            value={counts.totalMedicalRecords}
            icon={<FileText className="h-5 w-5" />}
            variant="medical"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments and Services */}
          <div className="space-y-6">
            <DashboardCard
              title="Today's Appointments"
              description="Scheduled appointments for today"
            >
              <AppointmentList
                appointments={lists.todayAppointments.map((apt) => ({
                  id: apt.id,
                  appointment_type: apt.reason, // Assuming reason is the type
                  appointment_date: apt.appointment_date,
                  appointment_hour: apt.appointment_hour,
                  reason: apt.reason,
                  appointment_status: apt.appointment_status as "Done" | "Scheduled" | "Cancel" | "In Progress",
                  pet: {
                    id: apt.pet.id, // Ensure this field exists in the backend response
                    name: apt.pet.name,
                    breed: apt.pet.breed || "Unknown", // Default value if breed is missing
                    age: apt.pet.age || 0, // Default value if age is missing
                  },
                  owner: {
                    id: apt.owner.id, // Ensure this field exists in the backend response
                    username: apt.owner.username,
                    email: apt.owner.email || "Unknown", // Default value if email is missing
                  },
                }))}
              />
            </DashboardCard>

            <DashboardCard
              title="Today's Services"
              description="Services in progress today"
            >
              <div className="space-y-4">
                {lists.todayServices.length > 0 ? (
                  <>
                    {lists.todayServices.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-lg">{service.pet.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Breed: {service.pet.breed}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Service: <span className="font-medium">{service.service.name}</span> ({service.service.type})
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Price: <span className="font-medium">{service.service.price.toLocaleString()} VND</span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Duration: <span className="font-medium">{service.service.duration} minutes</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Date: <span className="font-medium">{new Date(service.date).toLocaleDateString()}</span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Hour: <span className="font-medium">{service.hour}</span>
                          </p>
                          <p className="text-sm mt-1">
                            Status: <StatusBadge status={service.status} />
                          </p>
                          <p className="text-sm mt-1">
                            Payment: <StatusBadge status={service.status_payment} />
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 text-center">
                      <Button variant="outline" onClick={() => navigate("/services")}>
                        View all services
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Stethoscope className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No active services today</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate("/services")}>
                      View all services
                    </Button>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>

          {/* Boarding and Medical Records */}
          <div className="space-y-6">
            <DashboardCard
              title="Active Boarders"
              description="Pets currently boarding"
            >
              <div className="space-y-4">
                {lists.activeBoarders.length > 0 ? (
                  <>
                    {lists.activeBoarders.map((boarding) => (
                      <div
                        key={boarding.id}
                        className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-lg">{boarding.pet.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {boarding.pet.type}, {boarding.pet.breed}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Service: <span className="font-medium">{boarding.boarding.name}</span> ({boarding.boarding.type})
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Total Price: <span className="font-medium">{boarding.total_price.toLocaleString()} VND</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Check out: <span className="font-medium">{new Date(boarding.end_date).toLocaleDateString()}</span>
                          </p>
                          <p className="text-sm mt-1">
                            Status: <StatusBadge status={boarding.status} />
                          </p>
                          <p className="text-sm mt-1">
                            Payment: <StatusBadge status={boarding.status_payment} />
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 text-center">
                      <Button variant="outline" onClick={() => navigate("/boarding")}>
                        View all boarders
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Home className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No pets currently boarding</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate("/boarding")}>
                      View all boarders
                    </Button>
                  </div>
                )}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Recent Medical Records"
              description="Latest patient updates"
            >
              <div className="space-y-4">
                {lists.recentMedicalRecords.length > 0 ? (
                  <>
                    {lists.recentMedicalRecords.map((record) => (
                      <div
                        key={record.id}
                        className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-lg">{record.appointment.pet.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Breed: {record.appointment.pet.breed}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Owner: <span className="font-medium">{record.appointment.owner.username}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 text-center">
                      <Button variant="outline" onClick={() => navigate("/medical-records")}>
                        View all medical records
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No medical records available</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate("/medical-records")}>
                      View all medical records
                    </Button>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
