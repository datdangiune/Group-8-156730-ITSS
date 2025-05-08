
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, File, FileText, Folder, Plus, Search } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { medicalRecords } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MedicalRecordForm from "@/components/medical-records/MedicalRecordForm";
import MultiStepMedicalRecordForm from "@/components/medical-records/MultiStepMedicalRecordForm";
import { toast } from "sonner";
import PetMedicalProfile from "@/components/medical-records/PetMedicalProfile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data for pet list and examinations
const petsList = [
  {
    id: "1",
    petName: "Max",
    petType: "Dog",
    petBreed: "Golden Retriever",
    ownerName: "John Smith",
    age: 5,
    weight: 32,
    examinations: [
      {
        created_at: "2025-05-08T08:30:17.583Z",
        id: 1,
        appointment_id: 1,
        diagnosis: "Healthy annual checkup",
        prescription: "Heartgard Plus (10mg): Once monthly",
        follow_up_date: "2025-11-08T08:30:00.000Z"
      },
      {
        created_at: "2024-12-15T14:20:00.000Z",
        id: 2,
        appointment_id: 2,
        diagnosis: "Ear infection",
        prescription: "Otomax (0.5ml): Twice daily for 7 days",
        follow_up_date: undefined
      }
    ]
  },
  {
    id: "2",
    petName: "Bella",
    petType: "Cat",
    petBreed: "Siamese",
    ownerName: "Emily Johnson",
    age: 3,
    weight: 4.5,
    examinations: [
      {
        created_at: "2025-04-22T10:15:00.000Z",
        id: 3,
        appointment_id: 3,
        diagnosis: "Dental cleaning",
        prescription: "No medication required",
        follow_up_date: undefined
      }
    ]
  },
  {
    id: "3",
    petName: "Charlie",
    petType: "Dog",
    petBreed: "Beagle",
    ownerName: "Michael Brown",
    age: 7,
    weight: 12,
    examinations: []
  }
];

const MedicalRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<typeof petsList[0] | null>(null);
  const [view, setView] = useState<"records" | "pets">("pets");
  
  // Filter pets based on search query
  const filteredPets = petsList.filter(pet => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      pet.petName.toLowerCase().includes(query) ||
      pet.ownerName.toLowerCase().includes(query) ||
      pet.petType.toLowerCase().includes(query) ||
      (pet.petBreed && pet.petBreed.toLowerCase().includes(query))
    );
  });

  // Filter medical records based on search query (original functionality)
  const filteredRecords = medicalRecords.filter(record => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      record.petName.toLowerCase().includes(query) ||
      record.ownerName.toLowerCase().includes(query) ||
      record.diagnosis.toLowerCase().includes(query) ||
      record.treatments.some(treatment => treatment.toLowerCase().includes(query)) ||
      record.prescriptions.some(prescription => prescription.toLowerCase().includes(query))
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
  
  const handlePetSelect = (pet: typeof petsList[0]) => {
    setSelectedPet(pet);
    setView("records");
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
              {view === "pets" ? "Medical Records" : `${selectedPet?.petName}'s Medical Profile`}
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Medical Record
            </Button>
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
                                <AvatarFallback className={getAvatarColor(pet.petName)}>
                                  {getInitials(pet.petName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{pet.petName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{pet.ownerName}</TableCell>
                          <TableCell>{pet.petType}</TableCell>
                          <TableCell>{pet.petBreed || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={pet.examinations.length > 0 ? "outline" : "secondary"}>
                              {pet.examinations.length} records
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
        
        {/* Use the multi-step medical record form */}
        <MultiStepMedicalRecordForm 
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateMedicalRecord}
        />
      </div>
    </PageTransition>
  );
};

export default MedicalRecords;
