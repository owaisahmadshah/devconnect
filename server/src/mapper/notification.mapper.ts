import type { Document } from 'mongoose';

import type { TNotificationSummaryResponse } from 'shared';

export class NotificationMapper {
  toNotificationSummary(data: Document): TNotificationSummaryResponse {
    return {
      _id: data._id as string,
      actor: data.actor,
      isRead: data.isRead,
      message: data.message,
      redirectURL: data.redirectURL,
      type: data.type,
      createdAt: data.createdAt,
      recipient: data.recipient,
    };
  }
}
