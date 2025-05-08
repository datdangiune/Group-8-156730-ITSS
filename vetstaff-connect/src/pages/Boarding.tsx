import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, Clock, Home, MoreHorizontal, Plus, Search } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BoardingForm from "@/components/boarding/BoardingForm";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { fetchUsersBoardings } from "@/service/Boarding";

const Boarding = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [boardings, setBoardings] = useState<any[]>([]); // State to store fetched boardings
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Replace with actual token
        const data = await fetchUsersBoardings(token);
        setBoardings(data);
      } catch (error) {
        console.error("Error fetching boardings:", error);
      }
    };

    fetchData();
  }, []);

  const filteredBoardings = boardings.filter((boarding) => {
    // Filter by tab (paid or pending)
    if (activeTab !== "all" && !boarding.status_payment.includes(activeTab)) {

      return false;
    }
  
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
  
      // Kiểm tra nếu tên thú cưng, loại thú cưng, giống loài, tên người dùng, email người dùng, hoặc tên của boarding chứa từ khóa tìm kiếm
      return (
        boarding.pet.name.toLowerCase().includes(query) ||
        boarding.pet.type.toLowerCase().includes(query) ||
        boarding.pet.breed.toLowerCase().includes(query) ||
        boarding.user.name.toLowerCase().includes(query) ||
        boarding.user.email.toLowerCase().includes(query) ||
        boarding.boarding.name.toLowerCase().includes(query)
      );
    }
  
    return true;
  });
  

  // Get pet initials
  const getPetInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Generate avatar color based on pet name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-red-100 text-red-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleCreateBoarding = (data: any) => {
    // In a real app, you would save this data to your backend
    console.log("New boarding:", data);
    toast.success("Boarding created successfully!");
    setIsFormOpen(false);
  };

  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-medium mb-4 md:mb-0">Boarding</h1>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => navigate("/clinic-boarding")}>
              <Plus className="h-4 w-4 mr-2" />
              Manage Boarding
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search boarders..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                
              </TabsList>
            </Tabs>
          </div>

          {filteredBoardings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBoardings.map((boarding) => (
                <Card key={boarding.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className={getAvatarColor(boarding.pet.name)}>
                            {getPetInitials(boarding.pet.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{boarding.pet.name}</CardTitle>
                          <CardDescription>
                            {boarding.pet.type}, {boarding.pet.breed}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Owner</p>
                          <p className="text-sm font-medium">{boarding.user.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="text-sm font-medium">{boarding.user.email}</p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Check In</p>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <p className="text-sm font-medium">{new Date(boarding.start_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Check Out</p>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <p className="text-sm font-medium">{new Date(boarding.end_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Boarding Service</p>
                        <p className="text-sm font-medium">{boarding.boarding.name}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Total Price</p>
                        <p className="text-sm font-medium">{boarding.total_price} VND</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <StatusBadge status={boarding.status_payment === "paid" ? "paid" : "pending"} />
                      </div>

                      {boarding.notes && (
                        <div>
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-sm font-medium">{boarding.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No boarding pets found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search criteria or add a new boarding
              </p>
            </div>
          )}

          {filteredBoardings.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredBoardings.length}</span> of{" "}
                <span className="font-medium">{boardings.length}</span> boarding pets
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" disabled>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <BoardingForm 
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateBoarding}
        />
      </div>
    </PageTransition>
  );
};

export default Boarding;
