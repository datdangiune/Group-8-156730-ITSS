import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  Edit, 
  ArrowUpDown,
  ChevronDown 
} from "lucide-react";
import { PageTransition } from "@/components/animations/PageTransition";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BoardingServiceForm from "@/components/boarding/BoardingServiceForm";
import { BoardingService, BoardingServiceFormValues } from "@/types/boardingService";

// Mock data for boarding services
const mockBoardingServices: BoardingService[] = [
  {
    id: "bs1",
    name: "Standard Kennel",
    pricePerDay: 35.00,
    maxDayStay: 14,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&auto=format",
    status: "available",
    details: {
      amenities: ["Daily Feeding", "Fresh Water", "Basic Exercise", "Regular Cleaning"],
    },
    createdAt: "2023-10-15T08:00:00.000Z",
  },
  {
    id: "bs2",
    name: "Premium Suite",
    pricePerDay: 65.00,
    maxDayStay: 30,
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=500&auto=format",
    status: "available",
    details: {
      amenities: ["Premium Food", "Spacious Area", "Extended Play Time", "Grooming", "Webcam Access"],
    },
    createdAt: "2023-10-10T10:30:00.000Z",
  },
  {
    id: "bs3",
    name: "Cat Condo",
    pricePerDay: 40.00,
    maxDayStay: 21,
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=500&auto=format",
    status: "available",
    details: {
      amenities: ["Cat Tree", "Cat Toys", "Premium Litter", "Daily Brushing", "Window Views"],
    },
    createdAt: "2023-09-28T14:15:00.000Z",
  },
  {
    id: "bs4",
    name: "Exotic Pet Suite",
    pricePerDay: 85.00,
    maxDayStay: 14,
    image: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?w=500&auto=format",
    status: "unavailable",
    details: {
      amenities: ["Specialized Care", "Climate Control", "Species-Specific Housing", "Expert Handling"],
    },
    createdAt: "2023-09-20T09:45:00.000Z",
  },
];

const ClinicBoarding: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<BoardingService | null>(null);
  const [boardingServices, setBoardingServices] = useState<BoardingService[]>(mockBoardingServices);
  
  // Filter boarding services based on search query
  const filteredServices = boardingServices.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.details.amenities.some(amenity => 
      amenity.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  // Handle creating a new boarding service
  const handleCreateService = (formData: BoardingServiceFormValues) => {
    // In a real app, this would be an API call
    const newService: BoardingService = {
      id: `bs${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    
    setBoardingServices([newService, ...boardingServices]);
  };
  
  // Handle editing a boarding service
  const handleEditService = (formData: BoardingServiceFormValues) => {
    if (!selectedService) return;
    
    // In a real app, this would be an API call
    const updatedServices = boardingServices.map(service => 
      service.id === selectedService.id 
        ? { ...service, ...formData } 
        : service
    );
    
    setBoardingServices(updatedServices);
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
                                {service.details.amenities.slice(0, 2).join(", ")}
                                {service.details.amenities.length > 2 && "..."}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(service.pricePerDay)}
                        </TableCell>
                        <TableCell>{service.maxDayStay} days</TableCell>
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
        onSubmit={selectedService ? handleEditService : handleCreateService}
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
