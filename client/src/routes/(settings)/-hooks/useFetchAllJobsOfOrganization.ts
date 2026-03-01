import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { fetchAllJobsOfOrganizationService } from '../-services/jobService';

export const useFetchAllJobsOfOrganization = (organizationId: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: [organizationId, 'jobs'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchAllJobsOfOrganizationService({ organizationId }, { cursor: pageParam, limit: 10 }),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });
};
