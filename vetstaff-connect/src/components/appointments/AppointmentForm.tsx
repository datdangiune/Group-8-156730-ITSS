import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { fetchUsers, fetchPetsByUserId, User, Pet } from "@/service/Appointments";

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: any) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPets, setLoadingPets] = useState(false);

  useEffect(() => {
    const fetchUsersData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        setLoadingUsers(true);
        const usersData = await fetchUsers(token);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isOpen) {
      fetchUsersData();
    }
  }, [isOpen]);

  const handleUserSelect = async (userId: string) => {
    setSelectedUser(userId);
    setSelectedPet(null); // Reset selected pet
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setLoadingPets(true);
      const petsData = await fetchPetsByUserId(token, parseInt(userId));
      setPets(petsData);
    } catch (error) {
      console.error("Error fetching pets:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPets(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedUser || !selectedPet) {
      toast({
        title: "Missing information",
        description: "Please select a user and a pet.",
        variant: "destructive",
      });
      return;
    }

    const newAppointment = {
      userId: selectedUser,
      petId: selectedPet,
    };

    onSave(newAppointment);
    toast({
      title: "Appointment created",
      description: "New appointment has been successfully created.",
    });

    // Reset form
    setStep(1);
    setSelectedUser(null);
    setSelectedPet(null);
    setPets([]);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Step 1: Select User</h3>
            <Select
              value={selectedUser}
              onValueChange={handleUserSelect}
              disabled={loadingUsers}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select a user"} />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedUser}
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Step 2: Select Pet</h3>
            <Select
              value={selectedPet}
              onValueChange={setSelectedPet}
              disabled={loadingPets}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingPets ? "Loading pets..." : "Select a pet"} />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id.toString()}>
                    {pet.name} ({pet.breed})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" onClick={handleSubmit} disabled={!selectedPet}>
                Submit
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
