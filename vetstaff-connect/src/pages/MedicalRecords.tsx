import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Clock, File, FileText, Folder, Plus, Search } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MedicalRecordForm from "@/components/medical-records/MedicalRecordForm";
import MultiStepMedicalRecordForm from "@/components/medical-records/MultiStepMedicalRecordForm";
import { toast } from "sonner";
import PetMedicalProfile from "@/components/medical-records/PetMedicalProfile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchPets, fetchPetRecordCounts } from "@/service/Pets";
import { fetchPetMedicalHistory } from "@/service/MedicalRecords";

const MedicalRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [petsList, setPetsList] = useState<any[]>([]); // Dynamically fetched pets
  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  const [view, setView] = useState<"records" | "pets">("pets");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pets = await fetchPets();
        const recordCounts = await fetchPetRecordCounts(); // Fetch record counts
        const petsWithRecords = pets.map((pet) => {
          const recordCount = recordCounts.find((record) => record.id === pet.id)?.record_count || 0;
          return { ...pet, record_count: recordCount };
        });
        setPetsList(petsWithRecords);
      } catch (error: any) {
        console.error("Error fetching pets or record counts:", error.message);
        toast.error("Failed to fetch pets or record counts. Please try again.");
      }
    };

    fetchData();
  }, []);

  const filteredPets = petsList.filter((pet) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      pet.name.toLowerCase().includes(query) ||
      pet.owner.name.toLowerCase().includes(query) ||
      pet.type.toLowerCase().includes(query) ||
      (pet.breed && pet.breed.toLowerCase().includes(query))
    );
  });

  const handleCreateMedicalRecord = (data: any) => {
    // In a real app, you would save this data to your backend
    console.log("New medical record:", data);
    toast.success("Medical record created successfully!");
    setIsFormOpen(false);
  };

  // Get initials from pet name for avatar
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Generate avatar background color based on pet name
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

  const handlePetSelect = async (pet: any) => {
    setSelectedPet(pet);
    setView("records");

    try {
      const medicalHistory = await fetchPetMedicalHistory(pet.id);
      setSelectedPet((prev) => ({
        ...prev,
        examinations: medicalHistory,
      }));
    } catch (error: any) {
      console.error("Error fetching medical history:", error.message);
      toast.error("Failed to fetch medical history. Please try again.");
    }
  };

  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center">
            {view === "records" && selectedPet && (
              <Button
                variant="ghost"
                className="mr-2"
                onClick={() => {
                  setView("pets");
                  setSelectedPet(null);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Pets
              </Button>
            )}
            <h1 className="text-2xl font-medium">
              {view === "pets" ? "Medical Records" : `${selectedPet?.name}'s Medical Profile`}
            </h1>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
          {view === "pets" ? (
            <>
              <div className="relative md:w-1/2 mb-6">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pet name, owner, type..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pet</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Breed</TableHead>
                      <TableHead>Records</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPets.length > 0 ? (
                      filteredPets.map((pet) => (
                        <TableRow
                          key={pet.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handlePetSelect(pet)}
                        >
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarFallback className={getAvatarColor(pet.name)}>
                                  {getInitials(pet.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{pet.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{pet.owner.name}</TableCell>
                          <TableCell>{pet.type}</TableCell>
                          <TableCell>{pet.breed || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={pet.record_count > 0 ? "outline" : "secondary"}>
                              {pet.record_count || 0} records
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                          <Folder className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium">No pets found</h3>
                          <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : selectedPet ? (
            <PetMedicalProfile pet={selectedPet} />
          ) : (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No pet selected</h3>
              <p className="text-muted-foreground mt-2">
                Please select a pet to view their medical profile
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default MedicalRecords;
