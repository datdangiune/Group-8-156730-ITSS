
import React, { useState } from 'react';
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
import { toast } from '@/hooks/use-toast';
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

const Users = () => {
  // Mock data for users
  const initialUsers = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@vetclinic.com',
      role: 'vet' as const,
      status: 'active' as const,
      lastActive: 'Today at 3:45 PM',
    },
    {
      id: '2',
      name: 'James Wilson',
      email: 'james.wilson@vetclinic.com',
      role: 'admin' as const,
      status: 'active' as const,
      lastActive: 'Today at 2:30 PM',
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@vetclinic.com',
      role: 'staff' as const,
      status: 'active' as const,
      lastActive: 'Yesterday at 5:15 PM',
    },
    {
      id: '4',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      role: 'client' as const,
      status: 'active' as const,
      lastActive: '3 days ago',
    },
    {
      id: '5',
      name: 'Jessica Smith',
      email: 'jessica.smith@example.com',
      role: 'client' as const,
      status: 'inactive' as const,
      lastActive: '2 weeks ago',
    },
    {
      id: '6',
      name: 'Dr. Robert Lee',
      email: 'robert.lee@vetclinic.com',
      role: 'vet' as const,
      status: 'locked' as const,
      lastActive: '1 month ago',
    },
  ];

  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'client',
    status: 'active',
  });

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
      role: user.role,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentUser) return;

    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === currentUser.id 
          ? { ...user, name: formData.name, email: formData.email, role: formData.role as any, status: formData.status as any } 
          : user
      )
    );

    toast({
      title: 'User updated',
      description: `${formData.name}'s details have been updated.`,
    });

    setIsEditDialogOpen(false);
  };

  const handleAddUser = () => {
    const newUser: UserData = {
      id: (users.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role as any,
      status: formData.status as any,
      lastActive: 'Never',
    };

    setUsers(prevUsers => [...prevUsers, newUser]);

    toast({
      title: 'User added',
      description: `${formData.name} has been added successfully.`,
    });

    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      role: 'client',
      status: 'active',
    });
  };

  const handleDelete = (user: UserData) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!currentUser) return;

    setUsers(prevUsers => prevUsers.filter(user => user.id !== currentUser.id));

    toast({
      title: 'User deleted',
      description: `${currentUser.name} has been deleted.`,
      variant: 'destructive',
    });

    setIsDeleteDialogOpen(false);
  };

  const handleStatusChange = (user: UserData, status: 'active' | 'inactive' | 'locked') => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id 
          ? { ...u, status } 
          : u
      )
    );

    const statusMessage = status === 'active' 
      ? 'activated' 
      : status === 'locked' 
        ? 'locked' 
        : 'deactivated';

    toast({
      title: `User ${statusMessage}`,
      description: `${user.name}'s account has been ${statusMessage}.`,
    });
  };

  const handleRoleChange = (user: UserData, role: 'admin' | 'staff' | 'vet' | 'client') => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id 
          ? { ...u, role } 
          : u
      )
    );

    toast({
      title: 'User role updated',
      description: `${user.name}'s role has been changed to ${role}.`,
    });
  };

  const openAddDialog = () => {
    setFormData({
      name: '',
      email: '',
      role: 'client',
      status: 'active',
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
              onStatusChange={handleStatusChange}
              onRoleChange={handleRoleChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {currentUser?.name}'s account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-vetred-500 text-white hover:bg-vetred-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user's details and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="vet">Veterinarian</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  <SelectItem value="vet">Veterinarian</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="add-status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
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
