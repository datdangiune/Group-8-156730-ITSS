
import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    timeframe: string;
    positive?: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  className 
}) => {
  return (
    <div className={cn("stat-card animate-fade-in", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              {change.positive ? (
                <TrendingUp className="h-4 w-4 text-vetgreen-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-vetred-500 mr-1" />
              )}
              <p className={cn(
                "text-xs font-medium",
                change.positive ? "text-vetgreen-500" : "text-vetred-500"
              )}>
                {change.positive ? "+" : "-"}{Math.abs(change.value)}% {change.timeframe}
              </p>
            </div>
          )}
        </div>
        
        <div className="rounded-lg p-2 bg-secondary/50">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
