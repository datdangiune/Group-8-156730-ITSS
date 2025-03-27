
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Heart, 
  Stethoscope, 
  FileText,
  Pencil,
  Trash2
} from "lucide-react";
import { appointments } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Separator } from "@/components/ui/separator";
import PageTransition from "@/components/animations/PageTransition";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const AppointmentDetail = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchAppointment = () => {
      setLoading(true);
      try {
        const found = appointments.find(apt => apt.id === appointmentId);
        if (found) {
          setAppointment(found);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setLoading(false);
      }
    };
    
    fetchAppointment();
  }, [appointmentId]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleEdit = () => {
    toast.info("Edit functionality would open the edit form");
    // This would open the edit appointment form in a real app
  };
  
  const handleDelete = () => {
    toast.success("Appointment deleted successfully");
    navigate("/appointments");
  };
  
  // Get initials from pet name
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "P";
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
    
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };
  
  if (loading) {
    return (
      <PageTransition>
        <div className="container px-4 py-6 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-medium">Loading Appointment...</h1>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-36 bg-muted rounded-lg"></div>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  if (!appointment) {
    return (
      <PageTransition>
        <div className="container px-4 py-6 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-medium">Appointment Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Appointment not found</h3>
                <p className="text-muted-foreground mt-2">
                  The appointment you're looking for doesn't exist or has been removed.
                </p>
                <Button className="mt-4" onClick={() => navigate("/appointments")}>
                  View All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-medium">Appointment Details</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the appointment
                    and remove the data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage src={appointment.avatar} alt={appointment.petName} />
                      <AvatarFallback className={getAvatarColor(appointment.petName)}>
                        {getInitials(appointment.petName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <CardTitle className="text-xl">{appointment.petName}</CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                        <div className="flex items-center text-muted-foreground">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>
                            {appointment.petType}
                            {appointment.petBreed && `, ${appointment.petBreed}`}
                          </span>
                        </div>
                        
                        <StatusBadge status={appointment.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Appointment Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col p-4 border rounded-lg">
                        <div className="flex items-center text-muted-foreground mb-2">
                          <Stethoscope className="h-4 w-4 mr-2" />
                          <span className="text-sm">Reason</span>
                        </div>
                        <span className="font-medium">{appointment.reason}</span>
                      </div>
                      
                      <div className="flex flex-col p-4 border rounded-lg">
                        <div className="flex items-center text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">Date</span>
                        </div>
                        <span className="font-medium">{appointment.date}</span>
                      </div>
                      
                      <div className="flex flex-col p-4 border rounded-lg">
                        <div className="flex items-center text-muted-foreground mb-2">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm">Time</span>
                        </div>
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Notes</h3>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm leading-relaxed">
                        {appointment.notes || "No notes provided for this appointment."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Owner Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {appointment.ownerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{appointment.ownerName}</div>
                    <div className="text-sm text-muted-foreground">Pet Owner</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">555-123-4567</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{appointment.ownerName.toLowerCase().replace(' ', '.')}@example.com</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium">123 Pet St, Anytown USA</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <User className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Previous Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Vaccination</div>
                      <div className="text-sm text-muted-foreground">2 weeks ago</div>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Wellness Check</div>
                      <div className="text-sm text-muted-foreground">3 months ago</div>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Medical History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AppointmentDetail;
