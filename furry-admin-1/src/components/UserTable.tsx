
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
import { Check, Lock, MoreHorizontal, Pencil, Shield, Trash2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'vet' | 'user';

}

interface UserTableProps {
  data: UserData[];
  onEdit?: (user: UserData) => void;
  onDelete?: (user: UserData) => void;
  onRoleChange?: (user: UserData, role: 'admin' | 'staff' | 'vet' | 'user') => void;
}

const UserRoleIcon = ({ role }: { role: string }) => {
  switch (role) {
    case 'admin':
      return <Shield className="h-4 w-4 text-vetblue-600" />;
    case 'vet':
      return <User className="h-4 w-4 text-vetgreen-600" />;
    case 'staff':
      return <User className="h-4 w-4 text-vetblue-400" />;
    default:
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
};

const UserTable: React.FC<UserTableProps> = ({
  data,
  onEdit,
  onRoleChange,
}) => {
  return (
    <Table className="animate-fade-in">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <TableRow key={user.id} className="group hover:bg-secondary/30">
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <UserRoleIcon role={user.role} />
                <span className="capitalize">{user.role}</span>
              </div>
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
                  
                  {onRoleChange && (
                    <>
                      <DropdownMenuItem onSelect={() => onRoleChange(user, 'admin')}>
                        <Shield className="h-4 w-4 mr-2 text-vetblue-600" />
                        Set as Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onRoleChange(user, 'vet')}>
                        <User className="h-4 w-4 mr-2 text-vetgreen-600" />
                        Set as Vet
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onRoleChange(user, 'staff')}>
                        <User className="h-4 w-4 mr-2 text-vetblue-400" />
                        Set as Staff
                      </DropdownMenuItem>
                    </>
                  )}
                    
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
