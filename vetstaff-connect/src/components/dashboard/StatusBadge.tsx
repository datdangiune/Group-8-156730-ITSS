import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Done" | "Scheduled" | "Cancel" | "Cancelled" |"available" | "unavailable" | "paid" | "pending" | "In Progress" | "Completed" | "Paid" | undefined; // Allow undefined to handle edge cases
}

const getStatusLabel = (status: string | undefined) => {
  if (!status) return "Unknown"; // Fallback label if status is undefined
  return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
};

const getStatusColor = (status: string | undefined) => {
  if (!status) return "bg-gray-100 text-gray-600"; // Fallback color if status is undefined
  switch (status) {
    case "Done":
      return "bg-green-100 text-green-600";
    case "available":
      return "bg-green-100 text-green-600";
    case "In Progress":
      return "bg-blue-100 text-blue-600";
    case "Scheduled":
      return "bg-yellow-100 text-yellow-600";
    case "Cancel":
      return "bg-red-100 text-red-600";
    case "Cancelled":
      return "bg-red-100 text-red-600";
    case "unavailable":
      return "bg-red-100 text-red-600";
    case "paid":
      return "bg-green-100 text-green-600";    
    case "Paid":
      return "bg-green-100 text-green-600";    
    case "pending":
      return "bg-blue-100 text-blue-600";
    case "Completed":
      return "bg-green-100 text-green-600";

    default:
      return "bg-gray-100 text-gray-600";
    
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-full",
        getStatusColor(status)
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
