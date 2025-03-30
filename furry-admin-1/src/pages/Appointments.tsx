
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

const Appointments = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">
              Manage and schedule appointments for your patients
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Appointments scheduled for today and upcoming days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                    <div className="bg-vetblue-100 text-vetblue-600 p-3 rounded-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Annual Checkup - Rex (Golden Retriever)</p>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Tomorrow, 10:00 AM</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Dr. Sarah Wilson</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Completed appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                    <div className="bg-gray-100 text-gray-600 p-3 rounded-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Vaccination - Luna (Siamese Cat)</p>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>2 days ago, 3:30 PM</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Dr. Michael Chen</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
