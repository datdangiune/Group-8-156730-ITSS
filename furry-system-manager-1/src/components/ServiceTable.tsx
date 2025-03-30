
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ServiceData {
  id: string;
  name: string;
  category: 'grooming' | 'boarding' | 'medical' | 'other';
  price: number;
  duration: string;
  isActive: boolean;
}

interface ServiceTableProps {
  data: ServiceData[];
  onEdit?: (service: ServiceData) => void;
  onDelete?: (service: ServiceData) => void;
  onToggleActive?: (service: ServiceData) => void;
}

const categoryColors = {
  grooming: { bg: 'bg-vetblue-50', text: 'text-vetblue-600', border: 'border-vetblue-200' },
  boarding: { bg: 'bg-vetgreen-50', text: 'text-vetgreen-600', border: 'border-vetgreen-200' },
  medical: { bg: 'bg-vetred-50', text: 'text-vetred-600', border: 'border-vetred-200' },
  other: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted-foreground' },
};

const ServiceTable: React.FC<ServiceTableProps> = ({
  data,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Table className="animate-fade-in">
      <TableHeader>
        <TableRow>
          <TableHead>Service Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((service) => {
          const categoryColor = categoryColors[service.category];
          
          return (
            <TableRow key={service.id} className="group hover:bg-secondary/30">
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    categoryColor.bg,
                    categoryColor.text,
                    categoryColor.border
                  )}
                >
                  {service.category}
                </Badge>
              </TableCell>
              <TableCell>{formatPrice(service.price)}</TableCell>
              <TableCell>{service.duration}</TableCell>
              <TableCell>
                {service.isActive ? (
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-vetgreen-500 mr-2"></span>
                    <span className="text-vetgreen-700">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground mr-2"></span>
                    <span className="text-muted-foreground">Inactive</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onEdit?.(service)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    
                    {onToggleActive && (
                      <DropdownMenuItem onSelect={() => onToggleActive(service)}>
                        {service.isActive ? (
                          <>
                            <X className="h-4 w-4 mr-2 text-vetred-500" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2 text-vetgreen-500" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    
                    {onDelete && (
                      <DropdownMenuItem
                        onSelect={() => onDelete(service)}
                        className="text-red-600 hover:text-red-700 focus:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ServiceTable;
