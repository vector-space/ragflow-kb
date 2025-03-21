import {
  deleteUser,
  getUsers,
  registerUser,
  updateUser,
} from '@/services/user-admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetUsers = () => {
  return useQuery(['users'], getUsers);
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation(registerUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};
