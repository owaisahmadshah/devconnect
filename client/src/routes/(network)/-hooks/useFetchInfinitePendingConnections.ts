import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { pendingConnections } from '../-services/networkService';

export function useFetchInfinitePendingConnections() {
  return useSuspenseInfiniteQuery({
    queryKey: ['pending-connections'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) => {
      return pendingConnections({ limit: 20, cursor: pageParam ?? '' });
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });
}
