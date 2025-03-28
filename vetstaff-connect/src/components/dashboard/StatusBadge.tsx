import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "completed" | "in-progress" | "upcoming" | "canceled" | undefined; // Allow undefined to handle edge cases
}

const getStatusLabel = (status: string | undefined) => {
  if (!status) return "Unknown"; // Fallback label if status is undefined
  return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
};

const getStatusColor = (status: string | undefined) => {
  if (!status) return "bg-gray-100 text-gray-600"; // Fallback color if status is undefined
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-600";
    case "in-progress":
      return "bg-blue-100 text-blue-600";
    case "upcoming":
      return "bg-yellow-100 text-yellow-600";
    case "canceled":
      return "bg-red-100 text-red-600";
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
