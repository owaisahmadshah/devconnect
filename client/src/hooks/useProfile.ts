import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import * as ProfileService from '@/services/profileService';

export const useInfiniteUserSearchByFullName = (
  fullName: string,
  debounceDelay = 300,
  pageSize = 10,
) => {
  const [debouncedFullName] = useDebounce(fullName, debounceDelay);

  return useInfiniteQuery({
    queryKey: ['infinite-profile', fullName],
    queryFn: ({ pageParam = null, signal }: { pageParam: string | null; signal: AbortSignal }) => {
      return ProfileService.fetchUserByFullName(
        { fullName: debouncedFullName },
        {
          limit: pageSize,
          cursor: pageParam,
        },
        signal,
      );
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    enabled: !!debouncedFullName?.trim(),
    staleTime: 1000 * 60 * 2,
  });
};
