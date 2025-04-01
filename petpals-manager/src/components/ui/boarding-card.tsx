
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, CalendarDays, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BoardingService, ServiceStatus } from '@/types/service';

interface BoardingCardProps {
  service: BoardingService;
  isPreview?: boolean;
  onClick?: () => void;
  className?: string;
  isBooked?: boolean;
}

const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case 'available':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'unavailable':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

const getPaymentStatusColor = (paymentStatus?: string) => {
  switch (paymentStatus) {
    case 'paid':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'unpaid':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

const BoardingCard: React.FC<BoardingCardProps> = ({ 
  service, 
  isPreview = false, 
  onClick, 
  className,
  isBooked = false 
}) => {
  const isPayable = service.status === 'unpaid' && isBooked;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300",
        isPreview || isPayable ? "hover:shadow-md" : "",
        isPayable ? "cursor-pointer hover:ring-1 hover:ring-primary" : "",
        className
      )}
      onClick={isPayable || isPreview ? onClick : undefined}
    >
      {service.image && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-semibold">{service.name}</CardTitle>
          {!isPreview && (
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              getStatusColor(service.status)
            )}>
              {service.status.charAt(0).toUpperCase() + service.status.slice(1).replace('-', ' ')}
            </div>
          )}
          {isBooked && service.status && (
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium ml-2",
              getPaymentStatusColor(service.paymentStatus)
            )}>
              {service.paymentStatus.charAt(0).toUpperCase() + service.paymentStatus.slice(1)}
            </div>
          )}
        </div>
        {!isPreview && service.petName && (
          <CardDescription>For {service.petName}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {service.type && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {service.type}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>Price per day:</span>
            </div>
            <span className="font-medium">{service.price.toFixed(2)} VNĐ</span>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Max stay:</span>
            </div>
            <span>{service.maxday}</span>
          </div>
          
          {isBooked && service.date && (
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>Booked for:</span>
              </div>
              <span>{service.date}</span>
            </div>
          )}
        </div>
        
        {service.details && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Amenities:</p>
            <div className="flex flex-wrap gap-2">
              {service?.details?.map((amenity, index) => (
                <div key={index} className="flex items-center text-xs bg-muted px-2 py-1 rounded-md">
                  <BadgeCheck className="h-3 w-3 mr-1 text-primary" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {isPreview && (
        <CardFooter>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }} 
            className="w-full"
          >
            View Details
          </Button>
        </CardFooter>
      )}
      
      {isBooked && service.paymentStatus === 'unpaid' && (
        <CardFooter>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }} 
            className="w-full"
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BoardingCard;