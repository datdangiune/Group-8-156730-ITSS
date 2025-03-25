
import React from "react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  className?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
}) => {
  return (
    <div className={cn("p-6 bg-card rounded-xl shadow-sm border hover-card", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-1">
              <span
                className={cn(
                  "text-xs font-medium flex items-center",
                  change.type === "increase" ? "text-success" : "text-destructive"
                )}
              >
                {change.type === "increase" ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                {Math.abs(change.value)}%
              </span>
              <span className="ml-1 text-xs text-muted-foreground">
                from last month
              </span>
            </div>
          )}
        </div>
        
        <div className="rounded-full p-3 bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
