import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { fetchNotificationsService } from '../-services/notificationService';

export const useFetchInfiniteNotifications = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ['notifications', 'list'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchNotificationsService({ limit: 10, cursor: pageParam }),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 0,
  });
};
