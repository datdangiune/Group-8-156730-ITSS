import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getAllUsers, updateUserRole } from '@/services/AdminService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const Users: React.FC = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllUsers()
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching users:', err.message); // Log the error
                toast({
                    title: 'Error',
                    description: err.message || 'Failed to fetch users.',
                    variant: 'destructive',
                });
                setLoading(false);
            });
    }, []);

    const handleRoleChange = (userId: string, role: string) => {
        updateUserRole(userId, role)
            .then(() => {
                setUsers((prevUsers) =>
                    prevUsers.map((user: any) =>
                        user.id === userId ? { ...user, role } : user
                    )
                );
                toast({
                    title: 'Role updated',
                    description: 'User role has been updated successfully.',
                });
            })
            .catch((err) => {
                console.error('Error updating role:', err.message); // Log the error
                toast({
                    title: 'Error',
                    description: err.message || 'Failed to update user role.',
                    variant: 'destructive',
                });
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: any) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Select
                                        value={user.role}
                                        onValueChange={(value) => handleRoleChange(user.id, value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem> {/* Replace "client" with "user" */}
                                            <SelectItem value="staff">Staff</SelectItem>
                                            <SelectItem value="vet">Vet</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>{user.status}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        onClick={() => console.log('Lock/Delete user:', user.id)}
                                    >
                                        Lock/Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
};

export default Users;
