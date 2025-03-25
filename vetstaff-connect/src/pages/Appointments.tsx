
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, ChevronDown, Search } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import { appointments } from "@/lib/data";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Appointments = () => {
  const [view, setView] = useState("today");
  const [dateFilter, setDateFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get initials from pet name
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
  
  // Generate avatar fallback background color based on pet name
  const getAvatarColor = (name: string) => {
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
  
  // Filter appointments based on date, status, and search query
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by date
    if (dateFilter !== "all" && appointment.date.toLowerCase() !== dateFilter) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== "all" && appointment.status !== statusFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        appointment.petName.toLowerCase().includes(query) ||
        appointment.ownerName.toLowerCase().includes(query) ||
        appointment.reason.toLowerCase().includes(query) ||
        appointment.petType.toLowerCase().includes(query) ||
        (appointment.petBreed && appointment.petBreed.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-medium mb-4 md:mb-0">Appointments</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
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
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                          <tr key={appointment.id} className="hover:bg-muted/20 transition-colors">
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
                              <StatusBadge status={appointment.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
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
                    Showing <span className="font-medium">{filteredAppointments.length}</span> of{" "}
                    <span className="font-medium">{appointments.length}</span> appointments
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" disabled>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
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
      </div>
    </PageTransition>
  );
};

export default Appointments;
