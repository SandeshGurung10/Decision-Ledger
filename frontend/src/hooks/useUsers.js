import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../services/userService';

import { getCurrentUser, updateCurrentUser, deleteCurrentUser } from '../services/userService';
import api from '../services/api'; // for password change

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers().then(res => res.data),
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};


// Hook for fetching current user (optional, can be done via useQuery directly)
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser().then(res => res.data),
  });
};

// Mutation for updating profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => updateCurrentUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['users'] }); // if needed
    },
  });
};

// Mutation for changing password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData) => api.patch('/users/updateMyPassword', passwordData),
  });
};

// Mutation for deleting account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // careful: can't use hook here, we'll handle in component
  return useMutation({
    mutationFn: () => deleteCurrentUser(),
    onSuccess: () => {
      // Clear auth and redirect to login
      localStorage.removeItem('token');
      queryClient.clear();
      window.location.href = '/login'; // or use navigate if passed
    },
  });
};