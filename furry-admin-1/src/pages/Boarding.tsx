
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Interface for boarding options
interface BoardingOption {
  id: string;
  name: string;
  price: number;
  type: 'standard' | 'deluxe' | 'premium' | 'suite';
  maxday: number;
  isActive: boolean;
  activeUses: number;
  totalUses: number;
}

// Interface for boarding users
interface BoardingUser {
  id: string;
  petName: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  statusPayment: 'pending' | 'paid' | 'cancelled';
  notes?: string;
}

// Mock boarding options data
const initialBoardingOptions: BoardingOption[] = [
  {
    id: '1',
    name: 'Standard Room',
    price: 45,
    type: 'standard',
    maxday: 14,
    isActive: true,
    activeUses: 8,
    totalUses: 245,
  },
  {
    id: '2',
    name: 'Deluxe Room',
    price: 65,
    type: 'deluxe',
    maxday: 21,
    isActive: true,
    activeUses: 6,
    totalUses: 178,
  },
  {
    id: '3',
    name: 'Premium Suite',
    price: 85,
    type: 'premium',
    maxday: 30,
    isActive: true,
    activeUses: 2,
    totalUses: 89,
  },
  {
    id: '4',
    name: 'Luxury Suite',
    price: 120,
    type: 'suite',
    maxday: 60,
    isActive: false,
    activeUses: 0,
    totalUses: 32,
  }
];

// Mock data for boarding users
const mockBoardingUsers: Record<string, BoardingUser[]> = {
  '1': [
    { id: 'b1', petName: 'Buddy', ownerName: 'James Wilson', startDate: '2023-05-10', endDate: '2023-05-17', totalPrice: 315, status: 'In Progress', statusPayment: 'paid' },
    { id: 'b2', petName: 'Coco', ownerName: 'Emily Thompson', startDate: '2023-05-11', endDate: '2023-05-15', totalPrice: 180, status: 'In Progress', statusPayment: 'paid' },
    { id: 'b3', petName: 'Max', ownerName: 'Michael Rodriguez', startDate: '2023-05-12', endDate: '2023-05-18', totalPrice: 270, status: 'In Progress', statusPayment: 'paid' },
    { id: 'b4', petName: 'Bailey', ownerName: 'Sophia Martinez', startDate: '2023-05-13', endDate: '2023-05-16', totalPrice: 135, status: 'In Progress', statusPayment: 'pending', notes: 'Special diet requirements' },
    { id: 'b5', petName: 'Luna', ownerName: 'Alexander Johnson', startDate: '2023-05-14', endDate: '2023-05-19', totalPrice: 225, status: 'Scheduled', statusPayment: 'pending' },
    { id: 'b6', petName: 'Charlie', ownerName: 'Olivia Brown', startDate: '2023-05-14', endDate: '2023-05-17', totalPrice: 135, status: 'In Progress', statusPayment: 'paid' },
    { id: 'b7', petName: 'Lucy', ownerName: 'William Davis', startDate: '2023-05-14', endDate: '2023-05-20', totalPrice: 270, status: 'Scheduled', statusPayment: 'pending' },
    { id: 'b8', petName: 'Daisy', ownerName: 'Emma Miller', startDate: '2023-04-14', endDate: '2023-04-18', totalPrice: 180, status: 'Completed', statusPayment: 'paid' },
  ],
  '2': [
    { id: 'b9', petName: 'Rocky', ownerName: 'Daniel Taylor', startDate: '2023-05-09', endDate: '2023-05-16', totalPrice: 455, status: 'In Progress', statusPayment: 'paid' },
    { id: 'b10', petName: 'Bella', ownerName: 'Ava Anderson', startDate: '2023-05-10', endDate: '2023-05-17', totalPrice: 455, status: 'In Progress', statusPayment: 'paid' },
    { id: 'b11', petName: 'Cooper', ownerName: 'Jackson Thomas', startDate: '2023-05-12', endDate: '2023-05-18', totalPrice: 390, status: 'In Progress', statusPayment: 'paid' },
    { id: 'b12', petName: 'Sadie', ownerName: 'Charlotte White', startDate: '2023-05-13', endDate: '2023-05-19', totalPrice: 390, status: 'In Progress', statusPayment: 'paid', notes: 'Requires daily medication' },
    { id: 'b13', petName: 'Milo', ownerName: 'Benjamin Harris', startDate: '2023-04-14', endDate: '2023-04-21', totalPrice: 455, status: 'Completed', statusPayment: 'paid' },
    { id: 'b14', petName: 'Zoe', ownerName: 'Mia Martin', startDate: '2023-04-14', endDate: '2023-04-17', totalPrice: 195, status: 'Cancelled', statusPayment: 'cancelled' },
  ],
  '3': [
    { id: 'b15', petName: 'Oliver', ownerName: 'Isabella Thompson', startDate: '2023-05-08', endDate: '2023-05-15', totalPrice: 595, status: 'In Progress', statusPayment: 'paid' },
    { id: 'b16', petName: 'Lola', ownerName: 'Ethan Walker', startDate: '2023-05-12', endDate: '2023-05-19', totalPrice: 595, status: 'In Progress', statusPayment: 'paid', notes: 'Prefers window area' },
  ],
};

const roomTypeColors = {
  standard: { bg: 'bg-vetgreen-50', text: 'text-vetgreen-600', border: 'border-vetgreen-200' },
  deluxe: { bg: 'bg-vetblue-50', text: 'text-vetblue-600', border: 'border-vetblue-200' },
  premium: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  suite: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
};

const Boarding = () => {
  const [boardingOptions, setBoardingOptions] = useState<BoardingOption[]>(initialBoardingOptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState<BoardingOption | null>(null);

  // Filtered boarding options based on search
  const filteredOptions = boardingOptions.filter(option => 
    option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOptionSelect = (option: BoardingOption) => {
    setSelectedOption(option);
  };

  const handleBackToList = () => {
    setSelectedOption(null);
  };

  // Get boarding users for the selected option
  const getBoardingUsers = (optionId: string) => {
    return mockBoardingUsers[optionId] || [];
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Boarding Management</h1>
            <p className="text-muted-foreground mt-1">Manage boarding accommodations and schedules</p>
          </div>
          <Button onClick={() => toast("Feature not implemented", { description: "Adding new boarding options is not available yet." })} className="animate-fade-in">
            Add Boarding Option
          </Button>
        </div>

        {selectedOption ? (
          // Detail View for selected boarding option
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBackToList} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Boarding Options
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize mb-2",
                        roomTypeColors[selectedOption.type].bg,
                        roomTypeColors[selectedOption.type].text,
                        roomTypeColors[selectedOption.type].border
                      )}
                    >
                      {selectedOption.type}
                    </Badge>
                    <CardTitle className="text-2xl">{selectedOption.name}</CardTitle>
                    <CardDescription>
                      ${selectedOption.price.toFixed(2)} per night • Max stay: {selectedOption.maxday} days
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-1">
                      <span className="text-muted-foreground mr-2">Active Bookings:</span>
                      <span className="font-medium text-vetblue-600">{selectedOption.activeUses}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Total Bookings:</span>
                      <span className="font-medium">{selectedOption.totalUses}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold mb-4">Booking History</h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pet Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Booking Period</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getBoardingUsers(selectedOption.id).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                            No bookings found for this room type
                          </TableCell>
                        </TableRow>
                      ) : (
                        getBoardingUsers(selectedOption.id).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.petName}</TableCell>
                            <TableCell>{user.ownerName}</TableCell>
                            <TableCell>{user.startDate} - {user.endDate}</TableCell>
                            <TableCell>${user.totalPrice.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  {
                                    'In Progress': "bg-vetblue-50 text-vetblue-600 border-vetblue-200",
                                    'Scheduled': "bg-amber-50 text-amber-600 border-amber-200",
                                    'Completed': "bg-vetgreen-50 text-vetgreen-600 border-vetgreen-200",
                                    'Cancelled': "bg-vetred-50 text-vetred-600 border-vetred-200"
                                  }[user.status]
                                )}
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  {
                                    'paid': "bg-vetgreen-50 text-vetgreen-600 border-vetgreen-200",
                                    'pending': "bg-amber-50 text-amber-600 border-amber-200",
                                    'cancelled': "bg-vetred-50 text-vetred-600 border-vetred-200"
                                  }[user.statusPayment]
                                )}
                              >
                                {user.statusPayment}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.notes || '-'}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Main List View
          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle>All Boarding Options</CardTitle>
              <CardDescription>Manage all boarding accommodations offered by the clinic</CardDescription>
              <div className="mt-4 max-w-md">
                <Input 
                  placeholder="Search boarding options..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table className="animate-fade-in">
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price/Night</TableHead>
                    <TableHead>Max Stay</TableHead>
                    <TableHead>Active Bookings</TableHead>
                    <TableHead>Total Bookings</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOptions.map((option) => {
                    const typeColor = roomTypeColors[option.type];
                    
                    return (
                      <TableRow 
                        key={option.id} 
                        className="group hover:bg-secondary/30 cursor-pointer"
                        onClick={() => handleOptionSelect(option)}
                      >
                        <TableCell className="font-medium">{option.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize",
                              typeColor.bg,
                              typeColor.text,
                              typeColor.border
                            )}
                          >
                            {option.type}
                          </Badge>
                        </TableCell>
                        <TableCell>${option.price.toFixed(2)}</TableCell>
                        <TableCell>{option.maxday} days</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-vetblue-500" />
                            <span className="font-medium">{option.activeUses}</span>
                          </div>
                        </TableCell>
                        <TableCell>{option.totalUses}</TableCell>
                        <TableCell>
                          {option.isActive ? (
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-vetgreen-500 mr-2"></span>
                              <span className="text-vetgreen-700">Available</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-muted-foreground mr-2"></span>
                              <span className="text-muted-foreground">Unavailable</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Boarding;
