
import React from 'react';
import { Clock, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ServiceType = 'grooming' | 'boarding' | 'training' | 'daycare' | 'other';
export type ServiceStatus = 'scheduled' | 'completed' | 'cancelled' | 'in-progress';

export interface Service {
  id: string;
  petId: string;
  petName: string;
  type: ServiceType;
  name: string;
  description?: string;
  date: string;
  time?: string;
  duration?: string;
  price?: number;
  status: ServiceStatus;
  image?: string;
}

interface ServiceCardProps {
  service: Service;
  isPreview?: boolean;
  onClick?: () => void;
  className?: string;
}

const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'in-progress':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  isPreview = false, 
  onClick, 
  className 
}) => {
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
              getStatusColor(service.status)
            )}>
              {service.status.charAt(0).toUpperCase() + service.status.slice(1).replace('-', ' ')}
            </div>
          )}
        </div>
        
        {!isPreview && service.petName && (
          <p className="text-sm text-gray-600 dark:text-gray-400">For {service.petName}</p>
        )}
        
        {service.description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {service.description}
          </p>
        )}
        
        <div className="mt-4 space-y-2 text-sm">
          {!isPreview && service.date && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{service.date}</span>
            </div>
          )}
          
          {!isPreview && service.time && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{service.time}</span>
            </div>
          )}
          
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
