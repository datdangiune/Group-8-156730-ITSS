import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck, CalendarDays, Clock, DollarSign, Home, MapPin } from 'lucide-react';
import { BoardingService } from '@/types/service';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchBoardingServiceById, BoardingResponse} from '@/service/boarding';
import { getTokenFromCookies } from '@/service/auth';

const BoardingDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<BoardingService[]>([]);
    const [numDays, setNumDays] = useState(1);
    const [selectedPet, setSelectedPet] = useState('');
    const [startDate, setStartDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const token = getTokenFromCookies();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  // Mock pets data for select dropdown
    const pets = [
        { id: 'pet1', name: 'Max' },
        { id: 'pet2', name: 'Bella' },
        { id: 'pet3', name: 'Oliver' }
    ];

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
      const loadServices = async () => {
        try {
          const data: BoardingResponse = await fetchBoardingServiceById(token, id);
          setService(data.boarding);
          setLoading(false);
        } catch (error) {
          setError('Failed to load services');
          setLoading(false);
        }
      };
    
      loadServices(); // Fetch dữ liệu khi component mount
    }, [token, id]);

    useEffect(() => {
        if (service) {
        setTotalPrice(service.pricePerDay * numDays);
        }
    }, [numDays, service]);

    const handleBookNow = () => {
        if (!selectedPet || !startDate) {
        toast.error("Please select a pet and start date");
        return;
        }
        
        setBookingDialogOpen(true);
    };

    const confirmBooking = () => {
        // In a real app, this would be an API call to save the booking
        toast.success("Booking confirmed! Redirecting to payment page...");
        setBookingDialogOpen(false);
        
        // Navigate to payment page with some delay to show the toast
        setTimeout(() => {
        navigate(`/payment/${id}`);
        }, 1500);
    };

    if (!service) {
        return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-pulse w-full max-w-4xl">
            <div className="h-72 bg-muted rounded-lg mb-8"></div>
            <div className="h-10 bg-muted rounded-lg mb-4 w-1/2"></div>
            <div className="h-4 bg-muted rounded-lg mb-2 w-3/4"></div>
            <div className="h-4 bg-muted rounded-lg mb-2 w-2/3"></div>
            </div>
        </div>
        );
    }
    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Image and Details */}
            <div className="lg:col-span-2">
            <div className="mb-6">
                <Button 
                variant="outline"
                onClick={() => navigate(-1)}
                className="mb-4"
                >
                ← Back
                </Button>
                
                {service[0].status && (
                <Badge 
                    variant={service[0].status === 'available' ? 'outline' : 'secondary'}
                    className="ml-2"
                >
                    {service[0].status.charAt(0).toUpperCase() + service[0].status.slice(1)}
                </Badge>
                )}
                
                {isBooked && service[0].paymentStatus && (
                <Badge 
                    variant={service.paymentStatus === 'paid' ? 'default' : 'destructive'}
                    className="ml-2"
                >
                    {service.paymentStatus.charAt(0).toUpperCase() + service.paymentStatus.slice(1)}
                </Badge>
                )}
            </div>
            
            {/* Image */}
            <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-6">
                {service[0].image && (
                <img
                    src={service[0].image}
                    alt={service[0].name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                )}
            </div>
            
            {/* Title and Description */}
            <h1 className="text-3xl font-bold mb-2">{service[0].name}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {service[0].type}
            </p>
            
            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                    <DollarSign className="h-5 w-5 mr-3 text-primary" />
                    <div>
                        <div className="font-medium">Price per day</div>
                        <div className="text-xl font-bold">{service[0].price.toFixed(2)} VNĐ</div>
                    </div>
                    </div>
                </CardContent>
                </Card>
                
                <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                    <Clock className="h-5 w-5 mr-3 text-primary" />
                    <div>
                        <div className="font-medium">Maximum stay</div>
                        <div className="text-xl font-bold">{service[0].maxday}</div>
                    </div>
                    </div>
                </CardContent>
                </Card>
                
                {isBooked && service.date && (
                <Card>
                    <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                        <CalendarDays className="h-5 w-5 mr-3 text-primary" />
                        <div>
                        <div className="font-medium">Booked dates</div>
                        <div className="text-xl font-bold">{service.date}</div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                )}
                
                {isBooked && service.petName && (
                <Card>
                    <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                        <Home className="h-5 w-5 mr-3 text-primary" />
                        <div>
                        <div className="font-medium">Pet</div>
                        <div className="text-xl font-bold">{service.petName}</div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                )}
            </div>
            
            {/* Amenities */}
            {service[0].details && service[0].details.length > 0 && (
                <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Included Amenities</h2>
                <div className="flex flex-wrap gap-3">
                    {service[0]?.details?.map((amenity, index) => (
                    <div key={index} className="flex items-center bg-muted px-3 py-2 rounded-md">
                        <BadgeCheck className="h-4 w-4 mr-2 text-primary" />
                        <span>{amenity}</span>
                    </div>
                    ))}
                </div>
                </div>
            )}
            </div>
            
            {/* Right column: Booking Form or Booking Details */}
            <div>
            <div className="sticky top-24">
                <Card className="w-full">
                <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-6">
                    {isBooked ? 'Booking Details' : 'Book This Service'}
                    </h2>
                    
                    {!isBooked ? (
                    /* Booking Form */
                    <div className="space-y-4">
                        <div>
                        <Label htmlFor="pet">Select Pet</Label>
                        <Select value={selectedPet} onValueChange={setSelectedPet}>
                            <SelectTrigger id="pet" className="w-full">
                            <SelectValue placeholder="Select a pet" />
                            </SelectTrigger>
                            <SelectContent>
                            {pets.map(pet => (
                                <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>
                        
                        <div>
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        </div>
                        
                        <div>
                        <Label htmlFor="days">Number of Days</Label>
                        <Select 
                            value={String(numDays)}
                            onValueChange={(value) => setNumDays(parseInt(value))}
                        >
                            <SelectTrigger id="days" className="w-full">
                            <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                            <SelectContent>
                            {Array.from({length: maxDays}, (_, i) => i + 1).map(num => (
                                <SelectItem key={num} value={String(num)}>{num} {num === 1 ? 'day' : 'days'}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>
                        
                        <div className="pt-4 border-t border-border">
                        <div className="flex justify-between mb-2">
                            <span>Price per day:</span>
                            <span>${service.pricePerDay.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Days:</span>
                            <span>× {numDays}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold mt-4">
                            <span>Total price:</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        </div>
                        
                        <Button 
                        className="w-full mt-4" 
                        size="lg"
                        onClick={handleBookNow}
                        disabled={!selectedPet || !startDate || service.status !== 'available'}
                        >
                        Book Now
                        </Button>
                    </div>
                    ) : (
                    /* Booked Service Details */
                    <div className="space-y-4">
                        <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Pet:</span>
                            <span className="font-medium">{service.petName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Dates:</span>
                            <span className="font-medium">{service.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium">{service.duration}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Price per day:</span>
                            <span className="font-medium">${service.pricePerDay.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-border">
                            <span>Total price:</span>
                            <span>${service.price.toFixed(2)}</span>
                        </div>
                        </div>
                        
                        {service.paymentStatus === 'unpaid' && (
                        <Button 
                            className="w-full mt-4" 
                            size="lg"
                            onClick={() => navigate(`/payment/${service.id}`)}
                        >
                            Pay Now
                        </Button>
                        )}
                    </div>
                    )}
                </CardContent>
                </Card>
            </div>
            </div>
        </div>
        
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirm Your Booking</DialogTitle>
                <DialogDescription>
                Please review the details of your booking below.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{service.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Pet</p>
                    <p className="font-medium">{pets.find(p => p.id === selectedPet)?.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(startDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{numDays} {numDays === 1 ? 'day' : 'days'}</p>
                </div>
                </div>
                <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between font-bold">
                    <span>Total Price:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
                Go Back
                </Button>
                <Button onClick={confirmBooking}>
                Confirm & Proceed to Payment
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </div>
    );
};

export default BoardingDetail;