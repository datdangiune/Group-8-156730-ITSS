
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, AlertCircle, InfoIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Notifications = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with system alerts and messages
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
            Mark all as read
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                      <div className={`p-2 rounded-full ${
                        index % 3 === 0 ? "bg-vetblue-100 text-vetblue-600" : 
                        index % 3 === 1 ? "bg-amber-100 text-amber-600" : 
                        "bg-green-100 text-green-600"
                      }`}>
                        {index % 3 === 0 ? <InfoIcon className="h-5 w-5" /> :
                         index % 3 === 1 ? <AlertCircle className="h-5 w-5" /> :
                         <CheckCircle className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">
                          {index % 3 === 0 ? "Appointment reminder" : 
                           index % 3 === 1 ? "Low inventory alert" : 
                           "Payment received"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {index % 3 === 0 ? "Dr. Wilson has 5 appointments scheduled tomorrow" : 
                           index % 3 === 1 ? "Vaccine inventory is running low. Please reorder soon." : 
                           "Payment of $250 received for invoice #1234"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {index % 2 === 0 ? "2 hours ago" : "Yesterday"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="unread" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                      <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">Low inventory alert</p>
                        <p className="text-sm text-muted-foreground">
                          Vaccine inventory is running low. Please reorder soon.
                        </p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="alerts">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                      <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">System alert</p>
                        <p className="text-sm text-muted-foreground">
                          Database backup scheduled for tonight at 2 AM.
                        </p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="system">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                      <div className="bg-vetblue-100 text-vetblue-600 p-2 rounded-full">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">System update</p>
                        <p className="text-sm text-muted-foreground">
                          System will undergo maintenance on Sunday, May 28th at 11 PM.
                        </p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Notifications;
