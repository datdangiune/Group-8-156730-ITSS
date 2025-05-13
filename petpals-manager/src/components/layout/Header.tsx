
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PawPrint, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PopoverContent, Popover, PopoverTrigger} from "@/components/ui/popover";
import Cookies from 'js-cookie';
import NotificationBell from './NotificationBell';
interface User {
  username: string;
  email: string;
}
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    // Lấy user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Chuyển JSON thành object
    }
  }, []);
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault(); 
    Cookies.remove('token');
    localStorage.removeItem("user");
    window.location.reload()
  }
  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'My Pets', path: '/pets' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Services', path: '/services' },
    { name: 'Boarding', path: '/boardings' },
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
          <NotificationBell />
        </nav>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                JD
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 shadow-lg rounded-lg bg-white">
            <div className="text-center">
              <Avatar className="h-12 w-12 mx-auto mb-2">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  JD
                </AvatarFallback>
              </Avatar>
              {user ? (
                <>
                  <p className="text-lg font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Chưa đăng nhập</p>
              )}
            </div>
            <div className="mt-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <NotificationBell />
          <button
            onClick={toggleMobileMenu}
            className="flex items-center text-gray-600 dark:text-gray-300 focus:outline-none"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
