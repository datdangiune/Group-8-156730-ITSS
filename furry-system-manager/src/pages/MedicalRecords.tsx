import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getAllMedicalRecords, deleteMedicalRecord } from '@/services/AdminService';
import { toast } from '@/hooks/use-toast';
import { getTokenFromCookies } from '@/services/AdminAuthService';
import { useNavigate } from 'react-router-dom';

const MedicalRecords: React.FC = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = getTokenFromCookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to login if no token
        }
    }, [token]);

    useEffect(() => {
        fetchMedicalRecords();
    }, []);

    const fetchMedicalRecords = async () => {
        try {
            const data = await getAllMedicalRecords();
            setMedicalRecords(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching medical records:', err.message);
            toast({
                title: 'Error',
                description: err.message || 'Failed to fetch medical records.',
                variant: 'destructive',
            });
            setLoading(false);
        }
    };

    const handleDeleteMedicalRecord = async (id: string) => {
        try {
            await deleteMedicalRecord(id);
            setMedicalRecords((prevRecords) =>
                prevRecords.filter((record) => record.id !== id)
            );
            toast({
                title: 'Medical record deleted',
                description: 'Medical record has been deleted successfully.',
            });
        } catch (err) {
            console.error('Error deleting medical record:', err.message);
            toast({
                title: 'Error',
                description: 'Failed to delete medical record.',
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
                <h1 className="text-3xl font-bold">Medical Records Management</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pet</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Diagnosis</TableHead>
                            <TableHead>Treatment</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {medicalRecords.map((record: any) => (
                            <TableRow key={record.id}>
                                <TableCell>{record.petName}</TableCell>
                                <TableCell>{record.ownerName}</TableCell>
                                <TableCell>{record.diagnosis}</TableCell>
                                <TableCell>{record.treatment}</TableCell>
                                <TableCell>{new Date(record.date).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteMedicalRecord(record.id)}
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

export default MedicalRecords;
