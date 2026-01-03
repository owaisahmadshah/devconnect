import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { connections } from '../-services/networkService';

export function useInfiniteConnections() {
  return useSuspenseInfiniteQuery({
    queryKey: ['connections'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) => {
      return connections({ limit: 20, cursor: pageParam ?? '' });
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });
}
