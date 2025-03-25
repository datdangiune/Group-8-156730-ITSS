
import React, { useState } from "react";
import { Bell, CheckCircle, ChevronDown, Search } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notifications } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Notifications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter notifications based on search query and type filter
  const filteredNotifications = notifications.filter(notification => {
    // Filter by type
    if (filter !== "all" && notification.type !== filter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Group notifications by date
  const groupedNotifications: Record<string, typeof notifications> = {};
  
  filteredNotifications.forEach(notification => {
    // Check if the notification time contains "ago", "Yesterday", or another date format
    let group = "Today";
    if (notification.time.toLowerCase().includes("yesterday")) {
      group = "Yesterday";
    } else if (!notification.time.toLowerCase().includes("ago")) {
      group = "Earlier";
    }
    
    if (!groupedNotifications[group]) {
      groupedNotifications[group] = [];
    }
    
    groupedNotifications[group].push(notification);
  });
  
  // Generate background color based on notification type
  const getBackgroundColor = (type: string) => {
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
  
  // Get icon based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Bell className="h-4 w-4" />;
      case "message":
        return <Bell className="h-4 w-4" />;
      case "service":
        return <Bell className="h-4 w-4" />;
      case "boarding":
        return <Bell className="h-4 w-4" />;
      case "reminder":
        return <Bell className="h-4 w-4" />;
      case "alert":
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  return (
    <PageTransition>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-medium mb-4 md:mb-0">Notifications</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-52">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="service">Services</SelectItem>
                <SelectItem value="boarding">Boarding</SelectItem>
                <SelectItem value="reminder">Reminders</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex-1 md:ml-auto">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full max-w-[300px] grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="read">Read</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {Object.keys(groupedNotifications).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedNotifications).map(([date, notifications]) => (
                <div key={date}>
                  <Collapsible defaultOpen>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent>
                      <div className="space-y-2">
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 rounded-lg border ${
                              notification.read
                                ? "bg-card hover:bg-muted/10"
                                : "bg-muted/5 hover:bg-muted/10 border-muted"
                            } transition-colors cursor-pointer`}
                          >
                            <div className="flex gap-3">
                              <div className={`rounded-full p-2 ${getBackgroundColor(notification.type)}`}>
                                {getIcon(notification.type)}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">
                                    {notification.title}
                                    {!notification.read && (
                                      <span className="inline-block h-2 w-2 rounded-full bg-primary ml-2"></span>
                                    )}
                                  </h4>
                                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Notifications;
