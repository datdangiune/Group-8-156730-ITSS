
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType = "completed" | "in-progress" | "upcoming" | "canceled" | "pending" | "active" | "inactive";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  // Status color mapping
  const getStatusStyles = () => {
    switch (status) {
      case "completed":
        return "bg-success/15 text-success hover:bg-success/20 border-success/20";
      case "in-progress":
        return "bg-info/15 text-info hover:bg-info/20 border-info/20";
      case "upcoming":
        return "bg-primary/15 text-primary hover:bg-primary/20 border-primary/20";
      case "canceled":
        return "bg-destructive/15 text-destructive hover:bg-destructive/20 border-destructive/20";
      case "pending":
        return "bg-warning/15 text-warning hover:bg-warning/20 border-warning/20";
      case "active":
        return "bg-success/15 text-success hover:bg-success/20 border-success/20";
      case "inactive":
        return "bg-muted-foreground/15 text-muted-foreground hover:bg-muted-foreground/20 border-muted-foreground/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Status display text
  const getStatusLabel = () => {
    switch (status) {
      case "in-progress":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("font-normal rounded-full", getStatusStyles(), className)}
    >
      <span className={`status-dot mr-1.5 bg-current opacity-70`}></span>
      {getStatusLabel()}
    </Badge>
  );
};

export default StatusBadge;
