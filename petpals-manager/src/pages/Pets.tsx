
import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PetCard, { Pet } from '@/components/ui/pet-card';
import { getPets } from '@/service/pet';
import { getTokenFromCookies } from '@/service/auth';
import { useNavigate } from 'react-router-dom';
type PetType = "dog" | "cat" | "bird" | "rabbit" | "fish" | "other";

const Pets = () => {
  const petType = ["dog" , "cat" , "bird" , "rabbit" , "fish" , "other"]
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
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
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || pet.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Pets</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all your registered pets
          </p>
        </div>
        
        <Button asChild className="flex items-center gap-2">
          <Link to="/pets/add">
            <PlusCircle className="h-5 w-5" />
            Add New Pet
          </Link>
        </Button>
      </div>
      
      <div className="mb-8 glass-card dark:glass-card-dark rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or breed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex overflow-x-auto gap-2 py-1 md:py-0">
            <div className="flex items-center mr-2">
              <Filter className="h-4 w-4 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
            </div>
            
            {petType.map(type => (
              <Button
                key={type}
                variant={activeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(type)}
                className="whitespace-nowrap capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
          
          <Link 
            to="/pets/add" 
            className="glass-card dark:glass-card-dark rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-12 hover:border-primary hover:text-primary transition-colors duration-300"
          >
            <PlusCircle className="h-12 w-12 mb-3" />
            <span className="font-medium">Add a new pet</span>
          </Link>
        </div>
      ) : (
        <div className="glass-card dark:glass-card-dark rounded-xl py-16 px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || activeFilter !== 'all' 
              ? "No pets found matching your search criteria." 
              : "You haven't added any pets yet."}
          </p>
          
          {searchQuery || activeFilter !== 'all' ? (
            <div className="space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                Clear filters
              </Button>
              
              <Button asChild>
                <Link to="/pets/add">Add a pet</Link>
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link to="/pets/add">Add your first pet</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Pets;
