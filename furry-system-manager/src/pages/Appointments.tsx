import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getAllAppointments, deleteAppointment } from '@/services/AdminService';
import { toast } from '@/hooks/use-toast';
import { getTokenFromCookies } from '@/services/AdminAuthService';
import { useNavigate } from 'react-router-dom';

const Appointments: React.FC = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = getTokenFromCookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const data = await getAllAppointments();
            setAppointments(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching appointments:', err.message);
            toast({
                title: 'Error',
                description: err.message || 'Failed to fetch appointments.',
                variant: 'destructive',
            });
            setLoading(false);
        }
    };

    const handleDeleteAppointment = async (id: string) => {
        try {
            await deleteAppointment(id);
            setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.id !== id)
            );
            toast({
                title: 'Appointment deleted',
                description: 'Appointment has been deleted successfully.',
            });
        } catch (err) {
            console.error('Error deleting appointment:', err.message);
            toast({
                title: 'Error',
                description: 'Failed to delete appointment.',
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Appointment Management</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pet</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Staff</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map((appointment: any) => (
                            <TableRow key={appointment.id}>
                                <TableCell>{appointment.petName}</TableCell>
                                <TableCell>{appointment.ownerName}</TableCell>
                                <TableCell>{appointment.staffName || 'N/A'}</TableCell>
                                <TableCell>{new Date(appointment.appointment_date).toLocaleString()}</TableCell>
                                <TableCell>{appointment.reason || 'N/A'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteAppointment(appointment.id)}
                                    >
                                        Delete
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

export default Appointments;
