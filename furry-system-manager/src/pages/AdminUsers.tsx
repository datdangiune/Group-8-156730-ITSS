import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '../services/AdminService';

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Gọi API để lấy danh sách người dùng
    getAllUsers()
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUserRole(userId, newRole)
      .then(() => {
        alert('Role updated successfully!');
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      })
      .catch((error) => console.error('Error updating role:', error));
  };

  return (
    <div>
      <h1>Admin - User List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleRoleChange(user.id, 'admin')}>
                  Make Admin
                </button>
                <button onClick={() => handleRoleChange(user.id, 'user')}>
                  Make User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;