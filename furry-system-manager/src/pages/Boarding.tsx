import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getBoardingData } from '@/services/AdminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Boarding: React.FC = () => {
    const [boardingData, setBoardingData] = useState([]);

    useEffect(() => {
        getBoardingData()
            .then((data) => setBoardingData(data))
            .catch((err) => console.error('Error fetching boarding data:', err));
    }, []);

    return (
        <Layout>
            <Card>
                <CardHeader>
                    <CardTitle>Boarding Management</CardTitle>
                </CardHeader>
                <CardContent>
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
                                    <TableCell>{room.petName || 'Vacant'}</TableCell>
                                    <TableCell>{room.ownerName || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Boarding;
