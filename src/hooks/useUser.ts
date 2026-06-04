'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
  getUsersByAgency,
  getAllUsers,
} from '@/lib/userApi';
import { User } from '@/types/user';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
}

export function useUsers(skip: number = 0, take: number = 10) {
  return useQuery({
    queryKey: ['users', skip, take],
    queryFn: () => getAllUsers(skip, take),
  });
}

export function useUsersByRole(role: string) {
  return useQuery({
    queryKey: ['usersByRole', role],
    queryFn: () => getUsersByRole(role),
    enabled: !!role,
  });
}

export function useUsersByAgency(agencyId: string) {
  return useQuery({
    queryKey: ['usersByAgency', agencyId],
    queryFn: () => getUsersByAgency(agencyId),
    enabled: !!agencyId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      email: string;
      name?: string;
      role?: string;
      agencyId?: string;
    }) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        email?: string;
        role?: string;
        agencyId?: string;
      };
    }) => updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
