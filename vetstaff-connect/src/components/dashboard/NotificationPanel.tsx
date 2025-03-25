
import React from "react";
import { Bell, Calendar, Heart, Home, MessageCircle, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "appointment" | "message" | "service" | "boarding" | "reminder" | "alert";
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  className?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  className,
}) => {
  const navigate = useNavigate();
  
  // Get icon based on notification type
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4" />;
      case "message":
        return <MessageCircle className="h-4 w-4" />;
      case "service":
        return <Stethoscope className="h-4 w-4" />;
      case "boarding":
        return <Home className="h-4 w-4" />;
      case "reminder":
        return <Heart className="h-4 w-4" />;
      case "alert":
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  // Get background color based on notification type
  const getBackgroundColor = (type: Notification["type"]) => {
    switch (type) {
      case "appointment":
        return "bg-primary/10 text-primary";
      case "message":
        return "bg-info/10 text-info";
      case "service":
        return "bg-success/10 text-success";
      case "boarding":
        return "bg-accent/10 text-accent";
      case "reminder":
        return "bg-warning/10 text-warning";
      case "alert":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
  return (
    <div className={cn("divide-y", className)}>
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Bell className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="font-medium">No notifications</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You're all caught up!
          </p>
        </div>
      ) : (
        <>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex gap-3 p-4 transition-colors hover:bg-muted/20",
                notification.read ? "" : "bg-muted/10"
              )}
            >
              <div className={cn("rounded-full p-2", getBackgroundColor(notification.type))}>
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
          
          <div className="p-4 text-center">
            <Button variant="outline" onClick={() => navigate("/notifications")}>
              View all notifications
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;
