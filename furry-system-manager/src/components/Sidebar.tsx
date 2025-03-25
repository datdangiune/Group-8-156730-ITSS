
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  PawPrint, 
  Calendar, 
  FileText, 
  Home, 
  Settings, 
  BarChart3, 
  Bell 
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Users', icon: Users, path: '/users' },
    { name: 'Services', icon: PawPrint, path: '/services' },
    { name: 'Appointments', icon: Calendar, path: '/appointments' },
    { name: 'Medical Records', icon: FileText, path: '/records' },
    { name: 'Boarding', icon: Home, path: '/boarding' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transition-all duration-300 transform bg-white border-r border-border md:translate-x-0 md:relative",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link 
            to="/" 
            className="flex items-center text-lg font-semibold text-foreground gap-2"
          >
            <PawPrint className="h-6 w-6 text-vetblue-600" />
            <span>VetAdmin</span>
          </Link>
        </div>

        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "menu-item",
                  path === item.path && "active"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-vetblue-100 flex items-center justify-center">
              <span className="text-vetblue-600 font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@vetclinic.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
