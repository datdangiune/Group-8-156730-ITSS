import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useForm } from "react-hook-form";

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
import { getPets } from '@/service/pet';
import { getTokenFromCookies } from '@/service/auth';
import { Pet } from '@/components/ui/pet-card';
// Mock appointment types
import { createAppointment } from '@/service/appointment';
const appointmentTypes = [
  { appointment_type: 'Annual Checkup' },
  { appointment_type: 'Vaccination' },
  { appointment_type: 'Wing Trimming' },
  { appointment_type: 'Dental Cleaning' },
  { appointment_type: 'Checkup' },
];

interface AppointmentFormValues {
  appointment_type: string;
  pet_id: number;
  appointment_date: string; // Dạng "YYYY-MM-DD"
  appointment_hour: string; // Dạng "HH:mm"
  reason?: string;
}
type PetType = "dog" | "cat" | "bird" | "rabbit" | "fish" | "other";
const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const token = getTokenFromCookies()
  const AVAILABLE_TIMES = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30"];
  // Generate available times
  useEffect(() => {
    setAvailableTimes(AVAILABLE_TIMES);
  }, []);
  useEffect(() => {
    async function fetchPets() {
          if (!token) return;
      
          const data = await getPets(token);
          const validTypes: PetType[] = ["dog", "cat", "bird", "rabbit", "fish", "other"];
          console.log(data)
          const formattedPets: Pet[] = data.map(pet => ({
            ...pet,
            id: Number(pet.id), 
            type: validTypes.includes(pet.type as PetType) ? (pet.type as PetType) : "other",
            gender: pet.gender === "Male" || pet.gender === "Female" ? pet.gender : "Male",
            image: pet.image || null, 
          }));
      
          setPets(formattedPets);
        }
      
        fetchPets();
      }, [token]);
    const form = useForm<AppointmentFormValues>({
        defaultValues: {
            appointment_type: "",
            pet_id: 0,
            appointment_date: "",
            appointment_hour: "",
            reason: "",
        },
    });



  // Handle form submission
  const onSubmit = async (data: AppointmentFormValues) => {
    try {
        if (!token) {
            throw new Error("User is not authenticated.");
        }

        await createAppointment(data, token);
        toast.success("Appointment booked successfully!");
        navigate("/appointments"); // Điều hướng sau khi đặt lịch thành công
    } catch (error) {
        toast.error(error.message || "Failed to book appointment.");
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
                name="pet_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Pet *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pets.map((pet) => (
                          <SelectItem key={pet.id} value={String(pet.id)}>
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
                name="appointment_type"
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
                        {appointmentTypes.map((type, id) => (
                          <SelectItem key={id} value={type.appointment_type}>
                            {type.appointment_type}
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
                  name="appointment_date"
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
                            selected={field.value ? new Date(field.value) : undefined} // Chuyển đổi string → Date
                            onSelect={(date) => field.onChange(date?.toISOString().split("T")[0] || "")} // Lưu lại thành string "YYYY-MM-DD"
                            disabled={(date) => date < new Date()} // Không cho chọn ngày trong quá khứ
                          />
                        </PopoverContent>

                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointment_hour"
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