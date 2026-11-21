import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/api/client';
import { queryKeys } from './queryClient';
import { ALL_CATEGORY, type Category, type LinkItem, type LinkMeta } from '@/src/types';

interface LinksResponse {
  success: boolean;
  links: LinkItem[];
  categoryId: string;
}

interface LinkMutationResponse {
  success: boolean;
  link: LinkItem;
  categoryId?: string;
}

export interface AddLinkInput {
  linkUrl: string;
  title: string;
  description?: string;
  category: Category;
  imageUrl?: string;
  siteName?: string;
}

export interface UpdateLinkInput {
  id: string;
  description?: string;
  category?: Category;
}

export function useLinksQuery(categoryId: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.links(categoryId ?? ALL_CATEGORY.id),
    enabled: !!categoryId && (options?.enabled ?? true),
    queryFn: async () => {
      const res = await api<LinksResponse>(`/api/v1/link/${categoryId}`, { auth: true });
      return res.links;
    },
  });
}

export function useAllLinksQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.allLinks,
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const res = await api<LinksResponse>('/api/v1/link/all', { auth: true });
      return res.links;
    },
  });
}

function invalidateLinkQueries(client: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    client.invalidateQueries({ queryKey: ['links'] }),
  ]);
}

export function useAddLinkMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddLinkInput) => {
      const res = await api<LinkMutationResponse>('/api/v1/link', {
        method: 'POST',
        body: input as unknown as Record<string, unknown>,
        auth: true,
      });
      return res.link;
    },
    onSuccess: () => invalidateLinkQueries(client),
  });
}

export function useDeleteLinkMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api(`/api/v1/link/${id}`, { method: 'DELETE', auth: true });
      return id;
    },
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: ['links'] });
      const snapshots = client.getQueriesData<LinkItem[]>({ queryKey: ['links'] });
      snapshots.forEach(([key, data]) => {
        if (data) {
          client.setQueryData(
            key,
            data.filter((item) => item.id !== id),
          );
        }
      });
      return { snapshots };
    },
    onError: (_error, _id, context) => {
      context?.snapshots.forEach(([key, data]) => client.setQueryData(key, data));
    },
    onSettled: () => invalidateLinkQueries(client),
  });
}

export function useUpdateLinkMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, description, category }: UpdateLinkInput) => {
      const res = await api<LinkMutationResponse>(`/api/v1/link/${id}`, {
        method: 'PATCH',
        body: { description, category },
        auth: true,
      });
      return res.link;
    },
    onSuccess: () => invalidateLinkQueries(client),
  });
}

export function useLinkMetaMutation() {
  return useMutation({
    mutationFn: async (linkUrl: string) => {
      const res = await api<{ success: boolean; meta: LinkMeta }>('/api/v1/link/meta', {
        method: 'POST',
        body: { linkUrl },
      });
      return res.meta;
    },
  });
}

export function useAllLinkCounts() {
  const { data } = useAllLinksQuery();
  const counts: Record<string, number> = {};
  (data ?? []).forEach((link) => {
    const id = link.category?.id;
    if (id) counts[id] = (counts[id] ?? 0) + 1;
  });
  return { counts, total: data?.length ?? 0 };
}
