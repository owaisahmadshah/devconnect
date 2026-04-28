import { TUserProfileSummaryResponse } from '../profile/profileResponse.js';
import { TNotificationType } from './notification.js';

export type TNotificationSummaryResponse = {
  _id: string;
  actor: TUserProfileSummaryResponse;
  recipient?: TUserProfileSummaryResponse;
  type: TNotificationType;
  isRead: boolean;
  message: string;
  redirectURL: string;
  createdAt: Date;
};

export type TNotificationSummaryResponseWithCursorBasedPagination = {
  notifications: TNotificationSummaryResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
