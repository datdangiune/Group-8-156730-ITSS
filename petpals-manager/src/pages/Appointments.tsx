
import React, { useState } from 'react';
import { Calendar, Filter, Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppointmentCard, { Appointment, AppointmentStatus } from '@/components/ui/appointment-card';

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    petId: '1',
    petName: 'Buddy',
    date: 'Apr 12, 2024',
    time: '10:30 AM',
    type: 'Annual Checkup',
    reason: 'Routine health examination and vaccinations',
    veterinarian: 'Dr. Smith',
    location: 'Main Pet Clinic',
    status: 'scheduled',
  },
  {
    id: '2',
    petId: '2',
    petName: 'Whiskers',
    date: 'Apr 15, 2024',
    time: '2:15 PM',
    type: 'Dental Cleaning',
    reason: 'Preventative dental care',
    veterinarian: 'Dr. Johnson',
    location: 'Main Pet Clinic',
    status: 'scheduled',
  },
  {
    id: '3',
    petId: '3',
    petName: 'Tweety',
    date: 'Apr 8, 2024',
    time: '11:00 AM',
    type: 'Wing Trimming',
    reason: 'Regular wing maintenance',
    veterinarian: 'Dr. Wilson',
    location: 'Avian Specialists',
    status: 'completed',
  },
  {
    id: '4',
    petId: '4',
    petName: 'Rex',
    date: 'Mar 30, 2024',
    time: '3:45 PM',
    type: 'Vaccination',
    reason: 'Annual rabies vaccine',
    veterinarian: 'Dr. Davis',
    location: 'Main Pet Clinic',
    status: 'completed',
  },
  {
    id: '5',
    petId: '5',
    petName: 'Mittens',
    date: 'Feb 20, 2024',
    time: '1:30 PM',
    type: 'Checkup',
    reason: 'Following up on treatment',
    veterinarian: 'Dr. Smith',
    location: 'Main Pet Clinic',
    status: 'cancelled',
  },
];

const Appointments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AppointmentStatus | 'all'>('all');

  const filterAppointments = (status: AppointmentStatus | 'all') => {
    return mockAppointments.filter(appointment => {
      const matchesSearch = 
        appointment.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = status === 'all' || appointment.status === status;
      
      return matchesSearch && matchesFilter;
    });
  };

  const upcomingAppointments = filterAppointments('scheduled');
  const completedAppointments = filterAppointments('completed');
  const cancelledAppointments = filterAppointments('cancelled');
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
              variant={activeFilter === 'scheduled' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('scheduled')}
              className="whitespace-nowrap"
            >
              Scheduled
            </Button>
            
            <Button
              variant={activeFilter === 'completed' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('completed')}
              className="whitespace-nowrap"
            >
              Completed
            </Button>
            
            <Button
              variant={activeFilter === 'cancelled' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('cancelled')}
              className="whitespace-nowrap"
            >
              Cancelled
            </Button>
            
            <Button
              variant={activeFilter === 'in-progress' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('in-progress')}
              className="whitespace-nowrap"
            >
              In Progress
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All Appointments</TabsTrigger>
        </TabsList>
        
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
            {[...completedAppointments, ...cancelledAppointments].sort((a, b) => {
              // Sort by date in descending order (newest first)
              return new Date(b.date).getTime() - new Date(a.date).getTime();
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
