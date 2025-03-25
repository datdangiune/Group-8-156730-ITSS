
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ServiceTable, { ServiceData } from '@/components/ServiceTable';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
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
import { Plus, PawPrint } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Services = () => {
  // Mock data for services
  const initialServices = [
    {
      id: '1',
      name: 'Standard Grooming',
      category: 'grooming' as const,
      price: 45,
      duration: '1 hour',
      isActive: true,
    },
    {
      id: '2',
      name: 'Premium Grooming',
      category: 'grooming' as const,
      price: 75,
      duration: '1.5 hours',
      isActive: true,
    },
    {
      id: '3',
      name: 'Overnight Boarding',
      category: 'boarding' as const,
      price: 60,
      duration: '24 hours',
      isActive: true,
    },
    {
      id: '4',
      name: 'Weekly Boarding',
      category: 'boarding' as const,
      price: 350,
      duration: '1 week',
      isActive: true,
    },
    {
      id: '5',
      name: 'Vaccination',
      category: 'medical' as const,
      price: 85,
      duration: '30 minutes',
      isActive: true,
    },
    {
      id: '6',
      name: 'Dental Cleaning',
      category: 'medical' as const,
      price: 120,
      duration: '1 hour',
      isActive: false,
    },
    {
      id: '7',
      name: 'Pet Photography',
      category: 'other' as const,
      price: 65,
      duration: '45 minutes',
      isActive: true,
    },
  ];

  const [services, setServices] = useState<ServiceData[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceData | null>(null);
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
    setCurrentService(service);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      isActive: service.isActive,
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

    toast({
      title: 'Service updated',
      description: `${formData.name} has been updated.`,
    });

    setIsEditDialogOpen(false);
  };

  const handleAddService = () => {
    const newService: ServiceData = {
      id: (services.length + 1).toString(),
      name: formData.name,
      category: formData.category as any,
      price: formData.price,
      duration: formData.duration,
      isActive: formData.isActive,
    };

    setServices(prevServices => [...prevServices, newService]);

    toast({
      title: 'Service added',
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
    setCurrentService(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!currentService) return;

    setServices(prevServices => prevServices.filter(service => service.id !== currentService.id));

    toast({
      title: 'Service deleted',
      description: `${currentService.name} has been deleted.`,
      variant: 'destructive',
    });

    setIsDeleteDialogOpen(false);
  };

  const handleToggleActive = (service: ServiceData) => {
    setServices(prevServices => 
      prevServices.map(s => 
        s.id === service.id 
          ? { ...s, isActive: !s.isActive } 
          : s
      )
    );

    const statusMessage = service.isActive ? 'deactivated' : 'activated';

    toast({
      title: `Service ${statusMessage}`,
      description: `${service.name} has been ${statusMessage}.`,
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
            <ServiceTable 
              data={filteredServices} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          </CardContent>
        </Card>
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
