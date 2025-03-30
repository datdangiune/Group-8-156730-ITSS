
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Boarding = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Boarding</h1>
            <p className="text-muted-foreground">
              Manage pet boarding accommodations and schedules
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Occupied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-vetblue-600">16</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reserved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">3</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Boarders</CardTitle>
            <CardDescription>Pets currently staying at our facility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                  <div className="bg-vetblue-100 text-vetblue-600 p-3 rounded-lg">
                    <Home className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <p className="font-medium">Buddy (Beagle)</p>
                      <Badge variant="outline">Room {index + 101}</Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>May 10 - May 17, 2023</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Special needs: Medication twice daily, afternoon walks
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Boarding;
