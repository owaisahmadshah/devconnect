import { useInfiniteQuery } from '@tanstack/react-query';
// import { useParams } from '@tanstack/react-router';

import { fetchOrganizationByIdOrURLService } from '../-services/organizationService';

export const useFetchInfiniteOrganizationsByIdOrURL = () => {
  const query = '';

  // const [params] = useParams({ });
  
  return useInfiniteQuery({
    queryKey: ['organizations', query],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchOrganizationByIdOrURLService({ query }, { cursor: pageParam, limit: 10 }),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });
};
