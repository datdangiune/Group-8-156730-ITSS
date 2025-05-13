import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import UserTable, { UserData } from '@/components/UserTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllUsers, addUser } from '@/service/user';

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state with proper validation
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'client',
    phone_number: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    username: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search query changes
  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      setLoading(true);
      setError('');
      
      const data = await getAllUsers();
      console.log('Users data received:', data);
      
      if (!data || data.length === 0) {
        console.log('No users found or empty array returned');
      }
      
      const formattedUsers: UserData[] = data.map(user => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: (["admin", "staff", "vet", "client"].includes(user.role) ? user.role : "client") as UserData["role"],
        status: 'active',
        lastActive: new Date(user.created_at).toLocaleDateString('en-US')
      }));
      
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError('Unable to load user list');
      toast({
        title: 'Error',
        description: error.message || 'Unable to load user list.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let valid = true;
    const errors = {
      name: '',
      email: '',
      username: ''
    };

    if (!addFormData.name.trim()) {
      errors.name = 'Name is required';
      valid = false;
    }

    if (!addFormData.email.trim()) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(addFormData.email)) {
      errors.email = 'Email is invalid';
      valid = false;
    }

    if (!addFormData.username.trim()) {
      errors.username = 'Username is required';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleAddUser = async () => {
    try {
      console.log('Adding user with form data:', addFormData);
      
      if (!validateForm()) {
        console.log('Form validation failed');
        return;
      }

      setLoading(true);
      
      const response = await addUser({
        name: addFormData.name,
        email: addFormData.email,
        username: addFormData.username,
        role: addFormData.role,
        phone_number: addFormData.phone_number
      });

      console.log('Add user response:', response);

      toast({
        title: 'Success',
        description: 'User added successfully'
      });

      setIsAddDialogOpen(false);
      setAddFormData({
        name: '',
        email: '',
        username: '',
        role: 'client',
        phone_number: ''
      });
      
      // Refresh the user list
      fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add user. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (value: string) => {
    setAddFormData(prev => ({ ...prev, role: value }));
  };

  const resetForm = () => {
    setAddFormData({
      name: '',
      email: '',
      username: '',
      role: 'client',
      phone_number: ''
    });
    setFormErrors({
      name: '',
      email: '',
      username: ''
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}>Add User</Button>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading users...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-md text-red-800">
            <p className="font-medium">Error</p>
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={fetchUsers}
            >
              Try Again
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">No users found</p>
          </div>
        ) : (
          <UserTable data={filteredUsers} />
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsAddDialogOpen(open);
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Enter user details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  value={addFormData.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  type="email"
                  value={addFormData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username <span className="text-red-500">*</span>
                </label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={addFormData.username}
                  onChange={handleInputChange}
                  className={formErrors.username ? "border-red-500" : ""}
                />
                {formErrors.username && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone_number" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  placeholder="Phone Number"
                  value={addFormData.phone_number}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Select value={addFormData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="vet">Vet</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser} disabled={loading}>
                {loading ? 'Adding...' : 'Add User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Users;