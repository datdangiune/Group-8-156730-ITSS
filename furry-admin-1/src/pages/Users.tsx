import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import UserTable, { UserData } from '@/components/UserTable';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, User, UserPlus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { fetchSimpleUserList, setUserAsAdmin, setUserAsVet, setUserAsStaff, SimpleUser, addUser } from '@/service/user';

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'pet_owner', // Change default to 'pet_owner'
  });

  // Fetch users from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSimpleUserList();
        setUsers(data as UserData[]);
      } catch (error: any) {
        toast.error("Failed to fetch users");
      }
    };
    fetchData();
  }, []);

  // Filtered users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (user: UserData) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentUser) return;

    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === currentUser.id 
          ? { ...user, name: formData.name, email: formData.email, role: formData.role as any} 
          : user
      )
    );

    toast("User updated", {
      description: `${formData.name}'s details have been updated.`,
    });

    setIsEditDialogOpen(false);
  };

  const handleAddUser = async () => {
    try {
      await addUser({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role, // Always use one of: 'admin', 'pet_owner', 'vet', 'staff'
      });
      toast("User added", {
        description: `${formData.name} has been added successfully.`,
      });
      // Optionally, refresh user list after adding
      // const data = await fetchSimpleUserList();
      // setUsers(data as UserData[]);
      setIsAddDialogOpen(false);
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'pet_owner', // Reset to 'pet_owner'
      });
    } catch (error: any) {
      toast.error("Failed to add user", {
        description: error.message || "An error occurred while adding user.",
      });
    }
  };

  const handleDelete = (user: UserData) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!currentUser) return;

    setUsers(prevUsers => prevUsers.filter(user => user.id !== currentUser.id));

    toast.error("User deleted", {
      description: `${currentUser.name} has been deleted.`,
    });

    setIsDeleteDialogOpen(false);
  };

  // Role change handlers
  const handleSetAsAdmin = async (user: UserData) => {
    try {
      await setUserAsAdmin(user.id);
      setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, role: 'admin' } : u));
      toast.success(`${user.name} is now an Admin`);
    } catch (error: any) {
      toast.error("Failed to set as Admin");
    }
  };

  const handleSetAsVet = async (user: UserData) => {
    try {
      await setUserAsVet(user.id);
      setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, role: 'vet' } : u));
      toast.success(`${user.name} is now a Vet`);
    } catch (error: any) {
      toast.error("Failed to set as Vet");
    }
  };

  const handleSetAsStaff = async (user: UserData) => {
    try {
      await setUserAsStaff(user.id);
      setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, role: 'staff' } : u));
      toast.success(`${user.name} is now Staff`);
    } catch (error: any) {
      toast.error("Failed to set as Staff");
    }
  };

  // Pass role change handlers to UserTable
  const handleRoleChange = (user: UserData, role: 'admin' | 'staff' | 'vet' | 'user') => {
    if (role === 'admin') return handleSetAsAdmin(user);
    if (role === 'vet') return handleSetAsVet(user);
    if (role === 'staff') return handleSetAsStaff(user);
    // For 'user', just update locally
    setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, role } : u));
    toast.success(`${user.name}'s role set to User`);
  };

  const openAddDialog = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'pet_owner',
    });
    setIsAddDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
          </div>
          <Button onClick={openAddDialog} className="animate-fade-in">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage all user accounts in the system</CardDescription>
            <div className="mt-4 max-w-md">
              <Input 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <UserTable 
              data={filteredUsers} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRoleChange={handleRoleChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account in the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-username">Username</Label>
              <Input
                id="add-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-password">Password</Label>
              <Input
                id="add-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="add-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="vet">Vet</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="pet_owner">Pet Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Users;
