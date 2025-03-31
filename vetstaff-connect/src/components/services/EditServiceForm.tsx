
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
import { X, Save, Upload } from "lucide-react";
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

const serviceFormSchema = z.object({
  name: z.string().min(2, { message: "Service name is required" }),
  description: z.string().min(2, { message: "Description is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  type: z.string().min(1, { message: "Service type is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  notes: z.string().optional(),
  status: z.string().min(1, { message: "Status is required" }),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface EditServiceFormProps {
  open: boolean;
  onClose: () => void;
  service?: ServiceFormValues; // Optional service for editing
  onSubmit: (data: ServiceFormValues) => void;
}

const EditServiceForm: React.FC<EditServiceFormProps> = ({
  open,
  onClose,
  service,
  onSubmit,
}) => {
  const isEditMode = !!service;
  const [serviceImage, setServiceImage] = React.useState<string | null>(null);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service || {
      name: "",
      description: "",
      price: "",
      type: "",
      duration: "",
      notes: "",
      status: "active",
    },
  });

  React.useEffect(() => {
    if (service) {
      form.reset(service);
    }
  }, [service, form]);

  const handleSubmit = (data: ServiceFormValues) => {
    onSubmit({ ...data, image: serviceImage || undefined });
    form.reset();
    onClose();
    toast.success(`Service ${isEditMode ? "updated" : "created"} successfully`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setServiceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[85%] sm:max-w-xl sm:mx-auto">
        <DrawerHeader className="border-b px-6 py-4">
          <DrawerTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Service" : "New Service"}
          </DrawerTitle>
          <DrawerDescription>
            {isEditMode ? "Edit the service details" : "Create a new service"}
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Service name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter price" type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="grooming">Grooming</SelectItem>
                          <SelectItem value="boarding">Boarding</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="daycare">Daycare</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="5" 
                          step="5" 
                          placeholder="30"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Available</SelectItem>
                          <SelectItem value="inactive">Unavailable</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                          <SelectItem value="discontinued">Discontinued</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter service description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Service Image</FormLabel>
                <div className="flex flex-col space-y-2">
                  {serviceImage ? (
                    <div className="relative h-40 w-full">
                      <img
                        src={serviceImage}
                        alt="Service preview"
                        className="h-full w-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-background/80"
                        onClick={() => setServiceImage(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 flex flex-col items-center justify-center bg-muted/50 h-40">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  )}
                  
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={serviceImage ? "hidden" : ""}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional additional information about the service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DrawerFooter className="px-0 pb-0">
                <Button type="submit" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update Service" : "Add Service"}
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditServiceForm;
