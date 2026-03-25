import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchJobsSearchService } from '../-services/jobService';
import { Route } from '../jobs';

export const useFetchInfiniteSearchJobs = () => {
  const query = Route.useSearch();

  const isEnabled = !!(query.q || query.location || query.type || query.status);

  return useInfiniteQuery({
    queryKey: ['jobs-search', query],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchJobsSearchService({ cursor: pageParam, limit: 20, query }),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
    enabled: isEnabled,
  });
};
