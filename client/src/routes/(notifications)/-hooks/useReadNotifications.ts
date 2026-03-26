import { useMutation } from '@tanstack/react-query';
import { markReadNotifcationsService } from '../-services/notificationService';

export const useReadNotifications = () => {
  return useMutation({
    mutationFn: markReadNotifcationsService,
  });
};
