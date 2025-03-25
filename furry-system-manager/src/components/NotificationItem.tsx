
import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Bell, Clock } from 'lucide-react';

interface NotificationItemProps {
  title: string;
  description?: string;
  time: string;
  icon?: React.ReactNode;
  read?: boolean;
  className?: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  description,
  time,
  icon,
  read = false,
  className,
}) => {
  return (
    <div 
      className={cn(
        "p-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors animate-fade-in",
        !read && "bg-secondary/20",
        className
      )}
    >
      <div className="flex">
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3",
          !read ? "bg-vetblue-100" : "bg-secondary"
        )}>
          {icon || <Bell className={cn("h-5 w-5", !read ? "text-vetblue-600" : "text-muted-foreground")} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className={cn(
              "text-sm font-medium truncate",
              !read && "font-semibold"
            )}>
              {title}
            </p>
            <div className="flex items-center text-xs text-muted-foreground ml-2">
              <Clock className="h-3 w-3 mr-1" />
              <span>{time}</span>
            </div>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground truncate mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
