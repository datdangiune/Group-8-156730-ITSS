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
  email: string;
  role: 'admin' | 'staff' | 'vet' | 'client';
  status: 'active' | 'inactive' | 'locked';
  lastActive?: string;
}

interface UserTableProps {
  data: UserData[];
  onEdit?: (user: UserData) => void;
  onDelete?: (user: UserData) => void;
  onStatusChange?: (user: UserData, status: 'active' | 'inactive' | 'locked') => void;
  onRoleChange?: (user: UserData, role: 'admin' | 'staff' | 'vet' | 'client') => void;
  onChangePassword?: (user: UserData) => void;
  getRoleDisplay?: (role: string) => string;
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
  onDelete,
  onStatusChange,
  onRoleChange,
  onChangePassword,
  getRoleDisplay
}) => {
  return (
    <Table className="animate-fade-in">
      <TableHeader>
        <TableRow>
          <TableHead>Tên</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Hoạt động gần nhất</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
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
                <span className="capitalize">{getRoleDisplay ? getRoleDisplay(user.role) : user.role}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  user.status === 'active' && "border-vetgreen-200 text-vetgreen-600 bg-vetgreen-50",
                  user.status === 'inactive' && "border-muted text-muted-foreground bg-muted/30",
                  user.status === 'locked' && "border-vetred-200 text-vetred-600 bg-vetred-50"
                )}
              >
                {user.status === 'active' && 'Hoạt động'}
                {user.status === 'inactive' && 'Không hoạt động'}
                {user.status === 'locked' && 'Bị khóa'}
              </Badge>
            </TableCell>
            <TableCell>{user.lastActive || 'Chưa bao giờ'}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Thao tác</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onSelect={() => onEdit(user)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                  )}
                  
                  {onChangePassword && (
                    <DropdownMenuItem onSelect={() => onChangePassword(user)}>
                      <Lock className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </DropdownMenuItem>
                  )}
                  
                  {onStatusChange && (
                    <>
                      {user.status !== 'active' && (
                        <DropdownMenuItem onSelect={() => onStatusChange(user, 'active')}>
                          <Check className="h-4 w-4 mr-2 text-vetgreen-500" />
                          Kích hoạt
                        </DropdownMenuItem>
                      )}
                      {user.status !== 'locked' && (
                        <DropdownMenuItem onSelect={() => onStatusChange(user, 'locked')}>
                          <Lock className="h-4 w-4 mr-2 text-vetred-500" />
                          Khóa tài khoản
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                  
                  {onRoleChange && (
                    <>
                      <DropdownMenuItem onSelect={() => onRoleChange(user, 'admin')}>
                        <Shield className="h-4 w-4 mr-2 text-vetblue-600" />
                        Đặt làm Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onRoleChange(user, 'vet')}>
                        <User className="h-4 w-4 mr-2 text-vetgreen-600" />
                        Đặt làm Bác sĩ
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onRoleChange(user, 'staff')}>
                        <User className="h-4 w-4 mr-2 text-vetblue-400" />
                        Đặt làm Nhân viên
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {onDelete && (
                    <DropdownMenuItem 
                      onSelect={() => onDelete(user)}
                      className="text-red-600 hover:text-red-700 focus:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
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