import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchOrganizationByIdService } from '../-services/organizationService';

export const useFetchInfiniteOrganizationsById = () => {
  return useInfiniteQuery({
    queryKey: ['organizations-by-id'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchOrganizationByIdService({ cursor: pageParam ?? '', limit: 10 }),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });
};
