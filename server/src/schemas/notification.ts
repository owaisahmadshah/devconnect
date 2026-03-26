import * as z from 'zod';

import { updateReadNotificationSchema as uns, deleteNotificationSchema as dns } from 'shared';

export const updateReadNotificationSchema = z.object({
  params: uns,
});

export const deleteNotificationSchema = z.object({
  params: dns,
});
