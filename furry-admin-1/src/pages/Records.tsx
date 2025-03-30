
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Records = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
            <p className="text-muted-foreground">
              View and manage patient medical histories
            </p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search records..." 
                className="pl-10 w-full md:w-[300px]"
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Medical Records</CardTitle>
            <CardDescription>View and manage patient medical histories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                  <div className="bg-vetblue-100 text-vetblue-600 p-3 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Max (German Shepherd)</p>
                    <p className="text-sm text-muted-foreground">Annual checkup and vaccinations</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        Dr. Emily Jones
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        May 15, 2023
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-2">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Records;
