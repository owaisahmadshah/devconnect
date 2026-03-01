import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { fetchUserOrganizationsService } from '../-services/organizationService';

export const useFetchInfiniteOrganizations = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ['organizations'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchUserOrganizationsService({ cursor: pageParam, limit: 10 }),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });
};
