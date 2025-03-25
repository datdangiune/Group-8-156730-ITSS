
import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 hover-scale text-primary">
              <PawPrint className="h-8 w-8" />
              <span className="font-bold text-xl">PetPals</span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Caring for your pets with love and expertise.
            </p>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/appointments" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors story-link">
                  Medical Appointments
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors story-link">
                  Grooming Services
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors story-link">
                  Boarding Services
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors story-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pets" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors story-link">
                  My Pets
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors story-link">
                  Service History
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <p className="text-gray-600 dark:text-gray-400">
              123 Pet Care Lane<br />
              Pet City, PC 12345<br />
              contact@petpals.com<br />
              (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {currentYear} PetPals. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0 text-gray-600 dark:text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 mx-1 text-red-500 animate-pulse-soft" />
            <span>for your furry friends</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
