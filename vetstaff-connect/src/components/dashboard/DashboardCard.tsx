
import React, { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
}) => {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover-card border-none shadow-md shadow-black/5",
        className
      )}
    >
      <CardHeader className={cn("pb-2", headerClassName)}>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn("p-0", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
