import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { AppointmentStatus } from '@/components/ui/appointment-card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fetchAppointmentResultById, FetchAppointmentResponse, deleteScheduledAppointment } from '@/service/appointment';
// Mock function to get appointment data
import { getTokenFromCookies } from '@/service/auth';
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

const AppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id); 
  const navigate = useNavigate();
  const [appointment, setAppointmentResult] = useState<FetchAppointmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const token = getTokenFromCookies();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const appointmentData = await fetchAppointmentResultById(token, numericId);
          setAppointmentResult(appointmentData);
        }
      } catch (error) {
        console.error('Error fetching appointment details:', error);
        toast.error('Failed to load appointment details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleCancel = async () => {
    try {
        if (id) {
            await deleteScheduledAppointment(token, numericId);
            toast.success('Appointment cancelled successfully!');
            navigate('/appointments');
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Failed to cancel appointment. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 animate-fade-in">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading appointment details...</div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container mx-auto px-4 animate-fade-in">
        <div className="h-96 flex flex-col items-center justify-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Appointment not found. The appointment you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/appointments">Return to Appointments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusDisplay = (status: AppointmentStatus) => {
    switch (status) {
      case 'Scheduled':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          text: 'Scheduled'
        };
      case 'Done':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          text: 'Completed'
        };
      case 'Cancel':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          text: 'Cancelled'
        };
      case 'In Progress':
        return {
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          text: 'In Progress'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
          text: status
        };
    }
  };

  const statusDisplay = getStatusDisplay(appointment.data.appointment_status);

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate("/appointments")}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Appointments
        </Button>
        <h1 className="text-3xl font-bold">Appointment Details</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{appointment.data.appointment_type}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  For {appointment.data.pet.name}
                </CardDescription>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                {statusDisplay.text}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card dark:glass-card-dark rounded-lg p-4">
                <div className="flex items-center text-primary mb-2">
                  <Calendar className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Date</h3>
                </div>
                <p>{appointment.data.appointment_date}</p>
              </div>
              
              <div className="glass-card dark:glass-card-dark rounded-lg p-4">
                <div className="flex items-center text-primary mb-2">
                  <Clock className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Time</h3>
                </div>
                <p>{appointment.data.appointment_hour}</p>
              </div>
              <div className="glass-card dark:glass-card-dark rounded-lg p-4">
                <div className="flex items-center text-primary mb-2">
                  <UserIcon className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Owner Name</h3>
                </div>
                <p>{appointment.data.owner?.name}</p>
              </div>

            </div>
            <div>
              <div className="flex items-center text-primary mb-2">
                <FileText className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Reason for Visit</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {appointment.data.reason}
              </p>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Medical Reports</h3>
              
              {appointment.data.result != null ? (
                <div className="grid grid-cols-1 gap-4">
                    <Card key={appointment.data.result.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Diagnosis</h4>
                            <p className="text-lg font-medium mt-1">{appointment.data.result.diagnosis}</p>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prescription</h4>
                            <ul className="mt-1 list-disc list-inside space-y-1 text-sm">
                              {appointment.data.result.prescription
                                .split(';')
                                .map((item, index) => (
                                  <li key={index}>{item.trim()}</li>
                                ))}
                            </ul>
                          </div>

                          
                          <Separator />
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Follow-up Date</h4>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-2 text-primary" />
                              <p>{formatDate(appointment.data.result.follow_up_date)}</p>
                            </div>
                          </div>
                          
                          <Badge variant="outline" className="mt-2">
                            Medical Report
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed rounded-lg">
                  <p className="text-gray-500">
                    {appointment.data.appointment_status === 'Cancel' 
                      ? 'This appointment was cancelled.'
                      : appointment.data.appointment_status === 'Done'
                        ? 'No medical reports available for this appointment.'
                        : 'Medical reports will be available after the appointment is completed.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            {appointment.data.appointment_status === 'Scheduled' && (
              <>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  asChild
                >
                  <Link to={`/appointments/reschedule/${appointment.data.id}`}>
                    <Edit className="h-4 w-4" />
                    Reschedule
                  </Link>
                </Button>
                
                <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <X className="h-4 w-4" />
                      Cancel Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel this appointment?</DialogTitle>
                      <DialogDescription>
                        This will cancel your appointment scheduled for {appointment.data.appointment_date} at {appointment.data.appointment_hour}.
                        You can always book a new appointment later.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Keep Appointment</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={handleCancel}>
                        Cancel Appointment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            
            {appointment.data.appointment_status === 'Done' && (
              <Button asChild className="gap-2">
                <Link to={`/appointments/book?petId=${appointment.data.pet.id}`}>
                  <Calendar className="h-4 w-4" />
                  Book Follow-up
                </Link>
              </Button>
            )}
            
            {appointment.data.appointment_status === 'Cancel' && (
              <Button asChild className="gap-2">
                <Link to={`/appointments/book?petId=${appointment.data.pet.id}`}>
                  <Calendar className="h-4 w-4" />
                  Book New Appointment
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentDetail;