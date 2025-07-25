
import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, Scissors, BedDouble, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetCard, { Pet } from '@/components/ui/pet-card';
import AppointmentCard, { Appointment } from '@/components/ui/appointment-card';
import ServiceCard from '@/components/ui/service-card';
import { getTokenFromCookies } from '@/service/auth';
import { useNavigate } from 'react-router-dom';
import { getPets } from '@/service/pet';
import { fetchUserAppointments } from '@/service/appointment';
import { fetchUserServices, UserService, } from '@/service/service';
type PetType = "dog" | "cat" | "bird" | "rabbit" | "fish" | "other";





const Dashboard = () => {
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });
  const [pets, setPets] = useState<Pet[]>([]);  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState("Scheduled");
  const [services, setServices] = useState<UserService[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const token = getTokenFromCookies();
  useEffect(() => {
    if(!token){
      navigate('/login')
    }
  }, []);
  useEffect(() => {
    async function fetchPets() {
      if (!token) return;
  
      const data = await getPets(token);
      const validTypes: PetType[] = ["dog", "cat", "bird", "rabbit", "fish", "other"];
  
      const formattedPets: Pet[] = data.map(pet => ({
        ...pet,
        id: Number(pet.id), // Đảm bảo id là số
        type: validTypes.includes(pet.type as PetType) ? (pet.type as PetType) : "other",
        gender: pet.gender === "Male" || pet.gender === "Female" ? pet.gender : "Male", // Đảm bảo gender hợp lệ
        image: pet.image || null, // Đảm bảo image có thể là null
      }));
  
      setPets(formattedPets);
    }
  
    fetchPets();
  }, [token]);
  
  useEffect(() => {
    const getAppointments = async () => {
      try {
        const data = await fetchUserAppointments(token, status);
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, [token]);
    useEffect(() => {
      const loadServices = async () => {
        try {
          const data = await fetchUserServices(token);
          setServices(data); 
          setLoading(false); 
        } catch (error) {
          setError('Failed to load services');
          setLoading(false); 
        }
      };
  
      loadServices(); // Gọi hàm loadServices khi component mount
    }, [token]); 
  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <section className="mb-10">
        <div className="glass-card dark:glass-card-dark rounded-2xl p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{greeting}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Welcome to your PetPals dashboard. Manage your pets, appointments, and services all in one place.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="flex items-center justify-center gap-2 py-6 hover:shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90">
              <Link to="/appointments">
                <Calendar className="h-5 w-5 mr-1" />
                Book Appointment
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="flex items-center justify-center gap-2 py-6 border-2 hover:shadow-lg transition-all duration-300">
              <Link to="/services">
                <Scissors className="h-5 w-5 mr-1" />
                Schedule Grooming
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="flex items-center justify-center gap-2 py-6 border-2 hover:shadow-lg transition-all duration-300">
              <Link to="/services">
                <BedDouble className="h-5 w-5 mr-1" />
                Reserve Boarding
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Pets</h2>
          <Button asChild variant="ghost" className="gap-1 hover:bg-transparent p-0 hover:text-primary">
            <Link to="/pets">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, index) => (
            <Link to={`pets/${pet.id}`} key={index}>
            <PetCard key={index} pet={pet} />
            </Link>
          ))}
          
          <Link 
            to="/pets/add" 
            className="glass-card dark:glass-card-dark rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-12 hover:border-primary hover:text-primary transition-colors duration-300"
          >
            <PlusCircle className="h-12 w-12 mb-3" />
            <span className="font-medium">Add a new pet</span>
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
          <Button asChild variant="ghost" className="gap-1 hover:bg-transparent p-0 hover:text-primary">
            <Link to="/appointments">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="glass-card dark:glass-card-dark rounded-xl p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any upcoming appointments.</p>
            <Button asChild>
              <Link to="/appointments">Book an appointment</Link>
            </Button>
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Services</h2>
          <Button asChild variant="ghost" className="gap-1 hover:bg-transparent p-0 hover:text-primary">
            <Link to="/history">
              View history <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service.service} userServiceStatus={service.status} />
            ))}
          </div>
        ) : (
          <div className="glass-card dark:glass-card-dark rounded-xl p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't used any services yet.</p>
            <Button asChild>
              <Link to="/services">Browse services</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
