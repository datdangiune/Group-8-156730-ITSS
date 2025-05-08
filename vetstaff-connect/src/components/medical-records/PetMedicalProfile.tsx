import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Examination = {
  created_at: string;
  id: number;
  appointment_id: number;
  diagnosis: string;
  prescription: string;
  follow_up_date?: string;
};

type PetMedicalProfileProps = {
  pet: {
    id: string;
    petName: string;
    petType: string;
    petBreed?: string;
    ownername: string;
    age?: number;
    weight?: number;
    gender?: string;
    furColor?: string;
    healthStatus?: string;
    dietPlan?: string;
    medicalHistory?: string;
    vaccinationHistory?: string;
    examinations: Examination[];
  };
};

const PetMedicalProfile: React.FC<PetMedicalProfileProps> = ({ pet }) => {
  const examinations = pet.examinations || []; // Ensure examinations is always an array

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Pet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Pet Name</p>
              <p className="text-lg">{pet.petName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Owner</p>
              <p className="text-lg">{pet.ownername}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Type</p>
              <p className="text-lg">{pet.petType}</p>
            </div>
            {pet.petBreed && (
              <div>
                <p className="text-sm font-medium">Breed</p>
                <p className="text-lg">{pet.petBreed}</p>
              </div>
            )}
            {pet.age && (
              <div>
                <p className="text-sm font-medium">Age</p>
                <p className="text-lg">{pet.age} years</p>
              </div>
            )}
            {pet.weight && (
              <div>
                <p className="text-sm font-medium">Weight</p>
                <p className="text-lg">{pet.weight} kg</p>
              </div>
            )}
            {pet.gender && (
              <div>
                <p className="text-sm font-medium">Gender</p>
                <p className="text-lg">{pet.gender}</p>
              </div>
            )}
            {pet.furColor && (
              <div>
                <p className="text-sm font-medium">Fur Color</p>
                <p className="text-lg">{pet.furColor}</p>
              </div>
            )}
            {pet.healthStatus && (
              <div>
                <p className="text-sm font-medium">Health Status</p>
                <p className="text-lg">{pet.healthStatus}</p>
              </div>
            )}
            {pet.dietPlan && (
              <div>
                <p className="text-sm font-medium">Diet Plan</p>
                <p className="text-lg">{pet.dietPlan}</p>
              </div>
            )}
            {pet.medicalHistory && (
              <div>
                <p className="text-sm font-medium">Medical History</p>
                <p className="text-lg">{pet.medicalHistory}</p>
              </div>
            )}
            {pet.vaccinationHistory && (
              <div>
                <p className="text-sm font-medium">Vaccination History</p>
                <p className="text-lg">{pet.vaccinationHistory}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Medical History</CardTitle>
          <CardDescription>Examination records and treatment history</CardDescription>
        </CardHeader>
        <CardContent>
          {examinations.length > 0 ? ( // Use the local `examinations` variable
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Prescription</TableHead>
                  <TableHead>Follow-up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examinations.map((exam) => exam && (
                  <TableRow key={exam.id}>
                    <TableCell>
                      {format(new Date(exam.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{exam.diagnosis}</TableCell>
                    <TableCell>{exam.prescription}</TableCell>
                    <TableCell>
                      {exam.follow_up_date ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {format(new Date(exam.follow_up_date), 'MMM dd, yyyy')}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No examination records found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PetMedicalProfile;
