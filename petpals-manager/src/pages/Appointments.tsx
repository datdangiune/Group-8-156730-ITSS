
import React, { useState, useEffect} from 'react';
import { Calendar, Filter, Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppointmentCard, { Appointment, AppointmentStatus } from '@/components/ui/appointment-card';
import { fetchUserAppointments } from '@/service/appointment';
import { getTokenFromCookies } from '@/service/auth';

const Appointments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AppointmentStatus | 'all'>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = getTokenFromCookies();
  const filterAppointments = (status: AppointmentStatus | 'all') => {
    return appointments.filter(appointment => {
      const matchesSearch = 
        appointment.pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.appointment_type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = status === 'all' || appointment.appointment_status === status;
      
      return matchesSearch && matchesFilter;
    });
  };
  useEffect(() => {
    const getAppointments = async () => {
      try {
        const data = await fetchUserAppointments(token);
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, [token]);

  const upcomingAppointments = filterAppointments('Scheduled');
  const DoneAppointments = filterAppointments('Done');
  const CancelAppointments = filterAppointments('Cancel');

  
  const allAppointments = filterAppointments(activeFilter);

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all your pet appointments
          </p>
        </div>
        
        <Button asChild className="flex items-center gap-2">
          <a href="/appointments/book">
            <PlusCircle className="h-5 w-5" />
            Book New Appointment
          </a>
        </Button>
      </div>
      
      <div className="mb-8 glass-card dark:glass-card-dark rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by pet name or appointment type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex overflow-x-auto gap-2 py-1 md:py-0">
            <div className="flex items-center mr-2">
              <Filter className="h-4 w-4 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
            </div>
            
            <Button
              variant={activeFilter === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('all')}
              className="whitespace-nowrap"
            >
              All
            </Button>
            
            <Button
              variant={activeFilter === 'Scheduled' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('Scheduled')}
              className="whitespace-nowrap"
            >
              Scheduled
            </Button>
            
            <Button
              variant={activeFilter === 'Done' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('Done')}
              className="whitespace-nowrap"
            >
              Done
            </Button>
            
            <Button
              variant={activeFilter === 'Cancel' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('Cancel')}
              className="whitespace-nowrap"
            >
              Cancel
            </Button>
            
            <Button
              variant={activeFilter === 'In progess' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('In progess')}
              className="whitespace-nowrap"
            >
              In Progress
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        {/* <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="all">All Appointments</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList> */}
        
        <TabsContent value="upcoming" className="animate-fade-in">
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <div className="glass-card dark:glass-card-dark rounded-xl p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You don't have any upcoming appointments.
              </p>
              <Button asChild>
                <a href="/appointments/book">Book an appointment</a>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...DoneAppointments, ...CancelAppointments].sort((a, b) => {
              // Sort by date in descending order (newest first)
              return new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime();
            }).map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="animate-fade-in">
          {allAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <div className="glass-card dark:glass-card-dark rounded-xl p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No appointments found matching your search criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mr-4"
              >
                Clear filters
              </Button>
              <Button asChild>
                <a href="/appointments/book">Book an appointment</a>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
