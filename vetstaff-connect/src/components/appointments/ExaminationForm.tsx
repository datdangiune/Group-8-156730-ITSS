import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "sonner";
import { submitExaminationRecord, updateAppointmentStatus } from "@/service/Appointments";

// Define the form schema with Zod
const formSchema = z.object({
  diagnosis: z.string().min(1, "Diagnosis is required"),
  medications: z.array(
    z.object({
      name: z.string().min(1, "Medication name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      instructions: z.string().min(1, "Instructions are required"),
    })
  ),
  needsFollowUp: z.boolean().default(false),
  followUpDate: z.date().optional(),
});

// Infer TypeScript type from the schema
type FormValues = z.infer<typeof formSchema>;

interface ExaminationFormProps {
  open: boolean;
  onClose: () => void;
  appointmentId: string;
  petName: string;
  petType: string;
  ownerName: string;
  onSave: () => void; // New prop to handle status update
}

const ExaminationForm: React.FC<ExaminationFormProps> = ({
  open,
  onClose,
  appointmentId,
  petName,
  petType,
  ownerName,
  onSave,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosis: "",
      medications: [{ name: "", dosage: "", instructions: "" }],
      needsFollowUp: false,
    },
  });

  const { control, handleSubmit, watch, setValue } = form;
  const needsFollowUp = watch("needsFollowUp");

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      await submitExaminationRecord(appointmentId, {
        diagnosis: data.diagnosis,
        medications: data.medications.map((medication) => ({
          name: medication.name || "",
          dosage: medication.dosage || "",
          instructions: medication.instructions || "",
        })),
        needsFollowUp: data.needsFollowUp,
        followUpDate: data.followUpDate ? data.followUpDate.toISOString() : undefined,
      });

      // Transition status from In Progress to Done
      await updateAppointmentStatus(localStorage.getItem("token") || "", parseInt(appointmentId), "Done");

      toast.success("Examination record updated successfully", {
        description: data.needsFollowUp
          ? "Follow-up appointment scheduled"
          : "No follow-up required",
      });

      onSave(); // Trigger status update to Done
      onClose();
    } catch (error: any) {
      console.error("Error submitting examination record:", error.message);
      toast.error("Failed to update examination record. Please try again.");
    }
  };

  // Add a new medication row
  const addMedication = () => {
    const currentMedications = form.getValues("medications");
    setValue("medications", [
      ...currentMedications,
      { name: "", dosage: "", instructions: "" },
    ]);
  };

  // Remove a medication row
  const removeMedication = (index: number) => {
    const currentMedications = form.getValues("medications");
    if (currentMedications.length > 1) {
      setValue(
        "medications",
        currentMedications.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Examination Record</DialogTitle>
          <DialogDescription>
            {petName} ({petType}) - Owner: {ownerName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Diagnosis and Tests Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Diagnosis & Tests</h3>
              <FormField
                control={control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis and Test Results</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter diagnosis and test results" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Medications Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Prescription</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addMedication}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Medication
                </Button>
              </div>
              
              <div className="space-y-4">
                {watch("medications").map((_, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-start p-4 border rounded-md">
                    <FormField
                      control={control}
                      name={`medications.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="col-span-12 md:col-span-4">
                          <FormLabel>Medication Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Medication name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name={`medications.${index}.dosage`}
                      render={({ field }) => (
                        <FormItem className="col-span-12 md:col-span-3">
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 10mg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name={`medications.${index}.instructions`}
                      render={({ field }) => (
                        <FormItem className="col-span-12 md:col-span-4">
                          <FormLabel>Instructions</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Twice daily" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-12 md:col-span-1 flex justify-end items-end h-full">
                      {watch("medications").length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeMedication(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Follow-up</h3>
              
              <FormField
                control={control}
                name="needsFollowUp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Follow-up appointment required
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              {needsFollowUp && (
                <FormField
                  control={control}
                  name="followUpDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Follow-up Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button type="submit">Save Examination</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExaminationForm;
