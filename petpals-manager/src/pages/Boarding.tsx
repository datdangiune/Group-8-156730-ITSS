import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, CalendarDays, Clock, CreditCard, PawPrint, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BoardingService } from '@/types/service';
import BoardingCard from '@/components/ui/boarding-card';
import { fetchBoardingServices, BoardingResponse, fetchUserBoarding, UserBoarding, getPaymentUrl } from '@/service/boarding';
import { getTokenFromCookies } from '@/service/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const Boarding = () => {
  // Boarding Service states
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [boardings, setBoardings] = useState<BoardingService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = getTokenFromCookies();

  // MyBoarding states
  const [mySearch, setMySearch] = useState('');
  const [myView, setMyView] = useState<'grid' | 'table'>('grid');
  const [myBoardings, setMyBoardings] = useState<UserBoarding[]>([]);
  const [myLoading, setMyLoading] = useState<boolean>(true);
  const [myError, setMyError] = useState<string | null>(null);

  // Filter services based on search query
  const filteredServices = boardings.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to service detail page
  const handleServiceClick = (serviceId: string) => {
    navigate(`/boarding/${serviceId}`);
  };

  // MyBoarding logic
  const handleMyBoardingClick = async (boarding: UserBoarding) => {
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

  const getPaymentStatusBadge = (status?: string) => {
    switch (status) {
      case 'paid':
        return <Badge>Paid</Badge>;
      case 'pending':
        return <Badge variant="destructive">Unpaid</Badge>;
      default:
        return null;
    }
  };

  const getBoardingStatusBadge = (serviceStatus: 'In Progress' | 'Completed' | 'Scheduled' | 'Cancelled') => {
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

  const filterMyBoardings = (services: UserBoarding[]) => {
    const searchTerm = mySearch.toLowerCase();
    return services.filter(service => {
      return (
        service?.boarding?.name.toLowerCase().includes(searchTerm)
      );
    });
  };

  const renderMyBoardingCard = (service: UserBoarding) => (
    <Card
      key={service.id}
      className={cn(
        "overflow-hidden",
        service.status_payment === 'pending' && "cursor-pointer hover:shadow-md"
      )}
      onClick={() => service.status_payment === 'pending' && handleMyBoardingClick(service)}
    >
      <CardHeader>
        <CardTitle className="flex items-center">
          {service.boarding.name}
          <div className="ml-auto">{getBoardingStatusBadge(service.status)}</div>
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
              handleMyBoardingClick(service);
            }}
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  const renderMyBoardingTableView = (services: UserBoarding[]) => (
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
            onClick={() => service.status_payment === 'pending' && handleMyBoardingClick(service)}
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
                    handleMyBoardingClick(service);
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

  // Fetch boarding services
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    const loadServices = async () => {
      try {
        const data: BoardingResponse = await fetchBoardingServices(token);
        setBoardings(data.boarding);
        setLoading(false);
      } catch (error) {
        setError('Failed to load services');
        setLoading(false);
      }
    };
    loadServices();
  }, [token]);

  // Fetch my boardings
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    const loadMyBoardings = async () => {
      try {
        const data = await fetchUserBoarding(token);
        setMyBoardings(data);
        setMyLoading(false);
      } catch (error) {
        setMyError('Failed to load my boardings');
        setMyLoading(false);
      }
    };
    loadMyBoardings();
  }, [token]);

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      {/* Boarding Service List */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Pet Boarding Services</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the perfect accommodation for your pet while you're away
          </p>
        </div>
      </div>
      <div className="mb-8 glass-card dark:glass-card-dark rounded-xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search boarding options, amenities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredServices.map((service, i) => (
          <BoardingCard
            key={i}
            service={service}
            isPreview={true}
            onClick={() => handleServiceClick(String(service.id))}
          />
        ))}
      </div>
      {/* MyBoarding Section */}
      <div className="container mx-auto py-8 px-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Boardings</h1>
          <Input
            type="search"
            placeholder="Search boarding..."
            value={mySearch}
            onChange={(e) => setMySearch(e.target.value)}
          />
        </div>
        {myBoardings.length === 0 ? (
          <div className="text-center text-muted-foreground text-lg py-10">
            You haven’t registered any boarding services yet.
          </div>
        ) : (
          <Tabs defaultValue={myView} className="space-y-4">
            <TabsList>
              <TabsTrigger value="grid" onClick={() => setMyView('grid')}>Grid</TabsTrigger>
              <TabsTrigger value="table" onClick={() => setMyView('table')}>Table</TabsTrigger>
            </TabsList>
            <TabsContent value="grid" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filterMyBoardings(myBoardings).map(service => renderMyBoardingCard(service))}
              </div>
            </TabsContent>
            <TabsContent value="table" className="space-y-4">
              {renderMyBoardingTableView(filterMyBoardings(myBoardings))}
            </TabsContent>
          </Tabs>
        )}
      </div>
      <div className="mt-12 glass-card dark:glass-card-dark rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Boarding Solution?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Have specific requirements for your pet's stay? Contact us to discuss custom boarding arrangements tailored to your pet's needs.
        </p>
        <Button size="lg">Contact Us</Button>
      </div>
    </div>
  );
};

export default Boarding;