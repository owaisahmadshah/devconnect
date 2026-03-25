import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { fetchRecommendedOrganizationsService } from '../-services/organizationService';

export const useFetchInfiniteRecommendedOrganizations = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ['recommended-organizations'],
    queryFn: ({ pageParam = null }: { pageParam: null | string }) =>
      fetchRecommendedOrganizationsService({ limit: 20, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: lastPage => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  });
};
