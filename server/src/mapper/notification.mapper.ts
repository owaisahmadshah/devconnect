import { Document } from 'mongoose';

import type { TBaseNotification, TNotificationSummaryResponse } from 'shared';

export class NotificationMapper {
  toNotificationSummary(res: Document | TBaseNotification): TNotificationSummaryResponse {
    const data = res instanceof Document ? res.toObject() : res;

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
