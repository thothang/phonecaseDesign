import { useMutation, useQuery } from '@tanstack/react-query';
import { login, register, adminLogin, getUserById, updateUser } from '../api/userApi';

import { useAuth } from '../context/AuthContext';

// Hook login sử dụng mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

// Hook register sử dụng mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: adminLogin,
  });
};

export const useGetUserById = () => {
  const { auth } = useAuth();
  return useMutation({
    mutationFn: (userId) => getUserById(userId, auth?.token),
  });
};

export const useUserDetails = (userId) => {
  const { auth } = useAuth();
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId, auth?.token),
    enabled: !!userId && !!auth?.token,
  });
};

export const useUpdateUser = () => {
  const { auth } = useAuth();
  return useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData, auth?.token),
  });
};