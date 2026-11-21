import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/api/client';
import { queryKeys } from './queryClient';
import type { ShareItem } from '@/src/types';

interface InboxResponse {
  success: boolean;
  shares: ShareItem[];
  unseenCount: number;
}

interface UnseenCountResponse {
  success: boolean;
  count: number;
}

interface CreateShareResponse {
  success: boolean;
  shares: ShareItem[];
}

interface MoveShareResponse {
  success: boolean;
  share: ShareItem;
  link: import('@/src/types').LinkItem;
}

export interface SendShareInput {
  linkId: string;
  recipientIds: string[];
  message?: string;
}

export function useInboxQuery() {
  return useQuery({
    queryKey: queryKeys.sharesInbox,
    queryFn: async () => {
      const res = await api<InboxResponse>('/api/v1/shares/inbox', { auth: true });
      return res;
    },
  });
}

export function useUnseenCountQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.sharesUnseenCount,
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const res = await api<UnseenCountResponse>('/api/v1/shares/unseen-count', {
        auth: true,
      });
      return res.count;
    },
  });
}

export function useSendShareMutation() {
  return useMutation({
    mutationFn: async (input: SendShareInput) => {
      const res = await api<CreateShareResponse>('/api/v1/shares', {
        method: 'POST',
        body: input as unknown as Record<string, unknown>,
        auth: true,
      });
      return res.shares;
    },
  });
}

export function useMarkSharesSeenMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: { all?: boolean; ids?: string[] }) => {
      await api('/api/v1/shares/seen', {
        method: 'PATCH',
        body: input as Record<string, unknown>,
        auth: true,
      });
      return true;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.sharesInbox });
      void client.invalidateQueries({ queryKey: queryKeys.sharesUnseenCount });
    },
  });
}

export function useMoveShareMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; category: { id: string; name: string } }) => {
      const res = await api<MoveShareResponse>(`/api/v1/shares/${input.id}/move`, {
        method: 'PATCH',
        body: { category: input.category } as Record<string, unknown>,
        auth: true,
      });
      return res;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.sharesInbox });
      void client.invalidateQueries({ queryKey: queryKeys.sharesUnseenCount });
      void client.invalidateQueries({ queryKey: ['links'] });
    },
  });
}
