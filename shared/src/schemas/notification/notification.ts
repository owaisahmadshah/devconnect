import * as z from 'zod';

export const notificationTypeSchema = z.enum([
  'connection_request',
  'connection_accepted',
  'post_liked',
  'post_comment',
  'job_posted',
  'organization_invite',
]);

export const entityTypeSchema = z.enum(['Post', 'Job', 'Connection', 'OrganizationMember', 'Profile']);

export const baseNotificationSchema = z.object({
  recipient: z.string(),
  actor: z.string(),
  type: notificationTypeSchema,
  entityId: z.string(),
  entityType: entityTypeSchema,
  isRead: z.boolean(),
  message: z.string(),
  redirectURL: z.string(),
});

export const createNotificationSchema = baseNotificationSchema;

export type TNotificationType = z.infer<typeof notificationTypeSchema>;
export type TEntityType = z.infer<typeof entityTypeSchema>;
export type TBaseNotification = z.infer<typeof baseNotificationSchema>;
export type TCreateNotification = z.infer<typeof createNotificationSchema>;
