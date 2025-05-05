import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { PageTransition } from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/dashboard/StatusBadge";
import EditServiceForm from "@/components/services/EditServiceForm";
import { toast } from "sonner";
import { fetchUserServices, Service } from "@/service/services";

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token") || ""; // Replace with your token retrieval logic
        const data = await fetchUserServices(token);
        setServices(data);
      } catch (error) {
        console.error("Error fetching user services:", error);
        toast.error("Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search query and filters
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.pet?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || service.status.toLowerCase() === statusFilter;

    const matchesType =
      typeFilter === "all" || service.type.toLowerCase() === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddService = () => {
    setSelectedService(null);
    setIsDrawerOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsDrawerOpen(true);
  };

  const handleSubmitService = (data: any) => {
    console.log("Service submitted:", data);
    setIsDrawerOpen(false);
  };

  const handleCompleteService = (serviceId: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? { ...service, status: "completed" }
          : service
      )
    );
    toast.success("Service marked as completed");
  };

  const handleCancelService = (serviceId: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? { ...service, status: "cancelled" }
          : service
      )
    );
    toast.success("Service has been cancelled");
  };

  const handleManageServices = () => {
    navigate("/clinic-services");
  };
  if (loading) {
    return <div>Loading services...</div>;
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Stethoscope className="mr-2 h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">Service Management</h1>
          </div>
          <div className="flex space-x-3">
      <Button variant="outline" onClick={handleManageServices}>
        <Stethoscope className="mr-2 h-4 w-4" />
        Manage Services
      </Button>
    </div>
        </div>

        {/* Filters and search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in progess">In Progress</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="grooming">Grooming</SelectItem>
                <SelectItem value="boarding">Boarding</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Services table */}
        <div className="bg-card rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No services found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service, i) => (
                    <tr
                      key={service.id || i}
                      className="hover:bg-muted/50"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p>{service.pet?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.pet?.breed}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p>{service.date}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.hour}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={service.status as any} />
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {service.price}
                      </td>
                      <td className = "px-4 py-4">
                        {service.status === "In Progess" ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        )}
                         </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {service.status !== "cancelled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleCancelService(service.id)
                              }
                              className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                              Cancel
                            </Button>
                          )}

                          {service.status === "scheduled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleCompleteService(service.id)
                              }
                              className="text-success border-success hover:bg-success/10"
                            >
                              Complete
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditService(service)}
                          >
                            Update
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Service form drawer */}
      <EditServiceForm
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        service={selectedService}
        onSubmit={handleSubmitService}
      />
    </PageTransition>
  );
};

export default Services;
