
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Scissors, BedDouble, Dumbbell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ServiceCard from '@/components/ui/service-card';
import { useNavigate } from 'react-router-dom';
import { fetchServices, GetServicesResponse, Service} from '@/service/service';
import { getTokenFromCookies } from '@/service/auth';



const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = getTokenFromCookies();
  // Filter services based on search query
  const filterServices = (services: Service[]) => {
    if (!searchQuery) return services;
    
    return services.filter(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data: GetServicesResponse = await fetchServices(token);
        setServices(data.services); 
        setLoading(false); 
      } catch (error) {
        setError('Failed to load services');
        setLoading(false); 
      }
    };

    loadServices(); // Gọi hàm loadServices khi component mount
  }, [token]); 
  useEffect(() => {
    if(!token){
      navigate('/login');
    }
  })
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
        <TabsContent value="grooming" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterServices(services).map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                isPreview={true}
                onClick={() => handleServiceClick(String(service.id))}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* <TabsContent value="boarding" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
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
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                isPreview={true}
                onClick={() => console.log(`Book ${service.name}`)}
              />
            ))}
          </div>
        </TabsContent> */}
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
