
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PawPrint, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'My Pets', path: '/pets' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Services', path: '/services' },
    { name: 'History', path: '/history' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-40 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 hover-scale text-primary"
          aria-label="Home"
        >
          <PawPrint className="h-8 w-8" />
          <span className="font-bold text-xl">PetPals</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'font-medium transition-colors hover:text-primary story-link',
                location.pathname === link.path ? 'text-primary' : 'text-gray-600 dark:text-gray-300'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center text-gray-600 dark:text-gray-300 focus:outline-none"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-white dark:bg-gray-900 z-30 md:hidden transition-transform duration-300 ease-in-out pt-20',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-xl font-medium py-2 transition-colors hover:text-primary',
                location.pathname === link.path ? 'text-primary' : 'text-gray-600 dark:text-gray-300'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
