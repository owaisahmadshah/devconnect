import { useQuery } from '@tanstack/react-query';
import { unreadNotificationsCountService } from '../-services/notificationService';

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: unreadNotificationsCountService,
    staleTime: 5 * 60 * 1000,
  });
};
