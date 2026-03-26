import * as z from 'zod';

// For api request (read) - _id required
export const updateReadNotificationSchema = z.object({
  notificationId: z.string(),
});

// For api request (delete) - _id required
export const deleteNotificationSchema = z.object({
  notificationId: z.string(),
});

export type TUpdateReadNotification = z.infer<typeof updateReadNotificationSchema>;
export type TDeleteNotification = z.infer<typeof deleteNotificationSchema>;
