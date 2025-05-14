import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart as BarChartIcon, PieChart } from 'lucide-react';
import BarChart from '@/components/BarChart';
import AreaChart from '@/components/AreaChart';
import { fetchAnalyticsData, RevenueDataItem, ServiceDataItem } from '@/service/analytics';

const Analytics = () => {
  const [revenueData, setRevenueData] = useState<RevenueDataItem[]>([]);
  const [serviceData, setServiceData] = useState<ServiceDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await fetchAnalyticsData();
        setRevenueData(analytics.revenueData);
        setServiceData(analytics.serviceData);
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Review key metrics and performance data
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AreaChart 
                title="Revenue Overview" 
                data={revenueData} 
                dataKey="value" 
                height={280}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Breakdown</CardTitle>
              <CardDescription>Distribution of services provided</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart 
                title="Services Breakdown" 
                data={serviceData} 
                dataKey="value" 
                height={280}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>Overview of important metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <BarChartIcon className="h-5 w-5 text-vetblue-600 mr-2" />
                  <h3 className="font-medium">New Patients</h3>
                </div>
                <p className="text-2xl font-bold">+24%</p>
                <p className="text-sm text-muted-foreground">Compared to last month</p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <PieChart className="h-5 w-5 text-vetblue-600 mr-2" />
                  <h3 className="font-medium">Revenue Growth</h3>
                </div>
                <p className="text-2xl font-bold">+12.5%</p>
                <p className="text-sm text-muted-foreground">Compared to last month</p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <BarChartIcon className="h-5 w-5 text-vetblue-600 mr-2" />
                  <h3 className="font-medium">Avg. Visit Value</h3>
                </div>
                <p className="text-2xl font-bold">$175</p>
                <p className="text-sm text-muted-foreground">+5% from previous month</p>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <PieChart className="h-5 w-5 text-vetblue-600 mr-2" />
                  <h3 className="font-medium">Bookings</h3>
                </div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground">Capacity utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
