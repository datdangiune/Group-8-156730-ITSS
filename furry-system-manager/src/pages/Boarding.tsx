import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getBoardingData } from '@/services/AdminService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { getTokenFromCookies } from '@/services/AdminAuthService';
import { useNavigate } from 'react-router-dom';

const Boarding: React.FC = () => {
    const [boardingData, setBoardingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = getTokenFromCookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    useEffect(() => {
        fetchBoardingData();
    }, []);

    const fetchBoardingData = async () => {
        try {
            const data = await getBoardingData();
            setBoardingData(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching boarding data:', err.message);
            toast({
                title: 'Error',
                description: err.message || 'Failed to fetch boarding data.',
                variant: 'destructive',
            });
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Boarding Management</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Room</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Pet</TableHead>
                            <TableHead>Owner</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {boardingData.map((room: any) => (
                            <TableRow key={room.id}>
                                <TableCell>{room.name}</TableCell>
                                <TableCell>{room.status}</TableCell>
                                <TableCell>{room.pet?.name || 'Vacant'}</TableCell>
                                <TableCell>{room.owner?.name || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
};

export default Boarding;
