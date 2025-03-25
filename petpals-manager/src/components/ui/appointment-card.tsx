
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'in-progress';

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  date: string;
  time: string;
  type: string;
  reason: string;
  veterinarian?: string;
  location?: string;
  status: AppointmentStatus;
}

interface AppointmentCardProps {
  appointment: Appointment;
  className?: string;
}

const getStatusColor = (status: AppointmentStatus) => {
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

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, className }) => {
  return (
    <div 
      className={cn(
        "glass-card dark:glass-card-dark rounded-xl p-5 transition-all duration-300 hover-elevate",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{appointment.type}</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">For {appointment.petName}</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          getStatusColor(appointment.status)
        )}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
        </div>
      </div>
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{appointment.date}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{appointment.time}</span>
        </div>
        
        {appointment.location && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{appointment.location}</span>
          </div>
        )}
      </div>
      
      {appointment.reason && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Reason:</span> {appointment.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
