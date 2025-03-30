
import React, { useState } from "react";
import { Camera, Edit, Plus, Search, Trash2 } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Sample clinic services data
const clinicServices = [
  {
    id: "1",
    name: "Basic Checkup",
    description: "Regular health examination for your pet",
    price: 50,
    duration: 30,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&h=250",
  },
  {
    id: "2",
    name: "Vaccination",
    description: "Standard vaccination package for dogs or cats",
    price: 75,
    duration: 20,
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=400&h=250",
  },
  {
    id: "3",
    name: "Dental Cleaning",
    description: "Complete dental cleaning and examination",
    price: 120,
    duration: 60,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=400&h=250",
  },
  {
    id: "4",
    name: "Surgery - Minor",
    description: "Minor surgical procedure",
    price: 250,
    duration: 90,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&h=250",
  },
];

const serviceFormSchema = z.object({
  name: z.string().min(1, { message: "Service name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.string().or(z.number()).transform(val => Number(val)),
  duration: z.string().or(z.number()).transform(val => Number(val)),
  image: z.instanceof(File).optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const ClinicServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState(clinicServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      duration: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
    }
  };

  const onSubmit = (data: ServiceFormValues) => {
    if (editingService) {
      // Update existing service
      const updatedServices = services.map(service => 
        service.id === editingService.id 
          ? { 
              ...service, 
              name: data.name, 
              description: data.description, 
              price: data.price, 
              duration: data.duration,
              image: imagePreview || service.image
            } 
          : service
      );
      setServices(updatedServices);
      toast.success("Service updated successfully!");
    } else {
      // Create new service
      const newService = {
        id: Math.random().toString(36).substring(2, 9),
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        image: imagePreview || "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&h=250",
      };
      setServices([...services, newService]);
      toast.success("Service created successfully!");
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    form.reset();
    setImagePreview(null);
    setEditingService(null);
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    form.setValue("name", service.name);
    form.setValue("description", service.description);
    form.setValue("price", service.price);
    form.setValue("duration", service.duration);
    setImagePreview(service.image);
    setIsDialogOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast.success("Service deleted successfully!");
  };

  const filteredServices = services.filter(service => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium mb-2">Clinic Services</h1>
            <p className="text-muted-foreground">Manage services offered by your clinic</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Button as={Link} to="/services" variant="outline">
              View Booked Services
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                  <DialogDescription>
                    {editingService 
                      ? "Update the details of this service." 
                      : "Create a new service for your clinic."}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 py-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter service name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0.00" 
                                  {...field} 
                                />
                              </FormControl>
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
                                  placeholder="30" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormItem>
                        <FormLabel>Service Image</FormLabel>
                        <div className="flex flex-col space-y-3">
                          {imagePreview && (
                            <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                              <img 
                                src={imagePreview} 
                                alt="Service preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("serviceImage")?.click()}
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              {imagePreview ? "Change Image" : "Upload Image"}
                            </Button>
                            {imagePreview && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setImagePreview(null)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          <input
                            id="serviceImage"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </div>
                        <FormDescription>
                          Upload an image representing this service
                        </FormDescription>
                      </FormItem>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        resetForm();
                        setIsDialogOpen(false);
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Service</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden flex flex-col">
              <div 
                className="aspect-video w-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${service.image})` }}
              />
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>${service.price} | {service.duration} min</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {service.description}
                </p>
              </CardContent>
              <CardFooter className="mt-auto pt-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleEditService(service)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No services found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or add a new service
            </p>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-medium mb-6">Services Table View</h2>
          <div className="bg-card rounded-lg border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price ($)</TableHead>
                  <TableHead>Duration (min)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                    <TableCell>${service.price}</TableCell>
                    <TableCell>{service.duration}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ClinicServices;
