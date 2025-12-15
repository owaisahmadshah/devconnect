import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchComments } from '../-services/postService';

export function useInfiniteFetchComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) => {
      return fetchComments({ postId }, { limit: 10, cursor: pageParam ?? '' });
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 3 * 60 * 1000,
  });
}
