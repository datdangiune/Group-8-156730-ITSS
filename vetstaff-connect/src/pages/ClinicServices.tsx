import React, { useState, useRef, useEffect } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Search, Plus, Edit, Image, ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchServices } from "@/service/services";

// Type for clinic services
interface ClinicService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  status: "available" | "unavailable";
}

const ClinicServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ClinicService[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ClinicService | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: "",
    status: "available" as "available" | "unavailable"
  });
  
  // Ref for image upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || ""; // Replace with actual token retrieval logic
        const fetchedServices = await fetchServices(token);
        setServices(fetchedServices);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        toast.error("Failed to load services");
      }
    };

    fetchData();
  }, []);
  
  // Filter services based on search term
  const filteredServices = services.filter(service =>
    (service.name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (service.description?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
  );
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      image: "",
      status: "available"
    });
    setEditingService(null);
  };
  
  // Open dialog for creating a new service
  const handleCreate = () => {
    resetForm();
    setDialogOpen(true);
  };
  
  // Open dialog for editing an existing service
  const handleEdit = (service: ClinicService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration,
      image: service.image,
      status: service.status
    });
    setDialogOpen(true);
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      // For now, we'll create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle status toggle
  const handleStatusToggle = (serviceId: string) => {
    setServices(prevServices =>
      prevServices.map(service =>
        service.id === serviceId
          ? { ...service, status: service.status === "available" ? "unavailable" : "available" }
          : service
      )
    );
    
    toast.success("Service status updated");
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    if (!formData.name || !formData.description || !formData.duration) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // If we're editing an existing service
    if (editingService) {
      setServices(prevServices =>
        prevServices.map(service =>
          service.id === editingService.id
            ? {
                ...service,
                name: formData.name,
                description: formData.description,
                price: price,
                duration: formData.duration,
                image: formData.image || service.image,
                status: formData.status
              }
            : service
        )
      );
      toast.success("Service updated successfully");
    } else {
      // Creating a new service
      const newService: ClinicService = {
        id: `cs${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: price,
        duration: formData.duration,
        image: formData.image || "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=300&h=200",
        status: formData.status
      };
      
      setServices(prev => [...prev, newService]);
      toast.success("Service created successfully");
    }
    
    setDialogOpen(false);
    resetForm();
  };
  
  // Handle service deletion
  const handleDelete = (serviceId: string) => {
    setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
    toast.success("Service deleted successfully");
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/services")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Clinic Services</h1>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Available Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-64 mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredServices.map(service => (
                <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-40 bg-muted">
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Image className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <StatusBadge 
                        status={service.status === "available" ? "available" : "unavailable"} 
                      />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{service.price} VND</p>
                        <p className="text-xs text-muted-foreground">{service.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusToggle(service.id)}
                        >
                          {service.status === "available" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredServices.length === 0 && (
                <div className="col-span-full h-40 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <Image className="h-12 w-12 mb-2" />
                  <h3 className="font-medium">No services found</h3>
                  <p className="text-sm">Try adjusting your search or add a new service</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
              <DialogDescription>
                {editingService 
                  ? "Update the details of this service" 
                  : "Add a new service to your clinic's offerings"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter service name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter service description"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (VND) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 30 min"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Service Image</Label>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <div className="border rounded-md p-1 flex items-center overflow-hidden">
                    {formData.image ? (
                      <div className="relative w-full h-12">
                        <img
                          src={formData.image}
                          alt="Service preview"
                          className="h-full object-cover mx-auto"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground p-2">No image selected</p>
                    )}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              
              <DialogFooter className="flex justify-between sm:justify-between">
                {editingService && (
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={() => handleDelete(editingService.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    {editingService ? "Update Service" : "Add Service"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default ClinicServices;
