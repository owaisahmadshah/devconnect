import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeedService } from '../services/postService';

export function useInfiniteFetchPosts() {
  return useInfiniteQuery({
    queryKey: ['feed-posts'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) => {
      return fetchFeedService({ limit: 10, cursor: pageParam ?? '' });
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 3 * 60 * 1000,
  });
}
