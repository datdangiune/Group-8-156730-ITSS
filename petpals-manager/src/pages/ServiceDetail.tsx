import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Calendar, 
  ClipboardList,
  Scissors, 
  BedDouble, 
  Sparkles,
  Award,
  Activity
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
import { Service, ServiceType, ServiceStatus, GetServicesResponse } from '@/types/service';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BookingForm from '@/components/service/BookingForm';
import { fetchServicesById} from '@/service/service';
import { getTokenFromCookies } from '@/service/auth';
const getServiceIcon = (type: ServiceType) => {
  switch (type) {
    case 'grooming':
      return <Scissors className="h-6 w-6" />;
    case 'boarding':
      return <BedDouble className="h-6 w-6" />;

    case 'training':
      return <Award className="h-6 w-6" />;

    default:
      return <Sparkles className="h-6 w-6" />;
  }
};

const ServiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const token = getTokenFromCookies();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const serviceData: GetServicesResponse= await fetchServicesById(id, token);
          setService(serviceData.services[0]);
          console.log(serviceData)
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
        toast.error('Failed to load service details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 animate-fade-in">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading service details...</div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 animate-fade-in">
        <div className="h-96 flex flex-col items-center justify-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Service not found. The service you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/services">Return to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusDisplay = (status: ServiceStatus) => {
    switch (status) {
      case 'available':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          text: 'Available'
        };
      case 'unavailable':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          text: 'Unavailable'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
          text: status
        };
    }
  };

  const statusDisplay = getStatusDisplay(service.status);

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate("/services")}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Services
        </Button>
        <h1 className="text-3xl font-bold">Service Details</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                  {getServiceIcon(service.type)}
                </div>
                <div>
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1 capitalize">
                    {service.type} Service
                  </CardDescription>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                {statusDisplay.text}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card dark:glass-card-dark rounded-lg p-4">
                <div className="flex items-center text-primary mb-2">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Price</h3>
                </div>
                <p className="text-2xl font-semibold">{service.price.toLocaleString('vi-VN')} VNĐ</p>
                <p className="text-sm text-gray-500">{service.type === 'boarding' ? 'per night' : 'per session'}</p>
              </div>
              
              <div className="glass-card dark:glass-card-dark rounded-lg p-4">
                <div className="flex items-center text-primary mb-2">
                  <Clock className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Duration</h3>
                </div>
                <p className="text-2xl font-semibold">{service.duration} minutes</p>
                <p className="text-sm text-gray-500">Estimated time</p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-primary mb-2">
                <ClipboardList className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Description</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {service.description}
              </p>
            </div>
            
            {service.type === 'grooming' && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">What's Included</h3>
                <ul className="space-y-2">
                {service.details.included.map((item: string, index: number) => (
                    <li key={index} className="flex items-center">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-1 rounded-full mr-2">
                        <Sparkles className="h-3 w-3" />
                    </span>
                    {item}
                    </li>
                ))}
                </ul>

              </div>
            )}
            
            {service.type === 'boarding' && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">What's Included</h3>
                <ul className="space-y-2">
                {service?.details?.included?.map((item: string, index: number) => (
                    <li key={index} className="flex items-center">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-1 rounded-full mr-2">
                        <Sparkles className="h-3 w-3" />
                    </span>
                    {item}
                    </li>
                ))}
                </ul>

              </div>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Special Requirements</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {service.type === 'grooming' 
                  ? 'Please ensure your pet is up to date on vaccinations. We recommend not feeding your pet 2 hours before grooming.'
                  : service.type === 'boarding'
                  ? 'Please bring your pet\'s food, medications, and a familiar toy or blanket to help them feel comfortable during their stay.'
                  : 'Please let us know if your pet has any special needs or requirements before booking this service.'}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex-col md:flex-row gap-4">
            {service.status === 'available' && (
              <>
                <Button 
                  className="w-full md:w-auto"
                  onClick={() => setBookingDialogOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto" 
                  onClick={() => {
                    // In a real app, this might open a contact form or start a chat
                    toast.info('Our team will reach out to you soon!');
                  }}
                >
                  Request More Information
                </Button>
              </>
            )}
            
            {service.status === 'unavailable' && (
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => {
                  toast.info('You will be notified when this service becomes available again.');
                }}
              >
                Notify Me When Available
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book {service.name}</DialogTitle>
            <DialogDescription>
              Schedule an appointment for your pet.
            </DialogDescription>
          </DialogHeader>
          <BookingForm 
            service={service}
            onSuccess={() => setBookingDialogOpen(false)}  
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDetail;