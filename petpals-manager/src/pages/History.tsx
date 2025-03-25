
import React, { useState } from 'react';
import { Filter, Search, Calendar, Scissors, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppointmentCard, { Appointment } from '@/components/ui/appointment-card';
import ServiceCard, { Service } from '@/components/ui/service-card';

// Mock data
const pastAppointments: Appointment[] = [
  {
    id: '1',
    petId: '1',
    petName: 'Buddy',
    date: 'Mar 10, 2024',
    time: '10:30 AM',
    type: 'Annual Checkup',
    reason: 'Routine health examination and vaccinations',
    veterinarian: 'Dr. Smith',
    location: 'Main Pet Clinic',
    status: 'completed',
  },
  {
    id: '2',
    petId: '2',
    petName: 'Whiskers',
    date: 'Feb 15, 2024',
    time: '2:15 PM',
    type: 'Dental Cleaning',
    reason: 'Preventative dental care',
    veterinarian: 'Dr. Johnson',
    location: 'Main Pet Clinic',
    status: 'completed',
  },
  {
    id: '3',
    petId: '3',
    petName: 'Tweety',
    date: 'Feb 8, 2024',
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
    date: 'Jan 30, 2024',
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
    date: 'Jan 20, 2024',
    time: '1:30 PM',
    type: 'Checkup',
    reason: 'Following up on treatment',
    veterinarian: 'Dr. Smith',
    location: 'Main Pet Clinic',
    status: 'cancelled',
  },
];

const pastServices: Service[] = [
  {
    id: '1',
    petId: '1',
    petName: 'Buddy',
    type: 'grooming',
    name: 'Full Grooming',
    description: 'Bath, haircut, nail trimming, ear cleaning',
    date: 'Mar 5, 2024',
    time: '1:00 PM',
    duration: '1.5 hours',
    price: 65,
    status: 'completed',
  },
  {
    id: '2',
    petId: '2',
    petName: 'Whiskers',
    type: 'boarding',
    name: 'Weekend Boarding',
    description: 'Premium room with 3 daily play sessions',
    date: 'Feb 18-20, 2024',
    duration: '2 days',
    price: 120,
    status: 'completed',
  },
  {
    id: '3',
    petId: '1',
    petName: 'Buddy',
    type: 'grooming',
    name: 'Bath & Brush',
    description: 'Basic bath and brush service',
    date: 'Feb 10, 2024',
    time: '10:30 AM',
    duration: '45 minutes',
    price: 35,
    status: 'completed',
  },
  {
    id: '4',
    petId: '3',
    petName: 'Tweety',
    type: 'boarding',
    name: 'Bird Boarding',
    description: 'Specialized avian care',
    date: 'Jan 25-28, 2024',
    duration: '3 days',
    price: 90,
    status: 'completed',
  },
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'appointments' | 'services'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'sixMonths' | 'year'>('all');
  
  // Filter based on search query and date range
  const filterItems = <T extends Appointment | Service>(items: T[]) => {
    return items.filter(item => {
      // Search filter
      const searchMatch = 
        'petName' in item && item.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        'type' in item && typeof item.type === 'string' && item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        'name' in item && item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Date filter
      const itemDate = new Date(item.date.split('-')[0]);
      const now = new Date();
      
      let dateMatch = true;
      if (dateRange === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        dateMatch = itemDate >= oneMonthAgo;
      } else if (dateRange === 'sixMonths') {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        dateMatch = itemDate >= sixMonthsAgo;
      } else if (dateRange === 'year') {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        dateMatch = itemDate >= oneYearAgo;
      }
      
      return searchMatch && dateMatch;
    });
  };

  const filteredAppointments = filterItems(pastAppointments);
  const filteredServices = filterItems(pastServices);

  // Combine and sort all items by date (most recent first)
  const allItems = [...filteredAppointments, ...filteredServices].sort((a, b) => {
    return new Date(b.date.split('-')[0]).getTime() - new Date(a.date.split('-')[0]).getTime();
  });

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">History</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your past appointments and services
        </p>
      </div>
      
      <div className="mb-8 glass-card dark:glass-card-dark rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by pet name, service type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex overflow-x-auto gap-2 py-1 md:py-0">
            <div className="flex items-center mr-2">
              <Filter className="h-4 w-4 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
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
              variant={activeFilter === 'appointments' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('appointments')}
              className="whitespace-nowrap flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" />
              Appointments
            </Button>
            
            <Button
              variant={activeFilter === 'services' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter('services')}
              className="whitespace-nowrap flex items-center gap-1"
            >
              <Scissors className="h-3 w-3" />
              Services
            </Button>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2 overflow-x-auto py-1">
          <div className="flex items-center mr-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
          </div>
          
          <Button
            variant={dateRange === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange('all')}
            className="whitespace-nowrap"
          >
            All Time
          </Button>
          
          <Button
            variant={dateRange === 'month' ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange('month')}
            className="whitespace-nowrap"
          >
            Last Month
          </Button>
          
          <Button
            variant={dateRange === 'sixMonths' ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange('sixMonths')}
            className="whitespace-nowrap"
          >
            Last 6 Months
          </Button>
          
          <Button
            variant={dateRange === 'year' ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange('year')}
            className="whitespace-nowrap"
          >
            Last Year
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="all">All History</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="animate-fade-in">
          {allItems.length > 0 ? (
            <div className="space-y-6">
              {allItems.map(item => (
                'reason' in item ? (
                  <AppointmentCard key={`appointment-${item.id}`} appointment={item as Appointment} />
                ) : (
                  <ServiceCard key={`service-${item.id}`} service={item as Service} />
                )
              ))}
            </div>
          ) : (
            <div className="glass-card dark:glass-card-dark rounded-xl p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No history items found matching your search criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  setDateRange('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="appointments" className="animate-fade-in">
          {filteredAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <div className="glass-card dark:glass-card-dark rounded-xl p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No appointment history found matching your search criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setDateRange('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="services" className="animate-fade-in">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="glass-card dark:glass-card-dark rounded-xl p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No service history found matching your search criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setDateRange('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;
