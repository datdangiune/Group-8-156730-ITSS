
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronRight, ChevronLeft } from "lucide-react";
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

// Define the form schema with Zod
const formSchema = z.object({
  ownerName: z.string().min(1, "Owner name is required"),
  petName: z.string().min(1, "Pet name is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  specialCare: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MultiStepMedicalRecordFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
}

// Sample data - in a real app, this would come from an API
const owners = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Emily Johnson" },
  { id: "3", name: "Michael Brown" },
  { id: "4", name: "Sarah Davis" },
];

const petsByOwner = {
  "1": [
    { id: "1", name: "Max", type: "Dog", breed: "Golden Retriever" },
    { id: "2", name: "Bella", type: "Dog", breed: "Labrador" },
  ],
  "2": [
    { id: "3", name: "Oliver", type: "Cat", breed: "Siamese" },
    { id: "4", name: "Lucy", type: "Cat", breed: "Maine Coon" },
  ],
  "3": [
    { id: "5", name: "Charlie", type: "Dog", breed: "Beagle" },
    { id: "6", name: "Molly", type: "Dog", breed: "Poodle" },
  ],
  "4": [
    { id: "7", name: "Tiger", type: "Cat", breed: "Tabby" },
    { id: "8", name: "Rocky", type: "Dog", breed: "German Shepherd" },
  ],
};

const MultiStepMedicalRecordForm: React.FC<MultiStepMedicalRecordFormProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: "",
      petName: "",
      specialCare: "",
    },
  });
  
  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset();
    setStep(1);
    setSelectedOwner(null);
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
        setSelectedOwner(owners.find(owner => owner.name === ownerName)?.id || null);
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
    } else if (step === 3) {
      // Validate dates
      const startDate = form.getValues("startDate");
      const endDate = form.getValues("endDate");
      
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          form.setError("endDate", { message: "End date must be after start date" });
        } else {
          canProceed = true;
        }
      } else {
        if (!startDate) form.setError("startDate", { message: "Start date is required" });
        if (!endDate) form.setError("endDate", { message: "End date is required" });
      }
    }
    
    if (canProceed) {
      setStep(prev => Math.min(prev + 1, 4));
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
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an owner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {owners.map(owner => (
                      <SelectItem key={owner.id} value={owner.name}>
                        {owner.name}
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
                    {selectedOwner &&
                      petsByOwner[selectedOwner as keyof typeof petsByOwner]?.map(pet => (
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
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
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
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
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
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      
      case 4:
        return (
          <FormField
            control={form.control}
            name="specialCare"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Care Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any special care instructions or notes..."
                    className="resize-none h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Step 1: Select Owner"}
            {step === 2 && "Step 2: Select Pet"}
            {step === 3 && "Step 3: Set Dates"}
            {step === 4 && "Step 4: Special Care Instructions"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Step indicator */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4].map((i) => (
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
                {step < 4 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit">Save Medical Record</Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepMedicalRecordForm;
