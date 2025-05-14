import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ServiceTable, { ServiceData } from '@/components/ServiceTable';
import ServiceUserList, { ServiceUserEntry } from '@/components/ServiceUserList';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, PawPrint, Users, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for services with usage statistics
const initialServices = [
  {
    id: '1',
    name: 'Standard Grooming',
    category: 'grooming' as const,
    price: 45,
    duration: '1 hour',
    isActive: true,
    activeUses: 3,
    totalUses: 127,
  },
  {
    id: '2',
    name: 'Premium Grooming',
    category: 'grooming' as const,
    price: 75,
    duration: '1.5 hours',
    isActive: true,
    activeUses: 5,
    totalUses: 89,
  },
  {
    id: '3',
    name: 'Overnight Boarding',
    category: 'boarding' as const,
    price: 60,
    duration: '24 hours',
    isActive: true,
    activeUses: 8,
    totalUses: 215,
  },
  {
    id: '4',
    name: 'Weekly Boarding',
    category: 'boarding' as const,
    price: 350,
    duration: '1 week',
    isActive: true,
    activeUses: 4,
    totalUses: 42,
  },
  {
    id: '5',
    name: 'Vaccination',
    category: 'medical' as const,
    price: 85,
    duration: '30 minutes',
    isActive: true,
    activeUses: 2,
    totalUses: 324,
  },
  {
    id: '6',
    name: 'Dental Cleaning',
    category: 'medical' as const,
    price: 120,
    duration: '1 hour',
    isActive: false,
    activeUses: 0,
    totalUses: 65,
  },
  {
    id: '7',
    name: 'Pet Photography',
    category: 'other' as const,
    price: 65,
    duration: '45 minutes',
    isActive: true,
    activeUses: 1,
    totalUses: 33,
  },
];

// Mock data for service usage
const mockServiceUsers: Record<string, ServiceUserEntry[]> = {
  '1': [
    { id: 'u1', petName: 'Max', ownerName: 'John Smith', time: 'May 14, 2023 - 10:30 AM', status: 'ongoing' },
    { id: 'u2', petName: 'Bella', ownerName: 'Sarah Johnson', time: 'May 14, 2023 - 11:15 AM', status: 'ongoing' },
    { id: 'u3', petName: 'Charlie', ownerName: 'Robert Davis', time: 'May 14, 2023 - 2:00 PM', status: 'ongoing' },
    { id: 'u4', petName: 'Luna', ownerName: 'Emma Wilson', time: 'May 13, 2023 - 3:45 PM', status: 'completed' },
    { id: 'u5', petName: 'Cooper', ownerName: 'Michael Brown', time: 'May 13, 2023 - 1:30 PM', status: 'completed' },
  ],
  '2': [
    { id: 'u6', petName: 'Daisy', ownerName: 'Jessica Lee', time: 'May 14, 2023 - 9:00 AM', status: 'ongoing' },
    { id: 'u7', petName: 'Rocky', ownerName: 'Daniel Taylor', time: 'May 14, 2023 - 10:00 AM', status: 'ongoing' },
    { id: 'u8', petName: 'Bailey', ownerName: 'Olivia Martinez', time: 'May 14, 2023 - 1:15 PM', status: 'ongoing' },
    { id: 'u9', petName: 'Molly', ownerName: 'Thomas Anderson', time: 'May 14, 2023 - 3:30 PM', status: 'ongoing' },
    { id: 'u10', petName: 'Milo', ownerName: 'Sophia Garcia', time: 'May 14, 2023 - 4:45 PM', status: 'ongoing' },
  ],
  '3': [
    { id: 'u11', petName: 'Leo', ownerName: 'William Harris', time: 'May 14, 2023 - Present', status: 'ongoing' },
    { id: 'u12', petName: 'Zoe', ownerName: 'Ava Clark', time: 'May 13, 2023 - Present', status: 'ongoing' },
    { id: 'u13', petName: 'Toby', ownerName: 'James Lewis', time: 'May 12, 2023 - Present', status: 'ongoing' },
    { id: 'u14', petName: 'Ruby', ownerName: 'Liam Walker', time: 'May 11, 2023 - Present', status: 'ongoing' },
    { id: 'u15', petName: 'Oscar', ownerName: 'Charlotte Young', time: 'May 10, 2023 - Present', status: 'ongoing' },
    { id: 'u16', petName: 'Lucy', ownerName: 'Benjamin Hall', time: 'May 9, 2023 - Present', status: 'ongoing' },
    { id: 'u17', petName: 'Teddy', ownerName: 'Amelia King', time: 'May 8, 2023 - Present', status: 'ongoing' },
    { id: 'u18', petName: 'Rosie', ownerName: 'Henry Adams', time: 'May 7, 2023 - Present', status: 'ongoing' },
  ],
};

// Extended service data type
interface ExtendedServiceData extends ServiceData {
  activeUses: number;
  totalUses: number;
}

const Services = () => {
  const [services, setServices] = useState<ExtendedServiceData[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ExtendedServiceData | null>(null);
  const [selectedService, setSelectedService] = useState<ExtendedServiceData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'grooming',
    price: 0,
    duration: '',
    isActive: true,
  });

  // Filtered services based on search query
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (service: ServiceData) => {
    const extService = service as ExtendedServiceData;
    setCurrentService(extService);
    setFormData({
      name: extService.name,
      category: extService.category,
      price: extService.price,
      duration: extService.duration,
      isActive: extService.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentService) return;

    setServices(prevServices => 
      prevServices.map(service => 
        service.id === currentService.id 
          ? { 
              ...service, 
              name: formData.name, 
              category: formData.category as any, 
              price: formData.price,
              duration: formData.duration,
              isActive: formData.isActive,
            } 
          : service
      )
    );

    toast("Service updated", {
      description: `${formData.name} has been updated.`,
    });

    setIsEditDialogOpen(false);
  };

  const handleAddService = () => {
    const newService: ExtendedServiceData = {
      id: (services.length + 1).toString(),
      name: formData.name,
      category: formData.category as any,
      price: formData.price,
      duration: formData.duration,
      isActive: formData.isActive,
      activeUses: 0,
      totalUses: 0
    };

    setServices(prevServices => [...prevServices, newService]);

    toast("Service added", {
      description: `${formData.name} has been added successfully.`,
    });

    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      category: 'grooming',
      price: 0,
      duration: '',
      isActive: true,
    });
  };

  const handleDelete = (service: ServiceData) => {
    const extService = service as ExtendedServiceData;
    setCurrentService(extService);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!currentService) return;

    setServices(prevServices => prevServices.filter(service => service.id !== currentService.id));

    // Replace variant with proper toast.error
    toast.error("Service deleted", {
      description: `${currentService.name} has been deleted.`,
    });

    setIsDeleteDialogOpen(false);
    
    // If we're deleting the currently selected service, clear it
    if (selectedService && selectedService.id === currentService.id) {
      setSelectedService(null);
    }
  };

  const handleToggleActive = (service: ServiceData) => {
    const extService = service as ExtendedServiceData;
    setServices(prevServices => 
      prevServices.map(s => 
        s.id === extService.id 
          ? { ...s, isActive: !s.isActive } 
          : s
      )
    );

    const statusMessage = extService.isActive ? 'deactivated' : 'activated';

    toast(`Service ${statusMessage}`, {
      description: `${extService.name} has been ${statusMessage}.`,
    });
  };

  const openAddDialog = () => {
    setFormData({
      name: '',
      category: 'grooming',
      price: 0,
      duration: '',
      isActive: true,
    });
    setIsAddDialogOpen(true);
  };

  const handleServiceSelect = (service: ExtendedServiceData) => {
    setSelectedService(service);
  };

  const handleBackToList = () => {
    setSelectedService(null);
  };

  // Enhanced table with usage statistics
  const ServiceTableWithUsage = ({
    data,
    onSelect,
    onEdit,
    onDelete,
    onToggleActive
  }: {
    data: ExtendedServiceData[];
    onSelect: (service: ExtendedServiceData) => void;
    onEdit?: (service: ServiceData) => void;
    onDelete?: (service: ServiceData) => void;
    onToggleActive?: (service: ServiceData) => void;
  }) => {
    return (
      <Table className="animate-fade-in">
        <TableHeader>
          <TableRow>
            <TableHead>Service Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Active Uses</TableHead>
            <TableHead>Total Uses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((service) => {
            const categoryColor = {
              grooming: { bg: 'bg-vetblue-50', text: 'text-vetblue-600', border: 'border-vetblue-200' },
              boarding: { bg: 'bg-vetgreen-50', text: 'text-vetgreen-600', border: 'border-vetgreen-200' },
              medical: { bg: 'bg-vetred-50', text: 'text-vetred-600', border: 'border-vetred-200' },
              other: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted-foreground' },
            }[service.category];
            
            return (
              <TableRow 
                key={service.id} 
                className="group hover:bg-secondary/30 cursor-pointer"
                onClick={() => onSelect(service)}
              >
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      categoryColor.bg,
                      categoryColor.text,
                      categoryColor.border
                    )}
                  >
                    {service.category}
                  </Badge>
                </TableCell>
                <TableCell>${service.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-vetblue-500" />
                    <span className="font-medium">{service.activeUses}</span>
                  </div>
                </TableCell>
                <TableCell>{service.totalUses}</TableCell>
                <TableCell>
                  {service.isActive ? (
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-vetgreen-500 mr-2"></span>
                      <span className="text-vetgreen-700">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground mr-2"></span>
                      <span className="text-muted-foreground">Inactive</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(service);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    >
                      <PawPrint className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Service Management</h1>
            <p className="text-muted-foreground mt-1">Manage all available services</p>
          </div>
          <Button onClick={openAddDialog} className="animate-fade-in">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {selectedService ? (
          // Detail View for selected service
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBackToList} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize mb-2",
                        {
                          grooming: "bg-vetblue-50 text-vetblue-600 border-vetblue-200",
                          boarding: "bg-vetgreen-50 text-vetgreen-600 border-vetgreen-200",
                          medical: "bg-vetred-50 text-vetred-600 border-vetred-200",
                          other: "bg-muted text-muted-foreground border-muted-foreground"
                        }[selectedService.category]
                      )}
                    >
                      {selectedService.category}
                    </Badge>
                    <CardTitle className="text-2xl">{selectedService.name}</CardTitle>
                    <CardDescription>
                      ${selectedService.price.toFixed(2)} • {selectedService.duration}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-1">
                      <span className="text-muted-foreground mr-2">Active:</span>
                      <span className="font-medium text-vetblue-600">{selectedService.activeUses}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Total:</span>
                      <span className="font-medium">{selectedService.totalUses}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold mb-4">Service Usage</h3>
                  
                  <ServiceUserList 
                    title="Current Users"
                    description={`Pets currently using ${selectedService.name}`}
                    data={(mockServiceUsers[selectedService.id] || []).filter(u => u.status === 'ongoing')}
                  />
                  
                  <div className="h-6"></div>
                  
                  <ServiceUserList 
                    title="Recent Users"
                    description={`Pets who recently used ${selectedService.name}`}
                    data={(mockServiceUsers[selectedService.id] || []).filter(u => u.status === 'completed')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Main List View
          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle>All Services</CardTitle>
              <CardDescription>Manage all services offered by the clinic</CardDescription>
              <div className="mt-4 max-w-md">
                <Input 
                  placeholder="Search services..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ServiceTableWithUsage 
                data={filteredServices} 
                onSelect={handleServiceSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {currentService?.name} service. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-vetred-500 text-white hover:bg-vetred-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Make changes to the service details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grooming">Grooming</SelectItem>
                  <SelectItem value="boarding">Boarding</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price.toString()}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 1 hour, 30 minutes, 2 days"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <Select 
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
              >
                <SelectTrigger id="isActive">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service offering.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Service Name</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="add-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grooming">Grooming</SelectItem>
                  <SelectItem value="boarding">Boarding</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-price">Price ($)</Label>
              <Input
                id="add-price"
                type="number"
                value={formData.price.toString()}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-duration">Duration</Label>
              <Input
                id="add-duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 1 hour, 30 minutes, 2 days"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-isActive">Status</Label>
              <Select 
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
              >
                <SelectTrigger id="add-isActive">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddService}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Services;
