import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getAllServices, createService, updateService, deleteService } from '@/services/AdminService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { getTokenFromCookies } from '@/services/AdminAuthService';
import { useNavigate } from 'react-router-dom';
const Services: React.FC = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newService, setNewService] = useState({ name: '', description: '', price: '' });
    const [editingService, setEditingService] = useState<any>(null);

    useEffect(() => {
        fetchServices();
    }, []);
        const token = getTokenFromCookies()
        const navigate = useNavigate()
        useEffect(() => {
    
            if (!token) {
                navigate('/login');
            }
        }, [token])
    const fetchServices = async () => {
        try {
            const data = await getAllServices();
            setServices(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching services:', err.message); // Log the error
            toast({
                title: 'Error',
                description: err.message || 'Failed to fetch services.',
                variant: 'destructive',
            });
            setLoading(false);
        }
    };

    const handleAddService = async () => {
        try {
            const service = await createService(newService);
            setServices((prevServices) => [...prevServices, service]);
            setNewService({ name: '', description: '', price: '' });
            toast({
                title: 'Service added',
                description: 'New service has been added successfully.',
            });
        } catch (err) {
            console.error('Error adding service:', err.message);
            toast({
                title: 'Error',
                description: 'Failed to add service.',
                variant: 'destructive',
            });
        }
    };

    const handleEditService = async () => {
        try {
            const updatedService = await updateService(editingService.id, editingService);
            setServices((prevServices) =>
                prevServices.map((service) =>
                    service.id === updatedService.id ? updatedService : service
                )
            );
            setEditingService(null);
            toast({
                title: 'Service updated',
                description: 'Service has been updated successfully.',
            });
        } catch (err) {
            console.error('Error updating service:', err.message);
            toast({
                title: 'Error',
                description: 'Failed to update service.',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteService = async (id: string) => {
        try {
            await deleteService(id);
            setServices((prevServices) => prevServices.filter((service) => service.id !== id));
            toast({
                title: 'Service deleted',
                description: 'Service has been deleted successfully.',
            });
        } catch (err) {
            console.error('Error deleting service:', err.message);
            toast({
                title: 'Error',
                description: 'Failed to delete service.',
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Service Management</h1>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Add New Service</h2>
                    <div className="flex space-x-4">
                        <Input
                            placeholder="Service Name"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        />
                        <Input
                            placeholder="Description"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        />
                        <Input
                            placeholder="Price"
                            type="number"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        />
                        <Button onClick={handleAddService}>Add Service</Button>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service: any) => (
                            <TableRow key={service.id}>
                                <TableCell>{service.name}</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell>${service.price}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditingService(service)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteService(service.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {editingService && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Edit Service</h2>
                        <div className="flex space-x-4">
                            <Input
                                placeholder="Service Name"
                                value={editingService.name}
                                onChange={(e) =>
                                    setEditingService({ ...editingService, name: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Description"
                                value={editingService.description}
                                onChange={(e) =>
                                    setEditingService({
                                        ...editingService,
                                        description: e.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Price"
                                type="number"
                                value={editingService.price}
                                onChange={(e) =>
                                    setEditingService({
                                        ...editingService,
                                        price: e.target.value,
                                    })
                                }
                            />
                            <Button onClick={handleEditService}>Save Changes</Button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Services;
