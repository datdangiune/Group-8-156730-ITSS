
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Calendar,
  Clipboard,
  Heart,
  Home,
  LayoutDashboard,
  Menu,
  Stethoscope,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // State to track if sidebar should be auto-hidden on desktop
  const [isAutoHidden, setIsAutoHidden] = useState(true);
  
  // Function to handle sidebar hover
  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) { // Only for desktop
      setIsAutoHidden(false);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) { // Only for desktop
      setIsAutoHidden(true);
    }
  };

  // Close sidebar on route change on mobile
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 768 && isOpen) {
        onClose();
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, [isOpen, onClose]);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Collapsed sidebar indicator for desktop */}
      {isAutoHidden && (
        <div 
          className="fixed left-0 top-0 bottom-0 z-40 w-12 bg-transparent hidden md:flex items-center justify-center cursor-pointer hover:bg-card/10"
          onClick={() => setIsAutoHidden(false)}
          onMouseEnter={handleMouseEnter}
        >
          <Menu className="h-5 w-5 text-foreground/60" />
        </div>
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isAutoHidden && "md:-translate-x-[calc(100%-12px)]"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex h-full flex-1 items-center">
            <NavLink to="/" className="flex items-center gap-2" onClick={onClose}>
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">VS</span>
              </div>
              <span className="font-semibold">VetStaff Portal</span>
            </NavLink>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-4">
            <div className="mb-4">
              <h3 className="px-4 text-sm font-medium text-muted-foreground">Main</h3>
              <nav className="mt-2 flex flex-col gap-1">
                <SidebarLink href="/" icon={<LayoutDashboard size={18} />} onClick={onClose}>
                  Dashboard
                </SidebarLink>
                <SidebarLink href="/appointments" icon={<Calendar size={18} />} onClick={onClose}>
                  Appointments
                </SidebarLink>
                <SidebarLink href="/medical-records" icon={<Clipboard size={18} />} onClick={onClose}>
                  Medical Records
                </SidebarLink>
              </nav>
            </div>
            
            <div className="mb-4">
              <h3 className="px-4 text-sm font-medium text-muted-foreground">Services</h3>
              <nav className="mt-2 flex flex-col gap-1">
                <SidebarLink href="/services" icon={<Stethoscope size={18} />} onClick={onClose}>
                  Services
                </SidebarLink>
                <SidebarLink href="/boarding" icon={<Home size={18} />} onClick={onClose}>
                  Boarding
                </SidebarLink>
              </nav>
            </div>
            <div className="mb-4">
              <h3 className="px-4 text-sm font-medium text-muted-foreground">Clinic Management</h3>
              <nav className="mt-2 flex flex-col gap-1">
                <SidebarLink href="/clinic-services" icon={<Stethoscope size={18} />} onClick={onClose}>
                  Clinic Services
                </SidebarLink>
                <SidebarLink href="/clinic-boarding" icon={<Home size={18} />} onClick={onClose}>
                  Clinic Boarding
                </SidebarLink>
              </nav>
            </div>

          </div>
        </ScrollArea>
      </div>
    </>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  children,
  onClick,
}) => {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-secondary text-foreground"
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  );
};

export default Sidebar;
