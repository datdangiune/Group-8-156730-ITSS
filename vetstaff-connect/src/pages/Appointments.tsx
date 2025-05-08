import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Calendar, ChevronDown, Filter, Plus, Search } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import { appointments as appointmentsData } from "@/lib/data";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import ExaminationForm from "@/components/appointments/ExaminationForm";
import MultiStepAppointmentForm from "@/components/appointments/MultiStepAppointmentForm";
import { 
  Pagination, 
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationPageAction
} from "@/components/ui/pagination";
import { fetchTodayAppointments, fetchAllAppointments, fetchAppointmentById, updateAppointmentStatus, fetchVetAppointments } from "@/service/Appointments";

// Define the appointment type to avoid readonly issues
type AppointmentType = {
  id: string;
  petName: string;
  petType: string;
  petBreed?: string;
  ownerName: string;
  date: string;
  time: string;
  reason: string;
  status: "Done" | "In progess" | "Scheduled" | "Cancel";
  notes?: string;
};

const Appointments = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [view, setView] = useState("today");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [petTypeFilter, setPetTypeFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExaminationModalOpen, setIsExaminationModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setError("Authentication token is missing. Please log in.");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        let data: AppointmentType[] = [];
        if (view === "today") {
          const todayAppointments = await fetchTodayAppointments();
          data = todayAppointments.map((appointment) => ({
            id: appointment.id.toString(),
            petName: appointment.pet.name,
            petType: appointment.pet.breed || "Unknown",
            petBreed: appointment.pet.breed,
            ownerName: appointment.owner.username,
            date: appointment.appointment_date,
            time: appointment.appointment_hour,
            reason: appointment.reason,
            status: appointment.appointment_status as "Done" | "In progess" | "Scheduled" | "Cancel",
          }));
        } else if (view === "all") {
          const allAppointments = await fetchAllAppointments(token);
          data = allAppointments.map((appointment) => ({
            id: appointment.id.toString(),
            petName: appointment.pet.name,
            petType: appointment.pet.breed || "Unknown",
            petBreed: appointment.pet.breed,
            ownerName: appointment.owner.username,
            date: appointment.appointment_date,
            time: appointment.appointment_hour,
            reason: appointment.reason,
            status: appointment.appointment_status as "Done" | "In progess" | "Scheduled" | "Cancel",
          }));
        }
        setAppointments(data);
      } catch (err: any) {
        console.error("Error fetching appointments:", err.message);
        setError(err.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  // Use the fetched appointments directly
  const appointmentList = appointments;
  
  // Handle appointment creation
  const handleSaveAppointment = (newAppointment: AppointmentType) => {
    setAppointments((prevList) => [newAppointment, ...prevList]);
  };

  // Handle opening examination modal
  const handleUpdateExamination = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
    setIsExaminationModalOpen(true);
  };

  // Handle status update
  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token is missing. Please log in.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(`Attempting to update status: ID=${appointmentId}, Status=${newStatus}`); // Debugging log

      // Update the status in the database
      await updateAppointmentStatus(token, parseInt(appointmentId), newStatus);

      // Update the status in the frontend state
      setAppointments((prevList) =>
        prevList.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus as "Done" | "In progess" | "Scheduled" | "Cancel" }
            : appointment
        )
      );

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error("Error updating appointment status:", error.message);
      toast({
        title: "Error",
        description: "Failed to update appointment status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Get initials from pet name
  const getInitials = (name?: string) => {
    if (!name) return "?"; // Trả về dấu ? nếu name bị undefined hoặc null
    return name.charAt(0).toUpperCase();
  };
  
  
  // Generate avatar fallback background color based on pet name
  const getAvatarColor = (name?: string) => {
    if (!name) return "bg-gray-100 text-gray-600"; // Màu mặc định nếu name bị undefined/null
    
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-red-100 text-red-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  
  // Extract unique pet types from appointments
  const petTypes = Array.from(new Set(appointmentList.map(app => app.petType)));
  
  // Toggle pet type filter
  const togglePetTypeFilter = (petType: string) => {
    setPetTypeFilter(current => 
      current.includes(petType) 
        ? current.filter(type => type !== petType) 
        : [...current, petType]
    );
  };
  
  // Filter appointments based on date, status, pet type, and search query
  const filteredAppointments = appointmentList.filter((appointment) => {
    // Filter by date
    if (dateFilter !== "all" && appointment.date?.toLowerCase() !== dateFilter.toLowerCase()) {
      return false;
    }

    // Filter by status
    if (statusFilter !== "all" && appointment.status !== statusFilter) {
      return false;
    }

    // Filter by pet type
    if (petTypeFilter.length > 0 && !petTypeFilter.includes(appointment.petType)) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        appointment.petName?.toLowerCase().includes(query) || // Check if petName exists before calling toLowerCase
        appointment.ownerName?.toLowerCase().includes(query) || // Check if ownerName exists before calling toLowerCase
        appointment.reason?.toLowerCase().includes(query) || // Check if reason exists before calling toLowerCase
        appointment.petType?.toLowerCase().includes(query) || // Check if petType exists before calling toLowerCase
        (appointment.petBreed && appointment.petBreed.toLowerCase().includes(query)) // Check if petBreed exists before calling toLowerCase
      );
    }









    

    return true;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredAppointments.length / 10); // Using 10 items per page
  const [currentPage, setCurrentPage] = useState(1);
  
  // Paginate the appointments
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-medium mb-4 md:mb-0">Appointments</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="relative md:col-span-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progess">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                  <SelectItem value="Cancel">Cancel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Pet Type</span>
                    </div>
                    {petTypeFilter.length > 0 && (
                      <Badge variant="secondary" className="ml-2">{petTypeFilter.length}</Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-2">
                    <h4 className="font-medium mb-2">Filter by Pet Type</h4>
                    {petTypes.map((type, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`pet-type-${type}`} 
                          checked={petTypeFilter.includes(type)}
                          onCheckedChange={() => togglePetTypeFilter(type)}
                        />
                        <Label htmlFor={`pet-type-${type}`}>{type}</Label>
                      </div>
                    ))}
                    {petTypeFilter.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => setPetTypeFilter([])}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              <div className="mt-4 bg-card rounded-md">
                <div className="min-w-full overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Pet & Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Appointment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-gray-200">
                      {paginatedAppointments.length > 0 ? (
                        paginatedAppointments.map((appointment, index) => (
                          <tr key={index} className="hover:bg-muted/20 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarFallback className={getAvatarColor(appointment.petName)}>
                                    {getInitials(appointment.petName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{appointment.petName}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {appointment.ownerName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">{appointment.reason}</div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.petType}
                                {appointment.petBreed && `, ${appointment.petBreed}`}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">{appointment.date}</div>
                              <div className="text-sm text-muted-foreground">{appointment.time}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge 
                              status={
                                ["Done", "In progess", "Scheduled", "Cancel"].includes(appointment.status)
                                  ? appointment.status
                                  : undefined
                              } 
                            />

                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <Select
                                value={appointment.status}
                                onValueChange={(value) => handleStatusUpdate(appointment.id, value)}
                              >
                                <SelectTrigger className="h-8 w-24">
                                  <SelectValue placeholder="Update" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                                  <SelectItem value="In progess">In Progress</SelectItem>
                                  <SelectItem value="Done">Done</SelectItem>
                                  <SelectItem value="Cancel">Cancel</SelectItem>
                                </SelectContent>
                              </Select>
                            </td> */}

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex items-center justify-end space-x-2">
                                {/* Add Update Examination button */}
                                {appointment.status === "In progess" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateExamination(appointment)}
                                    className="text-primary border-primary hover:bg-primary/10"
                                  >
                                    Update Examination
                                  </Button>
                                )}
                                
                                <Select 
                                  defaultValue={appointment.status}
                                  onValueChange={(value) => handleStatusUpdate(appointment.id, value)}
                                >
                                  <SelectTrigger className="h-8 w-24">
                                    <SelectValue placeholder="Update" />
                                  </SelectTrigger>
                                  <SelectContent align="end">
                                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                                    <SelectItem value="In progess">In progess</SelectItem>
                                    <SelectItem value="Done">Done</SelectItem>
                                    <SelectItem value="Cancel">Cancel</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </td>

                            
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                              <h3 className="text-lg font-medium">No appointments found</h3>
                              <p className="text-muted-foreground mt-1">
                                Try adjusting your search or filters
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="px-6 py-4 flex items-center justify-between border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{paginatedAppointments.length}</span> of{" "}
                    <span className="font-medium">{filteredAppointments.length}</span> appointments
                  </div>
                  
                  {totalPages > 1 && (
                    <Pagination>
                      <PaginationPageAction
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        siblingsCount={1}
                      />
                    </Pagination>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="bg-card border rounded-md p-8 mt-4 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Calendar View Coming Soon</h3>
                <p className="text-muted-foreground mt-2">
                  We're working on a calendar view for appointments. Check back soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Use the multi-step appointment form */}
        <MultiStepAppointmentForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSaveAppointment} 
        />

                {/* Add the examination form modal */}
                {selectedAppointment && (
          <ExaminationForm
            open={isExaminationModalOpen}
            onClose={() => setIsExaminationModalOpen(false)}
            appointmentId={selectedAppointment.id}
            petName={selectedAppointment.petName}
            petType={selectedAppointment.petType}
            ownerName={selectedAppointment.ownerName}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default Appointments;
