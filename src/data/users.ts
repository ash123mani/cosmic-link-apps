import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/api/client';
import { queryKeys } from './queryClient';
import type { UserSummary } from '@/src/types';

interface UserSearchResponse {
  success: boolean;
  users: UserSummary[];
}

export function useUserSearchQuery(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: queryKeys.userSearch(trimmed.toLowerCase()),
    enabled: trimmed.length >= 2,
    queryFn: async () => {
      const res = await api<UserSearchResponse>(
        `/api/v1/users/search?q=${encodeURIComponent(trimmed)}`,
        { auth: true },
      );
      return res.users;
    },
  });
}
