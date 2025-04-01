
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BoardingService } from '@/types/service';
import BoardingCard from '@/components/ui/boarding-card';
import { fetchBoardingServices, BoardingResponse} from '@/service/boarding';
import { getTokenFromCookies } from '@/service/auth';
// Mock data for boarding services


const Boarding = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [boardings, setBoardings] = useState<BoardingService[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const token = getTokenFromCookies();
  // Filter services based on search query
    const filteredServices = boardings.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        service.type.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    // Navigate to service detail page
    const handleServiceClick = (serviceId: string) => {
        navigate(`/boarding/${serviceId}`);
    };
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
      const loadServices = async () => {
        try {
          const data: BoardingResponse = await fetchBoardingServices(token);
          setBoardings(data.boarding);
          setLoading(false);
        } catch (error) {
          setError('Failed to load services');
          setLoading(false);
        }
      };
    
      loadServices(); // Fetch dữ liệu khi component mount
    
      // Lắng nghe sự kiện cập nhật dịch vụ từ WebSocket
    //   socket.on("serviceUpdated", (updatedService) => {
    //     console.log("📢 Received updated service:", updatedService);
    //     alert("Có service mới, ấn OK để xem")
    //     window.location.reload()
    //   });
      
    //   socket.on("connect", () => {
    //     console.log("Connected to WebSocket server with ID:", socket.id);
    //   });
      
    //   socket.on("disconnect", () => {
    //     console.log("Disconnected from WebSocket server");
    //   });
    //   return () => {
    //     socket.off("serviceUpdated"); // Cleanup listener khi component unmount
    //   };
    }, [token]);
  return (
    <div className="container mx-auto px-4 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Pet Boarding Services</h1>
                <p className="text-gray-600 dark:text-gray-400">
                Find the perfect accommodation for your pet while you're away
                </p>
            </div>
            <Button asChild className="flex items-center gap-2">
                <a href="/boardings/me">
                  My Boarding
                </a>
            </Button>
        </div>
        <div className="mb-8 glass-card dark:glass-card-dark rounded-xl p-6">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
                type="text"
                placeholder="Search boarding options, amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
            />
            </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredServices.map((service, i) => (
            <BoardingCard
                key={i}
                service={service}
                isPreview={true}
                onClick={() => handleServiceClick(String(service.id))}
            />
            ))}
        </div>
      
        <div className="mt-12 glass-card dark:glass-card-dark rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Boarding Solution?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Have specific requirements for your pet's stay? Contact us to discuss custom boarding arrangements tailored to your pet's needs.
            </p>
            <Button size="lg">Contact Us</Button>
        </div>
    </div>
  );
};

export default Boarding;