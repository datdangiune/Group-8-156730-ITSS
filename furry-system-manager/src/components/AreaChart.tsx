
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Area, 
  AreaChart as RechartsAreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

interface AreaChartProps {
  title: string;
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  description?: string;
  height?: number;
}

const AreaChart: React.FC<AreaChartProps> = ({ 
  title, 
  data, 
  dataKey, 
  xAxisKey = "name", 
  color = "#4990ff", 
  description,
  height = 300
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsAreaChart
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill={`url(#color-${dataKey})`} 
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AreaChart;
