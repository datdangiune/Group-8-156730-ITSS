
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
import { toast } from "sonner";

const MedicalRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Filter medical records based on search query
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
  
  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-medium mb-4 md:mb-0">Medical Records</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Medical Record
            </Button>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pet name, owner, diagnosis, treatments..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select defaultValue="recent">
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="pet-az">Pet Name (A-Z)</SelectItem>
                <SelectItem value="pet-za">Pet Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.map(record => (
                <Card key={record.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                          Medical Record
                        </Badge>
                        <CardTitle className="text-lg">{record.petName}</CardTitle>
                        <CardDescription>{record.ownerName}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <File className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{record.recordDate}</span>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Diagnosis:</p>
                        <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Treatments:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {record.treatments.map((treatment, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {treatment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {record.prescriptions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Prescriptions:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {record.prescriptions.map((prescription, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {prescription}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No medical records found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          )}
          
          {filteredRecords.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredRecords.length}</span> of{" "}
                <span className="font-medium">{medicalRecords.length}</span> records
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
        
        <MedicalRecordForm 
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateMedicalRecord}
        />
      </div>
    </PageTransition>
  );
};

export default MedicalRecords;
