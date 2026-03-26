import { type TCreateLike } from 'shared';
import type { ProfileService } from './profile.service.js';
import type { LikeRepository } from '../repositories/like.repository.js';
import type { NotificationService } from './notification.service.js';
import logger from '../utils/logger.js';

export class LikeService {
  constructor(
    private repo: LikeRepository,
    private profileServ: ProfileService,
    private notificationService: NotificationService,
  ) {}

  /**
   * Create a new reaction (like/love/dislike)
   */
  createLike = async (data: TCreateLike, userId: string): Promise<{ isCreated: boolean }> => {
    const profile = await this.profileServ.getUserProfileSummary(userId);

    // Check if reaction already exists
    const existing = await this.repo.findOne({
      postId: data.postId,
      likedBy: profile._id,
    });

    if (existing) {
      await this.repo.findByIdAndDelete(existing._id as string);
      return { isCreated: false };
    }

    await this.repo.create({
      ...data,
      likedBy: profile._id,
    });

    // If post owner id is missing skip notification
    if (data.postOwnerId) {
      this.notificationService
        .notifyPostLiked(profile._id.toString(), data.postOwnerId, data.postId)
        .catch(logger.error);
    }

    return { isCreated: true };
  };
}
