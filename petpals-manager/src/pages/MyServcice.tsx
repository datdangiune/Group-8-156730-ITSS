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
import { ServiceType, ServiceStatusUser} from '@/types/service';
import { cn } from '@/lib/utils';
import { CalendarDays, Clock, CreditCard, Package, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { fetchUserServices, UserService, getPaymentUrl as getServicePaymentUrl } from "@/service/service";
import { fetchUserBoarding, UserBoarding, getPaymentUrl as getBoardingPaymentUrl } from "@/service/boarding";
import { getTokenFromCookies } from '@/service/auth';
import { toast } from "@/components/ui/use-toast";

const MyServices = () => {
  const [search, setSearch] = useState('');
  const [serviceView, setServiceView] = useState<'grid' | 'table'>('grid');
  const [boardingView, setBoardingView] = useState<'grid' | 'table'>('grid');
  const navigate = useNavigate();
  const [services, setServices] = useState<UserService[]>([]);
  const [boardings, setBoardings] = useState<UserBoarding[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = getTokenFromCookies();

  const handleServiceClick = async (service: UserService) => {
    if (service.status === 'Scheduled') {
      // Navigate to payment page for the service
      const paymentUrl = await getServicePaymentUrl(service.id, token);
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

  // Boarding logic
  const handleBoardingClick = async (boarding: UserBoarding) => {
    if (boarding.status === 'Scheduled' && boarding.status_payment === 'pending') {
      const paymentUrl = await getBoardingPaymentUrl(boarding.id, token);
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast({
          title: "Error",
          description: "Boarding tạm không phục vụ",
          variant: "destructive",
          className: "text-lg p-6",
        });
      }
    }
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

  const getServiceStatusBadge = (serviceStatus:'In Progress' | 'Completed' | 'Scheduled' | 'Cancelled') => {
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

  const getBoardingStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-100 text-orange-700">In Progress</Badge>;
      case 'Scheduled':
        return <Badge className="bg-gray-100 text-blue-700">Scheduled</Badge>;
      case 'Cancelled':
        return <Badge className="bg-gray-100 text-blue-700">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getBoardingPaymentStatusBadge = (status: string) => {
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

  // Filter and sort unpaid first
  const sortUnpaidFirst = <T extends { status_payment: string }>(arr: T[]) =>
    [...arr].sort((a, b) => {
      if (a.status_payment === 'pending' && b.status_payment !== 'pending') return -1;
      if (a.status_payment !== 'pending' && b.status_payment === 'pending') return 1;
      return 0;
    });

  const filterBySearch = (arr: any[], search: string, isBoarding = false) => {
    const searchTerm = search.toLowerCase();
    return arr.filter(item => {
      if (isBoarding) {
        return (
          item?.boarding?.name.toLowerCase().includes(searchTerm) ||
          (item.boarding.details?.amenities?.join(' ') || '').toLowerCase().includes(searchTerm)
        );
      }
      return (
        item?.service?.name.toLowerCase().includes(searchTerm) ||
        item.service.description.toLowerCase().includes(searchTerm)
      );
    });
  };

  const renderServiceCard = (service: UserService) => (
    <Card 
      key={service.id} 
      className={cn(
        "overflow-hidden",
        service.status === 'In Progress' && "cursor-pointer hover:shadow-md"
      )}
      onClick={() => service.status === 'In Progress' && handleServiceClick(service)}
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
            className={service.status === 'In Progress' ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" : ""}
            onClick={() => service.status === 'In Progress' && handleServiceClick(service)}
          >
            <TableCell className="font-medium">{service.service.name}</TableCell>
            <TableCell className="flex items-center">{getServiceTypeIcon(service.service.type)} {service.service.type}</TableCell>
            <TableCell>{service.pet.name}</TableCell>
            <TableCell>{service.date ? new Date(service.date).toLocaleDateString() : 'Not scheduled'}</TableCell>
            <TableCell>{service.hour || 'Not scheduled'}</TableCell>
            <TableCell>{getServiceStatusBadge(service.status)}</TableCell>
            <TableCell>{getPaymentStatusBadge(service.status_payment)}</TableCell>
            <TableCell>
              {service.status === 'Scheduled' && service.status_payment === 'pending'&& (
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

  const renderBoardingCard = (boarding: UserBoarding) => (
    <Card
      key={boarding.id}
      className={cn(
        "overflow-hidden",
        boarding.status === 'In Progress' && "cursor-pointer hover:shadow-md"
      )}
      onClick={() => boarding.status === 'In Progress' && handleBoardingClick(boarding)}
    >
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-4 w-4 mr-2" />
          {boarding.boarding.name}
          <div className='ml-auto'>{getBoardingStatusBadge(boarding.status)}</div>
        </CardTitle>
        <CardDescription>
          {boarding.boarding.details?.amenities?.join(', ')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>
            {boarding.start_date} - {boarding.end_date}
          </span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CreditCard className="h-4 w-4 mr-2" />
          <span>Pet: {boarding.pet.name}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Total: {boarding.total_price}₫</span>
        </div>
        {getBoardingPaymentStatusBadge(boarding.status_payment)}
      </CardContent>
      {boarding.status === 'Scheduled' && boarding.status_payment === 'pending' && (
        <CardFooter className="pt-0">
          <Button
            className="w-full"
            onClick={e => {
              e.stopPropagation();
              handleBoardingClick(boarding);
            }}
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  const renderBoardingTableView = (boardings: UserBoarding[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Pet</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {boardings.map((boarding) => (
          <TableRow
            key={boarding.id}
            className={boarding.status === 'In Progress' ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" : ""}
            onClick={() => boarding.status === 'In Progress' && handleBoardingClick(boarding)}
          >
            <TableCell className="font-medium">{boarding.boarding.name}</TableCell>
            <TableCell>{boarding.pet.name}</TableCell>
            <TableCell>{boarding.start_date}</TableCell>
            <TableCell>{boarding.end_date}</TableCell>
            <TableCell>{getBoardingStatusBadge(boarding.status)}</TableCell>
            <TableCell>{getBoardingPaymentStatusBadge(boarding.status_payment)}</TableCell>
            <TableCell>{boarding.total_price}₫</TableCell>
            <TableCell>
              {boarding.status === 'Scheduled' && boarding.status_payment === 'pending' && (
                <Button
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    handleBoardingClick(boarding);
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
    if (!token) {
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
    const loadBoardings = async () => {
      try {
        const data = await fetchUserBoarding(token);
        setBoardings(data);
      } catch (error) {
        // handle error if needed
      }
    };
    loadServices();
    loadBoardings();
  }, [token]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* My Services */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Services</h1>
          <Input
            type="search"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Tabs defaultValue={serviceView} className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid" onClick={() => setServiceView('grid')}>Grid</TabsTrigger>
            <TabsTrigger value="table" onClick={() => setServiceView('table')}>Table</TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortUnpaidFirst(filterBySearch(services, search)).map(service => renderServiceCard(service))}
            </div>
          </TabsContent>
          <TabsContent value="table" className="space-y-4">
            {renderTableView(sortUnpaidFirst(filterBySearch(services, search)))}
          </TabsContent>
        </Tabs>
      </div>
      {/* My Boarding */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Boarding</h1>
          <Input
            type="search"
            placeholder="Search boarding..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Tabs defaultValue={boardingView} className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid" onClick={() => setBoardingView('grid')}>Grid</TabsTrigger>
            <TabsTrigger value="table" onClick={() => setBoardingView('table')}>Table</TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortUnpaidFirst(filterBySearch(boardings, search, true)).map(boarding => renderBoardingCard(boarding))}
            </div>
          </TabsContent>
          <TabsContent value="table" className="space-y-4">
            {renderBoardingTableView(sortUnpaidFirst(filterBySearch(boardings, search, true)))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyServices;