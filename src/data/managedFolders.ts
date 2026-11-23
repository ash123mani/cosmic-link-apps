import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/api/client';
import { queryKeys } from './queryClient';
import type { ManagedFolder, ManagedFolderLink, ManagedFolderRole } from '@/src/types';

interface FolderResponse { success: boolean; folder: ManagedFolder }
interface FoldersResponse { success: boolean; folders: ManagedFolder[] }
interface LinksResponse { success: boolean; links: ManagedFolderLink[] }
interface LinkResponse { success: boolean; link: ManagedFolderLink }

export function useManagedFoldersQuery() {
  return useQuery({
    queryKey: queryKeys.managedFolders,
    queryFn: async () => (await api<FoldersResponse>('/api/v1/managed-folders', { auth: true })).folders,
  });
}

export function useManagedFolderQuery(id?: string) {
  return useQuery({
    queryKey: queryKeys.managedFolder(id || ''),
    enabled: !!id,
    queryFn: async () => (await api<FolderResponse>(`/api/v1/managed-folders/${id}`, { auth: true })).folder,
  });
}

export function useManagedFolderLinksQuery(id?: string) {
  return useQuery({
    queryKey: queryKeys.managedFolderLinks(id || ''),
    enabled: !!id,
    queryFn: async () => (await api<LinksResponse>(`/api/v1/managed-folders/${id}/links`, { auth: true })).links,
  });
}

export function useCreateManagedFolderMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; description?: string; memberIds: string[] }) =>
      (await api<FolderResponse>('/api/v1/managed-folders', { method: 'POST', body, auth: true })).folder,
    onSuccess: () => { void client.invalidateQueries({ queryKey: queryKeys.managedFolders }); },
  });
}

export function useDeleteManagedFolderMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api(`/api/v1/managed-folders/${id}`, { method: 'DELETE', auth: true });
      return id;
    },
    onSuccess: (id) => {
      void client.invalidateQueries({ queryKey: queryKeys.managedFolders });
      void client.removeQueries({ queryKey: queryKeys.managedFolder(id) });
      void client.removeQueries({ queryKey: queryKeys.managedFolderLinks(id) });
    },
  });
}

export function useAddManagedFolderMembersMutation(folderId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (userIds: string[]) =>
      (await api<FolderResponse>(`/api/v1/managed-folders/${folderId}/members`, { method: 'POST', body: { userIds }, auth: true })).folder,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.managedFolder(folderId) });
      void client.invalidateQueries({ queryKey: queryKeys.managedFolders });
    },
  });
}

export function useRemoveManagedFolderMemberMutation(folderId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) =>
      (await api<FolderResponse>(`/api/v1/managed-folders/${folderId}/members/${userId}`, { method: 'DELETE', auth: true })).folder,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.managedFolder(folderId) });
      void client.invalidateQueries({ queryKey: queryKeys.managedFolders });
    },
  });
}

export function useUpdateManagedFolderMemberRoleMutation(folderId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: { userId: string; role: ManagedFolderRole }) =>
      (await api<FolderResponse>(`/api/v1/managed-folders/${folderId}/members/${input.userId}`, { method: 'PATCH', body: { role: input.role }, auth: true })).folder,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.managedFolder(folderId) });
      void client.invalidateQueries({ queryKey: queryKeys.managedFolders });
    },
  });
}

export function useCreateManagedFolderLinkMutation(folderId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (body: { linkUrl: string; title: string; description?: string; siteName?: string; imageUrl?: string }) =>
      (await api<LinkResponse>(`/api/v1/managed-folders/${folderId}/links`, { method: 'POST', body, auth: true })).link,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.managedFolderLinks(folderId) });
      void client.invalidateQueries({ queryKey: queryKeys.managedFolders });
    },
  });
}

export function useUpdateManagedFolderLinkMutation(folderId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: { linkId: string; body: { linkUrl?: string; title?: string; description?: string; siteName?: string; imageUrl?: string } }) =>
      (await api<LinkResponse>(`/api/v1/managed-folders/${folderId}/links/${input.linkId}`, { method: 'PATCH', body: input.body, auth: true })).link,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.managedFolderLinks(folderId) });
    },
  });
}

export function useDeleteManagedFolderLinkMutation(folderId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (linkId: string) => {
      await api(`/api/v1/managed-folders/${folderId}/links/${linkId}`, { method: 'DELETE', auth: true });
      return linkId;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.managedFolderLinks(folderId) });
      void client.invalidateQueries({ queryKey: queryKeys.managedFolders });
    },
  });
}
