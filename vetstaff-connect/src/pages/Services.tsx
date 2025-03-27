
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Edit, Plus, Search, Stethoscope } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { services } from "@/lib/data";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import ServiceForm from "@/components/services/ServiceForm";
import EditServiceForm from "@/components/services/EditServiceForm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination";

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Filter services based on search query and active tab
  const filteredServices = services.filter(service => {
    // Filter by tab
    if (activeTab !== "all" && service.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        service.petName.toLowerCase().includes(query) ||
        service.serviceType.toLowerCase().includes(query) ||
        service.notes.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Calculate service progress
  const getServiceProgress = (status: string): number => {
    switch (status) {
      case "completed":
        return 100;
      case "in-progress":
        return 50;
      case "upcoming":
        return 0;
      default:
        return 0;
    }
  };
  
  // Get progress color based on status
  const getProgressColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "in-progress":
        return "bg-info";
      case "upcoming":
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  const handleCreateService = (data: any) => {
    // In a real app, you would save this data to your backend
    console.log("New service:", data);
    toast.success("Service created successfully!");
    setIsFormOpen(false);
  };
  
  const handleEditService = (service: any) => {
    setSelectedService(service);
    setIsEditFormOpen(true);
  };
  
  const handleSaveEditedService = (data: any) => {
    // In a real app, you would update this data to your backend
    console.log("Edited service:", data);
    toast.success("Service updated successfully!");
    setIsEditFormOpen(false);
    setSelectedService(null);
  };

  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-medium mb-4 md:mb-0">Services</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Service
            </Button>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {paginatedServices.length > 0 ? (
            <>
              <div className="min-w-full overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Pet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Service Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-gray-200">
                    {paginatedServices.map((service) => (
                      <tr key={service.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium">{service.petName}</div>
                              <div className="text-sm text-muted-foreground">
                                {service.petType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{service.serviceType}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {service.notes}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{service.startTime}</div>
                          <div className="text-sm text-muted-foreground">
                            Est. end: {service.estimatedEndTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={service.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Progress 
                            value={getServiceProgress(service.status)} 
                            className={`h-2 w-full max-w-[200px] ${getProgressColor(service.status)}`}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditService(service)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Service
                              </DropdownMenuItem>
                              <DropdownMenuItem>Send Notification</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 flex items-center justify-between border-t mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{paginatedServices.length}</span> of{" "}
                  <span className="font-medium">{filteredServices.length}</span> services
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        aria-disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No services found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search criteria or adding a new service
              </p>
            </div>
          )}
        </div>

        <ServiceForm 
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateService}
        />
        
        <EditServiceForm
          open={isEditFormOpen}
          onClose={() => {
            setIsEditFormOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
          onSubmit={handleSaveEditedService}
        />
      </div>
    </PageTransition>
  );
};

export default Services;
