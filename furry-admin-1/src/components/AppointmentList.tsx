import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export interface Appointment {
  id: string;
  petName: string;
  petType: string;
  ownerName: string;
  appointmentType: string;
  appointmentDate: Date | string;
  reason: string;
  status: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  emptyMessage?: string;
  showStatus?: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  emptyMessage = "No appointments available",
  showStatus = true,
}) => {
  // Always render table header, even if no data
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pet</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Reason</TableHead>
          {showStatus && <TableHead>Status</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {(!appointments || appointments.length === 0) ? (
          <TableRow>
            <TableCell colSpan={showStatus ? 6 : 5} className="text-center py-6 text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          appointments.map((appointment) => {
            // Defensive: handle string or Date for appointmentDate
            let dateObj: Date | null = null;
            if (appointment.appointmentDate instanceof Date) {
              dateObj = appointment.appointmentDate;
            } else if (typeof appointment.appointmentDate === "string") {
              const parsed = Date.parse(appointment.appointmentDate);
              dateObj = isNaN(parsed) ? null : new Date(parsed);
            }
            return (
              <TableRow key={appointment.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{appointment.petName || <span className="text-muted-foreground">—</span>}</div>
                    <div className="text-sm text-muted-foreground">{appointment.petType || <span className="text-muted-foreground">—</span>}</div>
                  </div>
                </TableCell>
                <TableCell>{appointment.ownerName || <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell>{appointment.appointmentType || <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {dateObj && !isNaN(dateObj.getTime()) ? (
                      <span>{format(dateObj, 'h:mm a')}</span>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{appointment.reason || <span className="text-muted-foreground">—</span>}</TableCell>
                {showStatus && (
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        appointment.status === 'Done'
                          ? "bg-vetgreen-50 text-vetgreen-600 border-vetgreen-200"
                          : "bg-vetblue-50 text-vetblue-600 border-vetblue-200"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default AppointmentList;
