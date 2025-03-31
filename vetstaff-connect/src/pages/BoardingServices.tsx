
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Plus, Filter, ArrowUpDown, Edit, X } from "lucide-react";
import { PageTransition } from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/dashboard/StatusBadge";

// Sample data for demonstration
const SAMPLE_SERVICES = [
  {
    id: "board-001",
    serviceName: "Luxury Suite",
    petName: "Max",
    petType: "Dog",
    petBreed: "Golden Retriever",
    ownerName: "John Smith",
    checkInDate: "May 8, 2023",
    checkOutDate: "May 15, 2023",
    status: "active",
    price: "$350.00",
    notes: "Requires daily walks and has special dietary needs",
  },
  {
    id: "board-002",
    serviceName: "Standard Kennel",
    petName: "Luna",
    petType: "Cat",
    petBreed: "Siamese",
    ownerName: "Emily Johnson",
    checkInDate: "May 10, 2023",
    checkOutDate: "May 20, 2023",
    status: "active",
    price: "$200.00",
    notes: "Very shy, needs quiet space",
  },
  {
    id: "board-003",
    serviceName: "Deluxe Suite",
    petName: "Charlie",
    petType: "Dog",
    petBreed: "Beagle",
    ownerName: "Michael Brown",
    checkInDate: "May 5, 2023",
    checkOutDate: "May 12, 2023",
    status: "completed",
    price: "$280.00",
    notes: "Loves playtime with other dogs",
  },
  {
    id: "board-004",
    serviceName: "Cat Condo",
    petName: "Oliver",
    petType: "Cat",
    petBreed: "Maine Coon",
    ownerName: "Sarah Davis",
    checkInDate: "May 15, 2023",
    checkOutDate: "May 25, 2023",
    status: "upcoming",
    price: "$180.00",
    notes: "Needs medication twice daily",
  },
];

const BoardingServices: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  // Form state
  const [serviceName, setServiceName] = useState("");
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("Dog");
  const [ownerName, setOwnerName] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [notes, setNotes] = useState("");
  
  // Filter services based on search query and filters
  const filteredServices = SAMPLE_SERVICES.filter((service) => {
    const matchesSearch =
      service.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });
  
  const handleAddService = () => {
    setSelectedService(null);
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  const handleEditService = (service: any) => {
    setSelectedService(service);
    // Populate form with service data
    setServiceName(service.serviceName);
    setPetName(service.petName);
    setPetType(service.petType);
    setOwnerName(service.ownerName);
    setCheckInDate(service.checkInDate);
    setCheckOutDate(service.checkOutDate);
    setNotes(service.notes);
    setIsAddDialogOpen(true);
  };
  
  const resetForm = () => {
    setServiceName("");
    setPetName("");
    setPetType("Dog");
    setOwnerName("");
    setCheckInDate("");
    setCheckOutDate("");
    setNotes("");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted", {
      serviceName,
      petName,
      petType,
      ownerName,
      checkInDate,
      checkOutDate,
      notes,
    });
    // In a real app, you would add/update the service in your database
    setIsAddDialogOpen(false);
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Home className="mr-2 h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">Boarding Services</h1>
          </div>
          
          <Button onClick={handleAddService}>
            <Plus className="mr-2 h-4 w-4" />
            New Boarding
          </Button>
        </div>
        
        {/* Filters and search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="newest">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="checkout">Check-out Date</SelectItem>
                <SelectItem value="checkin">Check-in Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length === 0 ? (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No boarding services found matching your criteria
            </div>
          ) : (
            filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{service.petName}</CardTitle>
                      <CardDescription>
                        {service.petType}, {service.petBreed}
                      </CardDescription>
                    </div>
                    <StatusBadge status={service.status as any} />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-muted-foreground">Owner:</span>
                      <span className="col-span-2 font-medium">{service.ownerName}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="col-span-2 font-medium">{service.serviceName}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-muted-foreground">Check-in:</span>
                      <span className="col-span-2">{service.checkInDate}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-muted-foreground">Check-out:</span>
                      <span className="col-span-2">{service.checkOutDate}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="col-span-2 font-medium">{service.price}</span>
                    </div>
                  </div>
                  
                  {service.notes && (
                    <div className="mt-3 pt-3 border-t text-sm">
                      <p className="text-muted-foreground mb-1">Notes:</p>
                      <p className="text-sm">{service.notes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditService(service)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Add/Edit Service Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsAddDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedService ? "Edit Boarding Service" : "Add New Boarding Service"}
            </DialogTitle>
            <DialogDescription>
              Enter the details for the boarding service
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service Type</Label>
                  <Select
                    value={serviceName}
                    onValueChange={setServiceName}
                  >
                    <SelectTrigger id="serviceName">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Luxury Suite">Luxury Suite</SelectItem>
                      <SelectItem value="Standard Kennel">Standard Kennel</SelectItem>
                      <SelectItem value="Deluxe Suite">Deluxe Suite</SelectItem>
                      <SelectItem value="Cat Condo">Cat Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="petType">Pet Type</Label>
                  <Select
                    value={petType}
                    onValueChange={setPetType}
                  >
                    <SelectTrigger id="petType">
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Bird">Bird</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="petName">Pet Name</Label>
                  <Input
                    id="petName"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Enter pet name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Enter owner name"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkInDate">Check-in Date</Label>
                  <Input
                    id="checkInDate"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOutDate">Check-out Date</Label>
                  <Input
                    id="checkOutDate"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Special Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any special requirements or notes"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedService ? "Update Service" : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default BoardingServices;
