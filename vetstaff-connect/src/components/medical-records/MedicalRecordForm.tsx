
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const medicalRecordFormSchema = z.object({
  petName: z.string().min(2, { message: "Pet name is required" }),
  petType: z.string().min(1, { message: "Pet type is required" }),
  petBreed: z.string().min(1, { message: "Pet breed is required" }),
  ownerName: z.string().min(2, { message: "Owner name is required" }),
  diagnosis: z.string().min(5, { message: "Diagnosis is required" }),
  treatments: z.string().min(5, { message: "Treatment information is required" }),
  prescriptions: z.string().optional(),
  notes: z.string().optional(),
});

type MedicalRecordFormValues = z.infer<typeof medicalRecordFormSchema>;

interface MedicalRecordFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: MedicalRecordFormValues) => void;
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordFormSchema),
    defaultValues: {
      petName: "",
      petType: "",
      petBreed: "",
      ownerName: "",
      diagnosis: "",
      treatments: "",
      prescriptions: "",
      notes: "",
    },
  });

  const handleSubmit = (data: MedicalRecordFormValues) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Medical record created:", data);
      toast.success("Medical record created successfully");
    }
    
    // Reset form and close drawer
    form.reset();
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[85%] sm:max-w-2xl sm:mx-auto">
        <DrawerHeader className="border-b px-6 py-4">
          <DrawerTitle className="text-xl font-semibold">
            New Medical Record
          </DrawerTitle>
          <DrawerDescription>
            Create a new medical record for a patient
          </DrawerDescription>
          <DrawerClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="px-6 py-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="petName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Pet name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Owner name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="petType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pet type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dog">Dog</SelectItem>
                          <SelectItem value="Cat">Cat</SelectItem>
                          <SelectItem value="Bird">Bird</SelectItem>
                          <SelectItem value="Rabbit">Rabbit</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="petBreed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Breed</FormLabel>
                      <FormControl>
                        <Input placeholder="Pet breed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed diagnosis"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="treatments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatments</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter treatment information"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate multiple treatments with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="prescriptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prescriptions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter prescription details"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate multiple prescriptions with commas
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
                        placeholder="Any additional notes or instructions"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DrawerFooter className="px-0 pb-0">
                <Button type="submit" className="w-full">Create Medical Record</Button>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MedicalRecordForm;
