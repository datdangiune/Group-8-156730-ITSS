
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';

type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';

export interface Pet {
  id: number;
  owner_id: number;
  name: string;
  age: number;
  type: PetType;
  gender: 'Male' | 'Female';
  breed?: string;
  fur_color?: string;
  health_status?: string;
  diet_plan?: string;
  medical_history?: string;
  vaccination_history?: string;
  created_at: string;
  image?: string | null;
}

interface PetCardProps {
  pet: Pet;
  className?: string;
}

const getPlaceholderImage = (type: PetType) => {
  // In a real app, you'd have specific placeholder images for each pet type
  return '/placeholder.svg';
};

const PetCard: React.FC<PetCardProps> = ({ pet, className }) => {
  return (
    <div 
      className={cn(
        "glass-card dark:glass-card-dark rounded-xl overflow-hidden transition-all duration-300 hover-elevate group",
        className
      )}
    >
      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
        <img
          src={pet.image || getPlaceholderImage(pet.type)}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            target.classList.add('loaded');
            target.classList.remove('loading');
          }}
          loading="lazy"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* <Link
            to={`/pets/${pet.id}`}
            className="bg-white/90 dark:bg-gray-900/90 p-2 rounded-full shadow-md text-gray-700 dark:text-gray-200 hover:text-primary"
            aria-label={`Edit ${pet.name}`}
          >
            <Edit size={16} />
          </Link> */}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-xl">{pet.name}</h3>
          <div className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
            <PawPrint size={12} className="mr-1" />
            <span>{pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</span>
          </div>
        </div>
        
        {pet.breed && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{pet.breed}</p>
        )}
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {pet.age !== undefined && (
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Age:</span> {pet.age} {pet.age === 1 ? 'year' : 'years'}
            </div>
          )}
          
          {pet.fur_color !== undefined && (
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Color:</span> {pet.fur_color} 
            </div>
          )}
          
          {pet.gender && (
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Gender:</span> {pet.gender}
            </div>
          )}
          
          {pet.health_status && (
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Health:</span> {pet.health_status}
            </div>
          )}
        </div>
        
        <span
          className="mt-4 inline-block text-primary font-medium hover:underline story-link"
        >
          View details
        </span>
      </div>
    </div>
  );
};

export default PetCard;
