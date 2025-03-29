
import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, Scissors, BedDouble, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetCard, { Pet } from '@/components/ui/pet-card';
import AppointmentCard, { Appointment } from '@/components/ui/appointment-card';
import ServiceCard, { Service } from '@/components/ui/service-card';
import { getTokenFromCookies } from '@/service/auth';
import { useNavigate } from 'react-router-dom';
import { getPets } from '@/service/pet';

type PetType = "dog" | "cat" | "bird" | "rabbit" | "fish" | "other";


const mockAppointments: Appointment[] = [
  {
    id: 1,
    petId: 1,
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
];

const recentServices: Service[] = [
  {
    id: '1',
    petId: '1',
    petName: 'Buddy',
    type: 'grooming',
    name: 'Full Grooming',
    description: 'Bath, haircut, nail trimming, ear cleaning',
    date: 'Mar 25, 2024',
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
    date: 'Mar 18-20, 2024',
    duration: '2 days',
    price: 120,
    status: 'completed',
  },
];

const Dashboard = () => {
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });
  const [pets, setPets] = useState<Pet[]>([]);  
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
  

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <section className="mb-10">
        <div className="glass-card dark:glass-card-dark rounded-2xl p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{greeting}, Pet Owner</h1>
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
            <Link to={`pets/${pet.id}`}>
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
        
        {mockAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockAppointments.map(appointment => (
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
        
        {recentServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentServices.map(service => (
              <ServiceCard key={service.id} service={service} />
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
