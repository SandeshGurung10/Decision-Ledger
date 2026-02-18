import { useUsers, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
// ... imports

export const UserManagement = () => {
  const { data, isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const users = data?.data?.users || [];
  // ... handlers
};