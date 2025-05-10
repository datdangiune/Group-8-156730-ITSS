
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
export type AppointmentStatus = 'Scheduled' | 'Done' | 'Cancel' | 'In progess';
interface Pet {
  id: number;
  name: string;
}
export interface Appointment {
    id: number;
    appointment_type: string;
    pet_id: number;
    owner_id: number;
    appointment_date: string; // Dạng "YYYY-MM-DDTHH:mm:ss.sssZ"
    appointment_hour: string; // Dạng "HH:mm"
    reason?: string;
    pet: Pet;
    appointment_status: AppointmentStatus;
  }
interface AppointmentCardProps {
  appointment: Appointment;
  className?: string;
}

const getStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case 'Scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'Done':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'Cancel':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'In progess':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, className }) => {
  return (
    <Link to={`/appointments/${appointment.id}`}
      className="block no-underline">
    <div 
      className={cn(
        "glass-card dark:glass-card-dark rounded-xl p-5 transition-all duration-300 hover-elevate",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{appointment.appointment_type}</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">For {appointment.pet?.name}</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          getStatusColor(appointment.appointment_status || "Scheduled") // Cung cấp giá trị mặc định
        )}>
          {appointment.appointment_status
            ? appointment.appointment_status.charAt(0).toUpperCase() + appointment.appointment_status.slice(1).replace('-', ' ')
            : "Unknown"} {/* Hiển thị "Unknown" nếu status bị undefined */}
        </div>

      </div>
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{appointment.appointment_date}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{appointment.appointment_hour}</span>
        </div>
        
      </div>
      
      {appointment.reason && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Reason:</span> {appointment.reason}
          </p>
        </div>
      )}
    </div>
    </Link>
  );
};

export default AppointmentCard;
