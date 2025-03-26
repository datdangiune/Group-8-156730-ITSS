import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";


 type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';
 type PetGender = 'male' | 'female';
 type HealthStatus = 'healthy' | 'under-treatment' | 'requires-attention';

interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed?: string;
  age?: number;
  gender: PetGender;
  weight?: number;
  color?: string;
  image?: string;
  healthStatus?: HealthStatus;
  dietPlan?: string;
  medicalHistory?: string;
  vaccinationHistory?: string;
  lastCheckup?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}
// Mock function to get pet list
const getPets = async (): Promise<Pet[]> => {
  // Simulate API fetch
  const mockPets = [
    {
      id: '1',
      name: 'Buddy',
      type: 'dog' as PetType,
      breed: 'Golden Retriever',
      age: 3,
      gender: 'male' as PetGender,
      weight: 32,
      color: 'Golden',
      healthStatus: 'healthy' as HealthStatus,
    },
    {
      id: '2',
      name: 'Whiskers',
      type: 'cat' as PetType,
      breed: 'Maine Coon',
      age: 2,
      gender: 'female' as PetGender,
      weight: 5,
      color: 'Gray Tabby',
      healthStatus: 'healthy' as HealthStatus,
    },
    {
      id: '3',
      name: 'Tweety',
      type: 'bird' as PetType,
      breed: 'Canary',
      age: 1,
      gender: 'male' as PetGender,
      weight: 0.2,
      color: 'Yellow',
      healthStatus: 'healthy' as HealthStatus,
    },
  ];
  
  return mockPets;
};

// Mock appointment types
const appointmentTypes = [
  { id: 'checkup', name: 'Regular Checkup' },
  { id: 'vaccination', name: 'Vaccination' },
  { id: 'illness', name: 'Illness/Injury' },
  { id: 'dental', name: 'Dental Cleaning' },
  { id: 'surgery', name: 'Surgery Consultation' },
  { id: 'followup', name: 'Follow-up Visit' },
];

// Mock locations
const locations = [
  { id: 'main', name: 'Main Pet Clinic', address: '123 Pet St, Petville' },
  { id: 'north', name: 'North Branch', address: '456 Animal Ave, Northtown' },
  { id: 'south', name: 'South Branch', address: '789 Furry Rd, Southville' },
];

// Form schema with Zod
const appointmentFormSchema = z.object({
  petId: z.string({
    required_error: "Please select a pet for the appointment",
  }),
  appointmentType: z.string({
    required_error: "Please select appointment type",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  location: z.string({
    required_error: "Please select a location",
  }),
  reason: z.string().min(5, "Please provide a reason with at least 5 characters").max(500),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pets, setPets] = useState<Pet[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get the pet ID from the URL if present
  const queryParams = new URLSearchParams(location.search);
  const preSelectedPetId = queryParams.get('petId');

  // Generate available times
  useEffect(() => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minutes of ['00', '30']) {
        const hourStr = hour.toString().padStart(2, '0');
        times.push(`${hourStr}:${minutes}`);
      }
    }
    setAvailableTimes(times);
  }, []);

  // Initialize form with default values
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      petId: preSelectedPetId || "",
      appointmentType: "",
      date: undefined,
      time: "",
      location: "",
      reason: "",
      notes: "",
    },
  });

  // Fetch pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        const petsData = await getPets();
        setPets(petsData);
      } catch (error) {
        console.error('Error fetching pets:', error);
        toast.error('Failed to load pets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Handle form submission
  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      // In a real app, this would be an API call
      console.log("Booking appointment:", data);
      
      // Get pet name for toast message
      const pet = pets.find(p => p.id === data.petId);
      
      // Format date for display
      const formattedDate = format(data.date, "MMMM d, yyyy");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Appointment booked for ${pet?.name} on ${formattedDate} at ${data.time}`);
      navigate("/appointments");
    } catch (error) {
      console.error("Failed to book appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  const formatTimeForDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Appointment Booking</CardTitle>
          <CardDescription>
            Schedule a medical appointment for your pet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="petId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Pet *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pets.map(pet => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name} ({pet.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appointmentTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date() || 
                              date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time">
                              {field.value && formatTimeForDisplay(field.value)}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTimes.map(time => (
                            <SelectItem key={time} value={time}>
                              {formatTimeForDisplay(time)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Visit *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe the reason for the appointment" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Please provide details about symptoms, concerns, or the purpose of the visit.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information for the veterinarian" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Include any additional information that might be helpful.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="glass-card dark:glass-card-dark rounded-xl p-4 flex items-start space-x-4">
                <div className="text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Important Notice</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Please arrive 10 minutes before your scheduled appointment time. 
                    If you need to cancel or reschedule, please do so at least 24 hours in advance.
                  </p>
                </div>
              </div>

              <CardFooter className="px-0 pb-0 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/appointments")}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Book Appointment
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBooking;