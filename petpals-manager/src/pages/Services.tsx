
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Scissors, BedDouble, Dumbbell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ServiceCard, { Service } from '@/components/ui/service-card';

// Mock data
const groomingServices: Service[] = [
  {
    id: 'g1',
    petId: '',
    petName: '',
    type: 'grooming',
    name: 'Basic Bath',
    description: 'Includes shampoo, conditioner, blow dry, ear cleaning, and nail trim',
    date: '',
    duration: '45 mins',
    price: 35,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
  },
  {
    id: 'g2',
    petId: '',
    petName: '',
    type: 'grooming',
    name: 'Full Grooming',
    description: 'Complete grooming with haircut, styling, bath, nail trim, ear cleaning, and teeth brushing',
    date: '',
    duration: '1.5 hours',
    price: 65,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1581781870881-9afd59936de3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 'g3',
    petId: '',
    petName: '',
    type: 'grooming',
    name: 'Nail Trim',
    description: 'Professional nail trimming for your pet',
    date: '',
    duration: '15 mins',
    price: 15,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 'g4',
    petId: '',
    petName: '',
    type: 'grooming',
    name: 'Spa Package',
    description: 'Luxurious spa treatment including aromatherapy bath, massage, full grooming, and pawdicure',
    date: '',
    duration: '2 hours',
    price: 85,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
];

const boardingServices: Service[] = [
  {
    id: 'b1',
    petId: '',
    petName: '',
    type: 'boarding',
    name: 'Standard Boarding',
    description: 'Comfortable accommodation with 3 daily walks and regular feeding',
    date: '',
    duration: 'Per night',
    price: 40,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 'b2',
    petId: '',
    petName: '',
    type: 'boarding',
    name: 'Luxury Suite',
    description: 'Premium suite with plush bedding, TV, webcam access, 4 daily walks, and extra playtime',
    date: '',
    duration: 'Per night',
    price: 65,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 'b3',
    petId: '',
    petName: '',
    type: 'boarding',
    name: 'Cat Condo',
    description: 'Multi-level cat condo with climbing shelves, toys, and private litter area',
    date: '',
    duration: 'Per night',
    price: 35,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
];

const trainingServices: Service[] = [
  {
    id: 't1',
    petId: '',
    petName: '',
    type: 'training',
    name: 'Basic Obedience',
    description: 'Learn essential commands like sit, stay, come, and leash walking',
    date: '',
    duration: '4 weeks course',
    price: 200,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 't2',
    petId: '',
    petName: '',
    type: 'training',
    name: 'Advanced Training',
    description: 'Advanced commands, off-leash training, and behavior modification',
    date: '',
    duration: '6 weeks course',
    price: 300,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
];

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter services based on search query
  const filterServices = (services: Service[]) => {
    if (!searchQuery) return services;
    
    return services.filter(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Pet Services</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Book grooming, boarding, and training services for your pets
        </p>
      </div>
      
      <div className="mb-8 glass-card dark:glass-card-dark rounded-xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Tabs defaultValue="grooming" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="grooming" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            <span className="hidden sm:inline">Grooming</span>
          </TabsTrigger>
          <TabsTrigger value="boarding" className="flex items-center gap-2">
            <BedDouble className="h-4 w-4" />
            <span className="hidden sm:inline">Boarding</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Training</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="grooming" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterServices(groomingServices).map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                isPreview={true}
                onClick={() => console.log(`Book ${service.name}`)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="boarding" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterServices(boardingServices).map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                isPreview={true}
                onClick={() => console.log(`Book ${service.name}`)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="training" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterServices(trainingServices).map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                isPreview={true}
                onClick={() => console.log(`Book ${service.name}`)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 glass-card dark:glass-card-dark rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Service?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Can't find what you're looking for? Contact us to arrange a custom service tailored to your pet's specific needs.
        </p>
        <Button size="lg">Contact Us</Button>
      </div>
    </div>
  );
};

export default Services;
