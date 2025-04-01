import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  Edit, 
  ChevronDown 
} from "lucide-react";
import { PageTransition } from "@/components/animations/PageTransition";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BoardingServiceForm from "@/components/boarding/BoardingServiceForm";
import { BoardingService, BoardingServiceFormValues } from "@/types/boardingService";
import { addNewBoardingService, fetchAvailableBoardingServices, NewBoardingServiceRequest} from "@/service/Boarding";

const ClinicBoarding: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<BoardingService | null>(null);
  const [boardingServices, setBoardingServices] = useState<BoardingService[]>([]);
  const token = localStorage.getItem("token");
  const [image, setImage] = useState("")
  // Fetch all boarding services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      if (!token) {
        toast.error("Authentication token is missing. Please log in.");
        return;
      }

      try {
        const services = await fetchAvailableBoardingServices(token);
        const mappedServices = services.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description || "",
          pricePerDay: service.pricePerDay,
          maxStay: service.maxStay, 
          status: service.status,
          createdAt: service.createdAt,
          image: service.image || "",
        }));
        setBoardingServices(mappedServices);
      } catch (error: any) {
        console.error("Error fetching boarding services:", error.message);
        toast.error(error.message || "Failed to fetch boarding services");
      }
    };

    fetchServices();
  }, [token]);

  // Filter boarding services based on search query
  const filteredServices = boardingServices.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle creating a new boarding service
  const handleCreateService = async (formData: NewBoardingServiceRequest) => {
    console.log("Calling API with data:", formData);
    if (!token) {
      toast.error("Authentication token is missing. Please log in.");
      return;
    }

    // Validate required fields
    if (!formData.name?.trim()) {
      toast.error("Service name is required.");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Price per day must be greater than 0.");
      return;
    }
    if (!formData.maxday || formData.maxday <= 0) {
      toast.error("Maximum stay must be greater than 0.");
      return;
    }
    if (!formData.status) {
      toast.error("Status is required.");
      return;
    }
    console.log("Submitting Form Data:", formData);
    try {
      const requestData = {
        name: formData.name.trim(),
        price: formData.price,
        maxday: formData.maxday,
        duration: "1 day", // Hoặc giá trị phù hợp
        status: formData.status,
        details: formData.details ? { included: formData.details.included || [] } : { included: [] },
      }
      const response = await addNewBoardingService(token, requestData, image);
      

      const newService: BoardingService = {
        id: response.data.id,
        name: response.data.name || "Unnamed Service",
        description: response.data.description || "",
        pricePerDay: response.data.pricePerDay || 0,
        maxStay: response.data.maxStay || 0,
        status: response.data.status || "unavailable",
        createdAt: response.data.createdAt || new Date().toISOString(),
        image: response.data.image || "",
        amenities: response.data.details || [],
      };

      setBoardingServices([newService, ...boardingServices]);
      toast.success("Boarding service added successfully");
      setFormOpen(false); // Close the form after successful submission
    } catch (error: any) {
      console.error("Error adding boarding service:", error.message);
      toast.error(error.response?.data?.message || "Failed to add boarding service");
    }
  };

  // Handle deleting a boarding service
  const handleDeleteService = () => {
    if (!selectedService) return;

    // In a real app, this would be an API call
    const updatedServices = boardingServices.filter(
      service => service.id !== selectedService.id
    );

    setBoardingServices(updatedServices);
    setDeleteDialogOpen(false);
    toast.success("Boarding service deleted successfully");
  };

  // Open form for editing
  const openEditForm = (service: BoardingService) => {
    setSelectedService(service);
    setFormOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (service: BoardingService) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <PageTransition>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Clinic Boarding Services</h1>
            <p className="text-muted-foreground">
              Manage boarding services offered by the clinic
            </p>
          </div>
          
          <Button onClick={() => {
            setSelectedService(null);
            setFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Boarding Service
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>All Boarding Services</CardTitle>
                <CardDescription>
                  {filteredServices.length} total services
                </CardDescription>
              </div>
              
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-8 w-full sm:w-[260px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead>Max Stay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        No boarding services found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={service.image} alt={service.name} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {service.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(service.pricePerDay)}
                        </TableCell>
                        <TableCell>{service.maxStay}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={service.status === "available" ? "default" : "destructive"}
                            className="capitalize"
                          >
                            {service.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            {format(new Date(service.createdAt), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions <ChevronDown className="h-4 w-4 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Options</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditForm(service)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => openDeleteDialog(service)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Boarding Service Form */}
      <BoardingServiceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateService}
        initialData={selectedService || undefined}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Boarding Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedService?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default ClinicBoarding;
