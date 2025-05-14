import React, { useEffect, useState } from 'react';
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
import { fetchBoardingsWithStats, fetchBoardingUsersByBoarding, BoardingItem, BoardingUserEntry } from '@/service/boarding';

const roomTypeColors = {
  standard: { bg: 'bg-vetgreen-50', text: 'text-vetgreen-600', border: 'border-vetgreen-200' },
  deluxe: { bg: 'bg-vetblue-50', text: 'text-vetblue-600', border: 'border-vetblue-200' },
  premium: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  suite: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
};

const Boarding = () => {
  const [boardingOptions, setBoardingOptions] = useState<BoardingItem[]>([]);
  const [boardingUsers, setBoardingUsers] = useState<Record<string, BoardingUserEntry[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState<BoardingItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [options, users] = await Promise.all([
          fetchBoardingsWithStats(),
          fetchBoardingUsersByBoarding(),
        ]);
        setBoardingOptions(options);
        setBoardingUsers(users);
      } catch (error: any) {
        toast.error("Failed to fetch boarding data");
      }
    };
    fetchData();
  }, []);

  // Filtered boarding options based on search
  const filteredOptions = boardingOptions.filter(option =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOptionSelect = (option: BoardingItem) => {
    setSelectedOption(option);
  };

  const handleBackToList = () => {
    setSelectedOption(null);
  };

  // Get boarding users for the selected option
  const getBoardingUsers = (optionId: string) => {
    return boardingUsers[optionId] || [];
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Boarding Management</h1>
            <p className="text-muted-foreground mt-1">Manage boarding accommodations and schedules</p>
          </div>
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
                        roomTypeColors[selectedOption.type]?.bg,
                        roomTypeColors[selectedOption.type]?.text,
                        roomTypeColors[selectedOption.type]?.border
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
                    <TableHead>Price</TableHead>
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
                              typeColor?.bg,
                              typeColor?.text,
                              typeColor?.border
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
