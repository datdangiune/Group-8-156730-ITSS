
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Stethoscope, 
  Scissors, 
  PawPrint, 
  Heart, 
  Palette , 
  Syringe, 
  Utensils
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pet} from '@/types/pets';
import { getPet } from '@/service/pet';
import { getTokenFromCookies } from '@/service/auth';
import { fetchMedicalHistory, FetchMedicalHistoryResponse } from '@/service/medicalrecord';
import { format } from "date-fns";
const PetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState<Pet | null>(null);
    const [medical, setMedical] = useState<FetchMedicalHistoryResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const token = getTokenFromCookies();
    useEffect(() => {
        const fetchData = async () => {
        try {
            setIsLoading(true);
            if (id) {
                const petId = parseInt(id, 10);
                const petData = await getPet(token, petId);
                const medicalData = await fetchMedicalHistory(petId, token);
                console.log(petData)
                setPet(petData)
                setMedical(medicalData)
            }
        } catch (error) {
            console.error('Error fetching pet details:', error);
            toast.error('Failed to load pet details. Please try again.');
        } finally {
            setIsLoading(false);
        }
        };

        fetchData();
    }, [id]);

  const handleDelete = async () => {
    try {
      // In a real app, this would be an API call
      console.log(`Deleting pet with ID: ${id}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Pet deleted successfully!');
      navigate('/pets');
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error('Failed to delete pet. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 animate-fade-in">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading pet details...</div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 animate-fade-in">
        <div className="h-96 flex flex-col items-center justify-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Pet not found. The pet you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/pets">Return to Pets</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getHealthStatusColor = (status?: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'under-treatment':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'requires-attention':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate("/pets")}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Pets
        </Button>
        <h1 className="text-3xl font-bold">{pet.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{pet.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <PawPrint className="h-4 w-4 mr-1" />
                    <span className="capitalize">{pet.type}</span>
                    {pet.breed && <span> • {pet.breed}</span>}
                  </CardDescription>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(pet.health_status)}`}>
                  {pet.health_status ? pet.health_status.replace('-', ' ') : 'Unknown'} 
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
                <img 
                  src={pet.image || '/placeholder.svg'} 
                  alt={pet.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-card dark:glass-card-dark rounded-lg p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-medium">Age</div>
                  <div className="text-lg">{pet.age} {pet.age === 1 ? 'year' : 'years'}</div>
                </div>
                
                <div className="glass-card dark:glass-card-dark rounded-lg p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-medium">Gender</div>
                  <div className="text-lg capitalize">{pet.gender}</div>
                </div>
                
                <div className="glass-card dark:glass-card-dark rounded-lg p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <Palette  className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-medium">Color</div>
                  <div className="text-lg">{pet.fur_color}</div>
                </div>
                
                <div className="glass-card dark:glass-card-dark rounded-lg p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-medium">Last Checkup</div>
                  <div className="text-lg">{pet.lastCheckup || 'N/A'}</div>
                </div>
              </div>

              <div className="space-y-6">
                {pet.diet_plan && (
                  <div>
                    <h3 className="text-lg font-semibold flex items-center mb-2">
                      <Utensils className="h-5 w-5 mr-2 text-primary" />
                      Diet Plan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {pet.diet_plan}
                    </p>
                  </div>
                )}
                
                {pet.medical_history && (
                  <div>
                    <h3 className="text-lg font-semibold flex items-center mb-2">
                      <Stethoscope className="h-5 w-5 mr-2 text-primary" />
                      Medical History
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {pet.medical_history}
                    </p>
                  </div>
                )}
                
                {pet.vaccination_history && (
                  <div>
                    <h3 className="text-lg font-semibold flex items-center mb-2">
                      <Syringe className="h-5 w-5 mr-2 text-primary" />
                      Vaccination History
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {pet.vaccination_history}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button 
                variant="outline" 
                className="gap-2"
                asChild
              >
                <Link to={`/pets/${pet.id}/edit`}>
                  <Edit className="h-4 w-4" />
                  Edit Details
                </Link>
              </Button>
              
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Pet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete {pet.name}'s profile
                      and all associated records from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Medical History</CardTitle>
              <CardDescription>Examination records and treatment history</CardDescription>
            </CardHeader>
            <CardContent>
              {medical.data.length > 0 ? ( // Use the local `examinations` variable
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
                    {medical.data.map((exam) => exam && (
                      <TableRow key={exam.id}>
                        <TableCell>
                          {format(new Date(exam.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{exam.diagnosis}</TableCell>
                        <TableCell>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {exam.prescription.split(';').map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))}
                          </ul>
                        </TableCell>
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

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link to={`/appointments/book?petId=${pet.id}`}>
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Medical Appointment
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to={`/services?petId=${pet.id}&type=grooming`}>
                  <Scissors className="h-5 w-5 mr-2" />
                  Schedule Grooming
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to={`/services?petId=${pet.id}&type=boarding`}>
                  <PawPrint className="h-5 w-5 mr-2" />
                  Book Boarding
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to={`/history?petId=${pet.id}`}>
                  <Stethoscope className="h-5 w-5 mr-2" />
                  View Medical History
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Care Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-amber-500 rounded-full mr-2"></div>
                  <h4 className="font-medium">Vaccination Due</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Rabies booster due in 2 weeks
                </p>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                  <h4 className="font-medium">Regular Checkup</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Schedule next checkup in 3 months
                </p>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <h4 className="font-medium">Grooming</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Next grooming session recommended in 4 weeks
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;