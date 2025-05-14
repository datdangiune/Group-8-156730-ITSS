import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, Check, Users, Stethoscope } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import StatCard from '@/components/StatCard';
import AppointmentList, { Appointment as AppointmentListType } from '@/components/AppointmentList';
import { fetchAppointmentsMockFormat, AppointmentItem } from '@/service/appointment';

const Appointments = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAppointmentsMockFormat();
        setAppointments(data);
      } catch (error: any) {
        // Handle error (toast, etc.)
      }
    };
    fetchData();
  }, []);

  // Filter appointments based on selected date
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate);
    return (
      appointmentDate.getFullYear() === date.getFullYear() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getDate() === date.getDate()
    );
  });

  // Get completed appointments
  const completedAppointments = filteredAppointments.filter(
    appointment => appointment.status === 'Done'
  );

  // Get scheduled appointments (not completed)
  const scheduledAppointments = filteredAppointments.filter(
    appointment => appointment.status !== 'Done'
  );

  // Convert AppointmentItem[] to AppointmentListType[] for AppointmentList
  const mapToAppointmentListType = (items: AppointmentItem[]): AppointmentListType[] =>
    items.map(item => ({
      id: item.id,
      petName: item.petName,
      petType: item.petType,
      ownerName: item.ownerName,
      appointmentType: item.appointmentType,
      appointmentDate: item.appointmentDate, // string, handled in AppointmentList
      reason: item.reason,
      status: item.status,
    }));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">
              Manage and schedule appointments for your patients
            </p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Appointments"
            value={filteredAppointments.length}
            icon={<Stethoscope className="h-5 w-5 text-vetblue-600" />}
            className="bg-vetblue-50 border-vetblue-200"
          />
          <StatCard
            title="Completed Appointments"
            value={completedAppointments.length}
            icon={<Check className="h-5 w-5 text-vetgreen-600" />}
            className="bg-vetgreen-50 border-vetgreen-200"
          />
          <StatCard
            title="Appointment Types"
            value={Array.from(new Set(filteredAppointments.map(a => a.appointmentType))).length}
            icon={<Stethoscope className="h-5 w-5 text-vetblue-600" />}
            className="bg-vetblue-50 border-vetblue-200"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          {/* Scheduled Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Appointments</CardTitle>
              <CardDescription>
                Appointments scheduled for {format(date, 'MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentList 
                appointments={mapToAppointmentListType(scheduledAppointments)}
                emptyMessage="No scheduled appointments for this date"
              />
            </CardContent>
          </Card>

          {/* Completed Appointments */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Completed Appointments</CardTitle>
              <CardDescription>
                Appointments completed on {format(date, 'MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentList 
                appointments={mapToAppointmentListType(completedAppointments)}
                emptyMessage="No completed appointments for this date"
                showStatus={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
