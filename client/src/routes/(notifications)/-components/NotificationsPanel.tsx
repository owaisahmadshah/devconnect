import { useQueryClient } from '@tanstack/react-query';
import { useFetchInfiniteNotifications } from '../-hooks/useFetchInfiniteNotifications';
import { NotificationItem } from './organims/NotificationItem';
import { useReadNotifications } from '../-hooks/useReadNotifications';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export const NotificationsPanel = () => {
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, refetch, isFetchingNextPage } =
    useFetchInfiniteNotifications();

  const { mutateAsync: markAllAsReadService } = useReadNotifications();

  const hasNew = queryClient.getQueryData<boolean>(['notifications', 'has-new']) ?? false;

  const handleRefreshNew = () => {
    queryClient.setQueryData(['notifications', 'has-new'], false);
    refetch().then(() => markAllAsReadService());
  };

  useEffect(() => {
    (async () => {
      await markAllAsReadService();
      queryClient.setQueryData(['notifications', 'unread-count'], { count: 0 });
    })();
  }, []);

  const notifications = data.pages.flatMap(page => page.notifications);

  return (
    <div>
      {hasNew && (
        <div className="flex flex-col items-center justify-center px-4 text-center">
          <Button onClick={handleRefreshNew} variant={'secondary'} className="mx-auto my-2">
            ↑ New notifications
          </Button>
        </div>
      )}

      {notifications.map(n => (
        <NotificationItem key={n._id} notification={n} />
      ))}

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-full">
            <Bell className="text-muted-foreground h-5 w-5" />
          </div>
          <p className="text-foreground text-sm font-medium">No notifications yet</p>
          <p className="text-muted-foreground mt-1 text-xs">
            When someone interacts with you, it'll show up here.
          </p>
        </div>
      )}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading older...' : 'Load older'}
        </button>
      )}
    </div>
  );
};
