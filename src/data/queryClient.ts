import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  links: (categoryId: string) => ['links', categoryId] as const,
  allLinks: ['links', 'all'] as const,
  linkMeta: (url: string) => ['link-meta', url] as const,
  user: ['user'] as const,
  sharesInbox: ['shares', 'inbox'] as const,
  sharesUnseenCount: ['shares', 'unseen-count'] as const,
  userSearch: (q: string) => ['users', 'search', q] as const,
};
