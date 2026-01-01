import { useInfiniteQuery } from '@tanstack/react-query';
import { recommendConnections } from '../-services/networkService';

export function useInfiniteRecommendConnections() {
  return useInfiniteQuery({
    queryKey: ['recommend-connections'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) => {
      return recommendConnections({ limit: 20, cursor: pageParam ?? '' });
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });
}
