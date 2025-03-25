
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

interface BarChartProps {
  title: string;
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  categories?: { key: string; name: string; color: string }[];
  height?: number;
  description?: string;
}

const BarChart: React.FC<BarChartProps> = ({ 
  title, 
  data, 
  dataKey, 
  xAxisKey = "name", 
  categories,
  height = 300,
  description
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis 
              dataKey={xAxisKey} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 12 }} 
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }} 
            />
            {categories ? (
              categories.map((category) => (
                <Bar 
                  key={category.key} 
                  dataKey={category.key} 
                  name={category.name} 
                  fill={category.color} 
                  radius={[4, 4, 0, 0]} 
                />
              ))
            ) : (
              <Bar 
                dataKey={dataKey} 
                fill="#4990ff" 
                radius={[4, 4, 0, 0]} 
              />
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChart;
