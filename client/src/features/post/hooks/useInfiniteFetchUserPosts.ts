import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import { fetchUserPostsService } from '../services/postService';

export function useInfiniteFetchUserPosts(profileUrl?: string) {
  const { profileUrl: routeUrl } = useParams({ strict: false });
  const finalUrl = profileUrl ?? routeUrl;

  return useInfiniteQuery({
    queryKey: ['user-posts', finalUrl],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchUserPostsService(finalUrl, { limit: 10, cursor: pageParam }),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    enabled: !!finalUrl,
    staleTime: 3 * 60 * 1000,
  });
}
