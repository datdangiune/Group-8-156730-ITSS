import React from 'react';
import { Clock, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ServiceType = 'grooming' | 'boarding' | 'training' ;
export type ServiceStatus = 'available' | 'unavailable' ;

export interface Service {
    id: number;
    type: 'boarding' | 'grooming' | 'training';
    name: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    status: 'available' | 'unavailable';
    details: ServiceDetail;
  }
  export interface ServiceDetail {
    included: string[];
  }
  interface ServiceCardProps {
    service: Service;
    userServiceStatus?: string; // Trạng thái đặt lịch
    isPreview?: boolean;
    onClick?: () => void;
    className?: string;
  }
  

const getStatusColor = (status?: string) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  
  switch (status.toLowerCase()) {
    case 'available':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'unavailable':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  userServiceStatus,
  isPreview = false, 
  onClick, 
  className 
}) => {
  const statusText = userServiceStatus || service.status;
  
  return (
    <div 
      className={cn(
        "glass-card dark:glass-card-dark rounded-xl overflow-hidden transition-all duration-300",
        isPreview ? "hover:shadow-md cursor-pointer" : "hover-elevate",
        className
      )}
      onClick={isPreview && onClick ? onClick : undefined}
    >
      {service.image && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onLoad={(e) => {
              const target = e.target as HTMLImageElement;
              target.classList.add('loaded');
              target.classList.remove('loading');
            }}
            loading="lazy"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{service.name}</h3>
          {!isPreview && (
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              getStatusColor(statusText)
            )}>
              {statusText?.charAt(0).toUpperCase() + statusText?.slice(1).replace('-', ' ') || 'Unknown'}
            </div>
          )}
        </div>
        
        {service.description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {service.description}
          </p>
        )}
        
        <div className="mt-4 space-y-2 text-sm">
          {service.duration && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Duration: {service.duration}</span>
            </div>
          )}
          
          {service.price !== undefined && (
            <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
              <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>${service.price.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
