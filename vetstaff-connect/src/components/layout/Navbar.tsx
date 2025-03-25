
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Bell, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  // Get the current page title based on pathname
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === "/") return "Dashboard";
    if (path === "/appointments") return "Appointments";
    if (path === "/medical-records") return "Medical Records";
    if (path === "/services") return "Services";
    if (path === "/boarding") return "Boarding";
    if (path === "/notifications") return "Notifications";
    
    return "Vet & Staff Portal";
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">VS</span>
            </div>
            <span className="hidden md:inline-block font-semibold">VetStaff</span>
          </NavLink>
        </div>
        
        <h1 className="ml-4 text-lg font-medium">{getPageTitle()}</h1>
        
        <div className="ml-auto flex items-center gap-2">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-1">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center p-2">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Search patients, appointments..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              </div>
              <div className="p-4 pt-0 text-sm">
                Try searching for patient name, owner, or appointment ID
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-1 relative">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="p-4 font-medium">Notifications</div>
              <div className="border-t">
                <div className="flex items-start gap-4 p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">New appointment request</p>
                    <p className="text-sm text-muted-foreground">Max (Golden Retriever) - Vaccination</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border-t">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Lab results ready</p>
                    <p className="text-sm text-muted-foreground">Luna (Siamese) - Blood work</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
              <div className="p-4 text-sm border-t">
                <Button variant="ghost" className="w-full justify-center" asChild>
                  <NavLink to="/notifications">View all notifications</NavLink>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="Dr. Jane Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
