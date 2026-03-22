import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { fetchJobsFeedService } from '../-services/jobService';

export const useFetchInfiniteFeedJobs = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ['jobs-feed'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchJobsFeedService({ cursor: pageParam, limit: 20 }),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });
};
