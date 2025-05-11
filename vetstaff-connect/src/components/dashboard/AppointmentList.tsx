import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";

interface AppointmentProps {
  id: number;
  appointment_type: string;
  appointment_date: string;
  appointment_hour: string;
  reason: string;
  appointment_status: "Done" | "Scheduled" | "Cancel" | "In Progress" ;
  pet: {
    id: number;
    name: string;
    breed: string;
    age: number;
  };
  owner: {
    id: number;
    username: string;
    email: string;
  };
}

interface AppointmentListProps {
  appointments: AppointmentProps[] | undefined; // Allow undefined to handle edge cases
  className?: string;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  className,
}) => {
  const navigate = useNavigate();

  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/appointments/${appointmentId}`);
  };

  // Get initials from pet name
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Generate avatar fallback background color based on pet name
  const getAvatarColor = (name: string | undefined) => {
    if (!name) return "bg-gray-100 text-gray-600"; // Fallback color if name is undefined
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-red-100 text-red-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!appointments || !Array.isArray(appointments) || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="font-medium">No appointments</h3>
        <p className="text-sm text-muted-foreground mt-1">
          There are no appointments scheduled for this period.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("divide-y", className)}>
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors cursor-pointer"
          onClick={() => handleAppointmentClick(appointment.id)}
        >
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src={null} alt={appointment.pet.name} />
              <AvatarFallback className={getAvatarColor(appointment.pet.name)}>
                {getInitials(appointment.pet.name || "N/A")} {/* Fallback to "N/A" if pet name is undefined */}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center">
                <p className="font-medium">{appointment.pet.name}</p>
                <span className="mx-1 text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">
                  {appointment.pet.breed}, {appointment.pet.age} years
                </p>
              </div>

              <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                <p>{appointment.owner.username}</p>
                <span className="mx-1">•</span>
                <p>{appointment.reason}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center text-sm font-medium">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                {new Date(appointment.appointment_date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                {appointment.appointment_hour}
              </div>
            </div>

           <StatusBadge status={appointment.appointment_status}/>

          </div>
        </div>
      ))}

      <div className="p-4 text-center">
        <Button variant="outline" onClick={() => navigate("/appointments")}>
          View all appointments
        </Button>
      </div>
    </div>
  );
};

export default AppointmentList;
