import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Scissors, BedDouble, Dumbbell, Search, CalendarDays, Clock, CreditCard, Package, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ServiceCard from '@/components/ui/service-card';
import { useNavigate } from 'react-router-dom';
import { fetchServices, GetServicesResponse, Service, fetchUserServices, UserService, getPaymentUrl } from '@/service/service';
import { getTokenFromCookies } from '@/service/auth';
import { io } from "socket.io-client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const socket = io("http://localhost:3000");
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = getTokenFromCookies();

  // MyService states
  const [mySearch, setMySearch] = useState('');
  const [myView, setMyView] = useState<'grid' | 'table'>('grid');
  const [myServices, setMyServices] = useState<UserService[]>([]);
  const [myError, setMyError] = useState<string | null>(null);
  const [myLoading, setMyLoading] = useState<boolean>(true);

  // Filter services based on search query
  const filterServices = (services: Service[]) => {
    if (!searchQuery) return services;
    
    return services.filter(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  // MyService logic
  const handleMyServiceClick = async (service: UserService) => {
    if (service.status === 'Scheduled') {
      const paymentUrl = await getPaymentUrl(service.id, token);
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast({
          title: "Error",
          description: "Service tạm không phục vụ",
          variant: "destructive",
          className: "text-lg p-6",
        });
      }
    }
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'grooming':
        return <Sparkles className="h-4 w-4 mr-2" />;
      case 'boarding':
        return <Package className="h-4 w-4 mr-2" />;
      case 'training':
        return <CalendarDays className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const getServiceStatusBadge = (serviceStatus: 'In Progress' | 'Completed' | 'Scheduled' | 'Cancelled') => {
    switch (serviceStatus) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-100 text-orange-700">In Progress</Badge>;
      case 'Scheduled':
        return <Badge className="bg-gray-100 text-blue-700">Scheduled</Badge>;
      case 'Cancelled':
        return <Badge className="bg-gray-100 text-blue-700">Cancelled</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: 'pending' | 'paid' | 'canceled') => {
    switch (status) {
      case 'paid':
        return <Badge>Paid</Badge>;
      case 'pending':
        return <Badge variant="destructive">Unpaid</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-700">Canceled</Badge>;
      default:
        return null;
    }
  };

  const filterMyServices = (services: UserService[]) => {
    const searchTerm = mySearch.toLowerCase();
    return services.filter(service => {
      return (
        service?.service?.name.toLowerCase().includes(searchTerm) ||
        service.service.description.toLowerCase().includes(searchTerm)
      );
    });
  };

  const renderMyServiceCard = (service: UserService) => (
    <Card
      key={service.id}
      className={cn(
        "overflow-hidden",
        service.status === 'In Progress' && "cursor-pointer hover:shadow-md"
      )}
      onClick={() => service.status === 'In Progress' && handleMyServiceClick(service)}
    >
      <CardHeader>
        <CardTitle className="flex items-center">
          {getServiceTypeIcon(service.service.type)}
          {service.service.name}
          <div className='ml-auto'>{getServiceStatusBadge(service.status)}</div>
        </CardTitle>
        <CardDescription>{service.service.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {service.date && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>{new Date(service.date).toLocaleDateString()}</span>
          </div>
        )}
        {service.service.description && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{service.hour}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <CreditCard className="h-4 w-4 mr-2" />
          <span>Pet: {service.pet.name}</span>
        </div>
        {getPaymentStatusBadge(service.status_payment)}
      </CardContent>
      {service.status === 'Scheduled' && service.status_payment === 'pending' && (
        <CardFooter className="pt-0">
          <Button
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleMyServiceClick(service);
            }}
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  const renderMyTableView = (services: UserService[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Pet</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow
            key={service.id}
            className={service.status === 'In Progress' ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" : ""}
            onClick={() => service.status === 'In Progress' && handleMyServiceClick(service)}
          >
            <TableCell className="font-medium">{service.service.name}</TableCell>
            <TableCell className="flex items-center">{getServiceTypeIcon(service.service.type)} {service.service.type}</TableCell>
            <TableCell>{service.pet.name}</TableCell>
            <TableCell>{service.date ? new Date(service.date).toLocaleDateString() : 'Not scheduled'}</TableCell>
            <TableCell>{service.hour || 'Not scheduled'}</TableCell>
            <TableCell>{getServiceStatusBadge(service.status)}</TableCell>
            <TableCell>{getPaymentStatusBadge(service.status_payment)}</TableCell>
            <TableCell>
              {service.status === 'Scheduled' && service.status_payment === 'pending' && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMyServiceClick(service);
                  }}
                >
                  Pay Now
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data: GetServicesResponse = await fetchServices(token);
        setServices(data.services);
        setLoading(false);
      } catch (error) {
        setError('Failed to load services');
        setLoading(false);
      }
    };

    loadServices();

    socket.on("serviceUpdated", (updatedService) => {
      console.log("📢 Received updated service:", updatedService);
      alert("Có service mới, ấn OK để xem")
      window.location.reload()
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server with ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
    return () => {
      socket.off("serviceUpdated");
    };
  }, [token]);

  // MyService: load user's services
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    const loadMyServices = async () => {
      try {
        const data = await fetchUserServices(token);
        setMyServices(data);
        setMyLoading(false);
      } catch (error) {
        setMyError('Failed to load services');
        setMyLoading(false);
      }
    };
    loadMyServices();
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  });

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      {/* Service List */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Pet Services</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Book grooming, boarding, and training services for your pets
          </p>
        </div>
      </div>

      <div className="mb-8 glass-card dark:glass-card-dark rounded-xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="grooming" className="w-full">
        <TabsContent value="grooming" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterServices(services).map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                isPreview={true}
                onClick={() => handleServiceClick(String(service.id))}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* My Services Section */}
      <div className="container mx-auto py-8 px-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Services</h1>
          <Input
            type="search"
            placeholder="Search services..."
            value={mySearch}
            onChange={(e) => setMySearch(e.target.value)}
          />
        </div>

        <Tabs defaultValue={myView} className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid" onClick={() => setMyView('grid')}>Grid</TabsTrigger>
            <TabsTrigger value="table" onClick={() => setMyView('table')}>Table</TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filterMyServices(myServices).map(service => renderMyServiceCard(service))}
            </div>
          </TabsContent>
          <TabsContent value="table" className="space-y-4">
            {renderMyTableView(filterMyServices(myServices))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Need a Custom Service? section moved here */}
      <div className="mt-12 glass-card dark:glass-card-dark rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Service?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Can't find what you're looking for? Contact us to arrange a custom service tailored to your pet's specific needs.
        </p>
        <Button size="lg">Contact Us</Button>
      </div>
    </div>
  );
};

export default Services;
