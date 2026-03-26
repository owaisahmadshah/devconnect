import { NotificationRepository } from '../repositories/notification.repository.js';
import {
  HttpStatus,
  type TCreateNotification,
  type TNotificationSummaryResponse,
  type TNotificationSummaryResponseWithCursorBasedPagination,
} from 'shared';
import { ApiError } from '../utils/ApiError.js';
import type { NotificationMapper } from '../mapper/notification.mapper.js';
import type { ProfileRepository } from '../repositories/profile.repository.js';
import type { OrganizationRepository } from '../repositories/organization.repository.js';
import { type SSEManager } from '../utils/SSEManager.js';

interface TNotificationServiceProps {
  repo: NotificationRepository;
  mapper: NotificationMapper;
  profileRepo: ProfileRepository;
  organizationRepo: OrganizationRepository;
  sseManager: SSEManager;
}

export class NotificationService {
  constructor(private deps: TNotificationServiceProps) {}

  async notifyConnectionRequest(senderId: string, receiverId: string, connectionId: string) {
    if (senderId === receiverId) return;

    const sender = await this.deps.profileRepo.findSummaryByProfileId(senderId);

    if (!sender) return;

    await this.createAndSend({
      recipient: receiverId,
      actor: senderId,
      type: 'connection_request',
      entityId: connectionId,
      entityType: 'Connection',
      isRead: false,
      message: `${(sender.firstName + ' ' + sender.lastName).trim()} has sent you a connection request.`,
      redirectURL: '/network/pendings',
    });
  }

  async notifyConnectionAccepted(
    acceptorId: string,
    originalSenderId: string,
    connectionId: string,
  ) {
    if (acceptorId === originalSenderId) return;

    const acceptor = await this.deps.profileRepo.findSummaryByProfileId(acceptorId);

    if (!acceptor) return;

    await this.createAndSend({
      recipient: originalSenderId,
      actor: acceptorId,
      type: 'connection_accepted',
      entityId: connectionId,
      entityType: 'Connection',
      isRead: false,
      message: `${(acceptor.firstName + ' ' + acceptor.lastName).trim()} has accept your connection request`,
      redirectURL: '',
    });
  }

  async notifyPostLiked(
    actorProfileId: string, // who liked
    postOwnerId: string, // who gets notified
    postId: string,
  ) {
    if (actorProfileId === postOwnerId) return;

    const actor = await this.deps.profileRepo.findSummaryByProfileId(actorProfileId);
    if (!actor) return;

    await this.createAndSend({
      recipient: postOwnerId,
      actor: actorProfileId,
      type: 'post_liked',
      entityId: postId,
      entityType: 'Post',
      isRead: false,
      message: `${actor.firstName} liked your post`,
      redirectURL: `/post/p/${postId}`,
    });
  }

  async notifyPostComment(
    actorId: string, // who commented
    postOwnerId: string, // who gets notified
    postId: string,
  ) {
    if (actorId === postOwnerId) return;

    const actor = await this.deps.profileRepo.findSummaryByProfileId(actorId);
    if (!actor) return;

    await this.createAndSend({
      recipient: postOwnerId,
      actor: actorId,
      type: 'post_comment',
      entityId: postId,
      entityType: 'Post',
      isRead: false,
      message: `${actor.firstName} commented on your post`,
      redirectURL: `/post/p/${postId}`,
    });
  }

  async notifyOrganizationInvite(
    actorId: string, // who sent the invite
    recipientId: string, // who gets notified
    orgId: string,
  ) {
    const actor = await this.deps.profileRepo.findSummaryByProfileId(actorId);

    if (!actor) return;

    const org = await this.deps.organizationRepo.findOrganizationSummaryById(orgId);

    if (!org) return;

    await this.createAndSend({
      recipient: recipientId,
      actor: actorId,
      type: 'organization_invite',
      entityId: orgId,
      entityType: 'OrganizationMember',
      isRead: false,
      message: `${actor.firstName} invited you to join ${org.name}`,
      redirectURL: `/o/organization/${org.organizationURL}`,
    });
  }

  async getNotifications(data: {
    recipientId: string;
    limit: number;
    cursor: string | null;
  }): Promise<TNotificationSummaryResponseWithCursorBasedPagination> {
    const { repo, mapper } = this.deps;

    const notifications = await repo.findByRecipientId(data);

    const hasMore = notifications.length >= data.limit;
    const nextCursor = hasMore ? notifications.at(-1).createdAt : null;

    return {
      notifications: notifications.map(notification => mapper.toNotificationSummary(notification)),
      hasMore,
      nextCursor,
    };
  }

  async getUnreadCount(recipientId: string) {
    const count = await this.deps.repo.countUnread(recipientId);
    return count;
  }

  async markAsRead(
    notificationId: string,
    recipientId: string,
  ): Promise<TNotificationSummaryResponse> {
    const { repo, mapper } = this.deps;
    await repo.markAsRead(notificationId, recipientId);

    const [notification] = await repo.findById(notificationId);

    return mapper.toNotificationSummary(notification);
  }

  async markAllAsRead(recipientId: string) {
    const notifications = await this.deps.repo.markAllAsRead(recipientId);
    return notifications;
  }

  async deleteNotification(notificationId: string, recipientId: string) {
    const deletedNotification = await this.deps.repo.deleteById(notificationId, recipientId);

    if (!deletedNotification) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Notification not found.');
    }

    return deletedNotification;
  }

  private async createAndSend(data: TCreateNotification): Promise<void> {
    const notification = await this.deps.repo.create(data);

    // Check if user is connected, then send it
    if (this.deps.sseManager.isConnected(data.recipient)) {
      const [enriched] = await this.deps.repo.findById((notification?._id as string).toString());
      if (enriched) {
        this.deps.sseManager.sendToClient(
          data.recipient,
          this.deps.mapper.toNotificationSummary(notification),
        );
      }
    }
  }
}
