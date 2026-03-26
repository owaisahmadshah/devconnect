import mongoose from 'mongoose';

import type { TCreateNotification } from 'shared';
import { Notification } from '../models/notification.model.js';
import {
  paginateCursorPipeline,
  profileSummaryLookupPipeline,
  projectStage,
  unwindField,
} from '../utils/aggregationHelpers.js';
import { NOTIFICATION_FIELDS_PROJECTION } from '../constants/notificationProjections.js';

export class NotificationRepository {
  create(data: TCreateNotification) {
    return Notification.create(data);
  }

  createMany(data: TCreateNotification[]) {
    return Notification.create(data);
  }

  findById(notificationId: string) {
    return Notification.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(notificationId),
        },
      },
      profileSummaryLookupPipeline({
        localField: 'actorId',
        asField: 'actor',
      }),
      unwindField({
        asField: 'actor',
      }),
      profileSummaryLookupPipeline({
        localField: 'recipientId',
        asField: 'recipient',
      }),
      unwindField({
        asField: 'recipient',
      }),
      projectStage(NOTIFICATION_FIELDS_PROJECTION.SUMMARY),
    ]);
  }

  findByRecipientId(data: { recipientId: string; cursor: string | null; limit: number }) {
    let matchStage: any = { recipientId: new mongoose.Types.ObjectId(data.recipientId) };

    if (data?.cursor) {
      matchStage = { ...matchStage, createdAt: { $lt: new Date(data.cursor) } };
    }

    return Notification.aggregate([
      {
        $match: matchStage,
      },
      ...paginateCursorPipeline({
        limit: data.limit,
      }),
      profileSummaryLookupPipeline({
        localField: 'actorId',
        asField: 'actor',
      }),
      unwindField({
        asField: 'actor',
      }),
      profileSummaryLookupPipeline({
        localField: 'recipientId',
        asField: 'recipient',
      }),
      unwindField({
        asField: 'recipient',
      }),
      projectStage(NOTIFICATION_FIELDS_PROJECTION.SUMMARY),
    ]);
  }

  countUnread(recipientId: string) {
    return Notification.countDocuments({ recipientId, isRead: false });
  }

  markAsRead(notificationId: string, recipientId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, recipientId },
      { isRead: true },
      { new: true },
    );
  }

  markAllAsRead(recipientId: string) {
    return Notification.updateMany({ recipientId }, { isRead: true });
  }

  deleteById(notificationId: string, recipientId: string) {
    return Notification.findOneAndDelete({ _id: notificationId, recipientId });
  }
}
