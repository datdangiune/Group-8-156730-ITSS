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
import { BoardingStatusUser } from '@/types/boarding';
import { cn } from '@/lib/utils';
import { CalendarDays, Clock, CreditCard, PawPrint, DollarSign } from 'lucide-react';
import {fetchUserBoarding, UserBoarding} from '@/service/boarding'
import { getTokenFromCookies } from '@/service/auth';
// Mock services data - in a real app, this would come from an API
import { getPaymentUrl } from '@/service/boarding';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';


const MyBoarding = () => {
    const [search, setSearch] = useState('');
    const [view, setView] = useState<'grid' | 'table'>('grid');
    const navigate = useNavigate();
    const [services, setServices] = useState<UserBoarding[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    const token = getTokenFromCookies();
    const handleServiceClick = async (boarding: UserBoarding) => {
        if (boarding.status_payment === 'pending') {
                  const paymentUrl = await getPaymentUrl(boarding.id, token);
                  if (paymentUrl) {
                    window.location.href = paymentUrl;
                  } else {
                    alert('Không lấy được link thanh toán.');
                  }
        }
    };
    const formatToVietnamTime = (dateStr: string) => {
      const timezone = 'Asia/Ho_Chi_Minh';
      const date = new Date(dateStr);
      const zonedDate = toZonedTime(date, timezone);
      return format(zonedDate, 'dd/MM/yyyy HH:mm');
    };
  const getPaymentStatusBadge = (status?: BoardingStatusUser) => {
    switch (status) {
      case 'paid':
        return <Badge>Paid</Badge>;
      case 'pending':
        return <Badge variant="destructive">Unpaid</Badge>;
      default:
        return null;
    }
  };

  const filterBySearch = (services: UserBoarding[]) => {
    const searchTerm = search.toLowerCase();
    return services.filter(service => {
      return (
        service?.boarding?.name.toLowerCase().includes(searchTerm) 
      );
    });
  };

  const renderServiceCard = (service: UserBoarding) => (
    <Card 
      key={service.id} 
      className={cn(
        "overflow-hidden",
        service.status_payment === 'pending' && "cursor-pointer hover:shadow-md"
      )}
      onClick={() => service.status_payment === 'pending' && handleServiceClick(service)}
    >
      <CardHeader>
        <CardTitle className="flex items-center">
          {service.boarding.name}
        </CardTitle>
        <CardDescription>{service.boarding.type}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {service.start_date && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>{formatToVietnamTime(service.start_date)}</span>
          </div>
        )}
        {service.end_date && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>{formatToVietnamTime(service.end_date)}</span>
          </div>
        )}
        {service.boarding.type && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{service?.boarding?.maxday}</span>
          </div>
        )}
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <div className="flex items-center">
            <PawPrint className="h-4 w-4 mr-2" />
            <span>Pet: {service.pet.name}</span>
        </div>
        <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>Total Price: {service.total_price}VNĐ</span>
        </div>
        </div>

        {getPaymentStatusBadge(service.status_payment)}
      </CardContent>
      {service.status_payment === 'pending' && (
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

  const renderTableView = (services: UserBoarding[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Pet</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Notes </TableHead>
          <TableHead>Total price</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow 
            key={service.id}
            className={service.status_payment === 'pending' ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" : ""}
            onClick={() => service.status_payment === 'pending' && handleServiceClick(service)}
          >
            <TableCell className="font-medium">{service.boarding.name}</TableCell>
            <TableCell className="flex items-center">{service.boarding.type}</TableCell>
            <TableCell>{service.pet.name}</TableCell>
            <TableCell>{service.start_date ? new Date(service.start_date).toLocaleDateString() : 'Not scheduled'}</TableCell>
            <TableCell>{service.end_date ? new Date(service.end_date).toLocaleDateString() : 'Not scheduled'}</TableCell>
            <TableCell>{service.notes}</TableCell>
            <TableCell>{service.total_price}</TableCell>
            <TableCell>{getPaymentStatusBadge(service.status_payment)}</TableCell>
            <TableCell>
              {service.status_payment === 'pending' && (
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
            const status = "";
          try {
            const data = await fetchUserBoarding(token, status);
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
        <h1 className="text-2xl font-bold">My Boardings</h1>
        <Input
          type="search"
          placeholder="Search boarding..."
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

export default MyBoarding;