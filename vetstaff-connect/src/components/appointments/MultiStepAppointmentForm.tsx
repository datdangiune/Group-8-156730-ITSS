import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronRight, ChevronLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { fetchOwners, fetchPetsByOwner } from "@/service/Appointments";

// Define the form schema with Zod
const formSchema = z.object({
  ownerName: z.string().min(1, "Owner name is required"),
  petName: z.string().min(1, "Pet name is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().min(1, "Time is required"),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MultiStepAppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const timeSlots = [
  "08:00", "09:30", "11:00", "12:30", "14:00", "15:30"
];

const appointmentReasons = [
  'Annual Checkup', 'Vaccination', "Dental Cleaning", "Wing Trimming", "Checkup"
];

const MultiStepAppointmentForm: React.FC<MultiStepAppointmentFormProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState(1);
  const [owners, setOwners] = useState<{ id: number; username: string }[]>([]);
  const [pets, setPets] = useState<{ id: number; name: string; type: string; breed: string }[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<number | null>(null);
  
  // Fetch owners on component mount
  useEffect(() => {
    const loadOwners = async () => {
      try {
        const data = await fetchOwners();
        setOwners(data);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };
    loadOwners();
  }, []);

  // Fetch pets when an owner is selected
  useEffect(() => {
    if (selectedOwner) {
      const loadPets = async () => {
        try {
          const data = await fetchPetsByOwner(selectedOwner);
          setPets(data);
        } catch (error) {
          console.error("Error fetching pets:", error);
        }
      };
      loadPets();
    } else {
      setPets([]);
    }
  }, [selectedOwner]);
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: "",
      petName: "",
      time: "",
      reason: "",
      notes: "",
    },
  });
  
  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    // Create a new appointment object
    const newAppointment = {
      pet_id: pets.find(pet => pet.name === values.petName)?.id, // Map pet name to pet ID
      owner_id: selectedOwner,
      appointment_date: format(values.date, "yyyy-MM-dd"), // Format date for backend
      appointment_hour: values.time,
      appointment_type: values.reason, // Map reason to appointment type
      reason: values.notes || "", // Use notes as the reason
    };

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing. Please log in again.");
        return;
      }

      // Send the appointment to the backend
      await axios.post(
        "http://localhost:3000/api/v1/staff/appointments/new",
        newAppointment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Appointment created successfully!");
      onSave(newAppointment);
      form.reset();
      setStep(1);
      setSelectedOwner(null);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment. Please try again.");
    }
  };
  
  // Handle closing the dialog
  const handleClose = () => {
    form.reset();
    setStep(1);
    setSelectedOwner(null);
    onClose();
  };
  
  // Handle next step
  const handleNext = async () => {
    let canProceed = false;
    
    if (step === 1) {
      // Validate owner name
      const ownerName = form.getValues("ownerName");
      if (ownerName) {
        setSelectedOwner(Number(ownerName));
        canProceed = true;
      } else {
        form.setError("ownerName", { message: "Owner name is required" });
      }
    } else if (step === 2) {
      // Validate pet name
      const petName = form.getValues("petName");
      if (petName) {
        canProceed = true;
      } else {
        form.setError("petName", { message: "Pet name is required" });
      }
    }
    
    if (canProceed) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Owner Name</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedOwner(Number(value));
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an owner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {owners.map(owner => (
                      <SelectItem key={owner.id} value={owner.id.toString()}>
                        {owner.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 2:
        return (
          <FormField
            control={form.control}
            name="petName"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Pet Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedOwner}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pets.map(pet => (
                      <SelectItem key={pet.id} value={pet.name}>
                        {pet.name} ({pet.type}, {pet.breed})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
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
                            <span>Select date</span>
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
                        initialFocus
                        className="pointer-events-auto"
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
                  <FormLabel>Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
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
                  <FormLabel>Reason for Visit</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appointmentReasons.map(reason => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes or details..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Step 1: Select Owner"}
            {step === 2 && "Step 2: Select Pet"}
            {step === 3 && "Step 3: Appointment Details"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Step indicator */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 mx-1 rounded-full ${
                    step >= i ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            
            {renderStepContent()}
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <div>
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>
              
              <div>
                {step < 3 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit">Create Appointment</Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepAppointmentForm;
