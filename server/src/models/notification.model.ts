import mongoose, { Document, Schema } from 'mongoose';

import type { TCreateNotification } from 'shared';

interface INotification
  extends Document, Omit<TCreateNotification, 'recipient' | 'actor' | 'entityId'> {
  recipient: mongoose.Types.ObjectId;
  actor: mongoose.Types.ObjectId;
  entityId: mongoose.Types.ObjectId;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'connection_request',
        'connection_accepted',
        'post_liked',
        'post_comment',
        'job_posted',
        'organization_invite',
      ],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    entityType: {
      type: String,
      enum: ['Post', 'Job', 'Connection', 'OrganizationMember', 'Profile'],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
    redirectURL: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
