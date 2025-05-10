import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Service, ServiceType, ServiceStatusUser, PaymentStatus} from '@/types/service';
import { cn } from '@/lib/utils';
import { CalendarDays, Clock, CreditCard, Package, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import {fetchUserServices, UserService} from "@/service/service"
import { getTokenFromCookies } from '@/service/auth';
// Mock services data - in a real app, this would come from an API
import { getPaymentUrl } from '@/service/service';
import { toast } from "@/components/ui/use-toast";

const MyServices = () => {
    const [search, setSearch] = useState('');
    const [view, setView] = useState<'grid' | 'table'>('grid');
    const navigate = useNavigate();
    const [services, setServices] = useState<UserService[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const token = getTokenFromCookies();
    const handleServiceClick = async (service: UserService) => {
        if (service.status === 'In Progess') {
        // Navigate to payment page for the service
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
        // Do nothing for paid services as they should remain static
    };

  const getServiceTypeIcon = (type: ServiceType) => {
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

const getServiceStatusBadge = (serviceStatus: 'available' | 'unavailable' | string) => {
  switch (serviceStatus) {
    case 'available':
      return <Badge className="bg-green-100 text-green-700">Available</Badge>;
    case 'unavailable':
      return <Badge className="bg-red-100 text-red-700">Unavailable</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
  }
};



  const getPaymentStatusBadge = (status?: ServiceStatusUser) => {
    switch (status) {
      case 'Complete':
        return <Badge>Paid</Badge>;
      case 'In Progess':
        return <Badge variant="destructive">Unpaid</Badge>;
      default:
        return null;
    }
  };

  const filterBySearch = (services: UserService[]) => {
    const searchTerm = search.toLowerCase();
    return services.filter(service => {
      return (
        service?.service?.name.toLowerCase().includes(searchTerm) ||
        service.service.description.toLowerCase().includes(searchTerm)
      );
    });
  };

  const renderServiceCard = (service: UserService) => (
    <Card 
      key={service.id} 
      className={cn(
        "overflow-hidden",
        service.status === 'In Progess' && "cursor-pointer hover:shadow-md"
      )}
      onClick={() => service.status === 'In Progess' && handleServiceClick(service)}
    >
      <CardHeader>
        <CardTitle className="flex items-center">
          {getServiceTypeIcon(service.service.type)}
          {service.service.name}
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
        {getPaymentStatusBadge(service.status)}
      </CardContent>
      {service.status === 'In Progess' && (
        <CardFooter className="pt-0">
          <Button 
            className="w-full" 
            onClick={(e) => {
              e.stopPropagation();
              handleServiceClick(service);
            }}
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  const renderTableView = (services: UserService[]) => (
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
            className={service.status === 'In Progess' ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" : ""}
            onClick={() => service.status === 'In Progess' && handleServiceClick(service)}
          >
            <TableCell className="font-medium">{service.service.name}</TableCell>
            <TableCell className="flex items-center">{getServiceTypeIcon(service.service.type)} {service.service.type}</TableCell>
            <TableCell>{service.pet.name}</TableCell>
            <TableCell>{service.date ? new Date(service.date).toLocaleDateString() : 'Not scheduled'}</TableCell>
            <TableCell>{service.hour || 'Not scheduled'}</TableCell>
            <TableCell>{getServiceStatusBadge(service.service.status)}</TableCell>
            <TableCell>{getPaymentStatusBadge(service.status)}</TableCell>
            <TableCell>
              {service.status === 'In Progess' && (
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceClick(service);
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

    const filteredServices = filterBySearch(services);
    useEffect(() => {
        if(!token){
            navigate('/login');
        }
        const loadServices = async () => {
          try {
            const data = await fetchUserServices(token);
            setServices(data); 
            setLoading(false); 
          } catch (error) {
            setError('Failed to load services');
            setLoading(false); 
          }
        };
    
        loadServices(); // Gọi hàm loadServices khi component mount
    }, [token]); 
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Services</h1>
        <Input
          type="search"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue={view} className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid" onClick={() => setView('grid')}>Grid</TabsTrigger>
          <TabsTrigger value="table" onClick={() => setView('table')}>Table</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredServices.map(service => renderServiceCard(service))}
          </div>
        </TabsContent>
        <TabsContent value="table" className="space-y-4">
          {renderTableView(filteredServices)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyServices;