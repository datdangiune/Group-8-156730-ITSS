import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import UserTable, { UserData } from '@/components/UserTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllUsers, addUser } from '@/service/user';

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'pet_owner',
    phone_number: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      const formattedUsers: UserData[] = data.map(user => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: (["admin", "staff", "vet", "client"].includes(user.role) ? user.role : "client") as UserData["role"], // Chuyển đổi role
        status: 'active',
        lastActive: new Date(user.created_at).toLocaleDateString('vi-VN')
      }));
      setUsers(formattedUsers);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải danh sách người dùng.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      if (!addFormData.name || !addFormData.email || !addFormData.username) {
        toast({
          title: 'Thiếu thông tin',
          description: 'Vui lòng điền đầy đủ tên, email và tên đăng nhập.',
          variant: 'destructive'
        });
        return;
      }

      await addUser({
        name: addFormData.name,
        email: addFormData.email,
        username: addFormData.username,
        role: addFormData.role,
        phone_number: addFormData.phone_number
      });

      toast({
        title: 'Thành công',
        description: 'Thêm người dùng thành công'
      });

      setIsAddDialogOpen(false);
      setAddFormData({
        name: '',
        email: '',
        username: '',
        role: 'pet_owner',
        phone_number: ''
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể thêm người dùng.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>Thêm người dùng</Button>
        </div>

        <Input
          placeholder="Tìm kiếm người dùng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <UserTable data={users} />
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm người dùng mới</DialogTitle>
            </DialogHeader>
            <div>
              <Input
                placeholder="Tên"
                value={addFormData.name}
                onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={addFormData.email}
                onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
              />
              <Input
                placeholder="Tên đăng nhập"
                value={addFormData.username}
                onChange={(e) => setAddFormData({ ...addFormData, username: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleAddUser}>Thêm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Users;