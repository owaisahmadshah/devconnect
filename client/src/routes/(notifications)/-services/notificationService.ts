import { apiDelete, apiGet, apiPatch } from '@/lib/api-client';
import type {
  TDeleteNotification,
  TNotificationSummaryResponseWithCursorBasedPagination,
  TPagination,
  TUpdateReadNotification,
} from 'shared';

export const fetchNotificationsService = (data: TPagination) => {
  return apiGet<TNotificationSummaryResponseWithCursorBasedPagination>(
    '/api/v1/notifications',
    data,
  );
};

export const markReadNotifcationsService = () => {
  return apiGet('/api/v1/notifications/read-all');
};

export const deleteNotificationService = (data: TDeleteNotification) => {
  return apiDelete(`/api/v1/notifications/${data.notificationId}`);
};

export const updateNotificationService = (data: TUpdateReadNotification) => {
  return apiPatch(`/api/v1/notifications/${data.notificationId}/read`);
};

export const unreadNotificationsCountService = () => {
  return apiGet<{ count: number }>('/api/v1/notifications/unread-count');
};

export const sseManagerService = () => {};
