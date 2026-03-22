import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { searchOrganizationService } from '../-services/organizationService';

export const useSearchInfiniteOrganizations = (query: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: ['search-organizations', query],
    queryFn: ({ pageParam = null }: { pageParam: null | string }) =>
      searchOrganizationService({ limit: 20, cursor: pageParam, query }),
    initialPageParam: null,
    getNextPageParam: lastPage => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  });
};
