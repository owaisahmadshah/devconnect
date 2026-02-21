import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAllJobsOfOrganizationService } from '../-services/jobService';

export const useFetchAllJobsOfOrganization = () => {
  const organizationId = '';

  return useInfiniteQuery({
    queryKey: ['organizations'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchAllJobsOfOrganizationService({ organizationId }, { cursor: pageParam, limit: 10 }),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });
};
