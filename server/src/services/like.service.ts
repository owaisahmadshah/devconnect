import { type TCreateLike } from 'shared';

import { Like } from '../models/like.model.js';
import { ProfileService } from './profile.service.js';

export class LikeService {
  /**
   * Create a new reaction (like/love/dislike)
   */
  static async createLike(data: TCreateLike, userId: string): Promise<{ isCreated: boolean }> {
    const profile = await ProfileService.getUserProfileSummary(userId);

    // Check if reaction already exists
    const existing = await Like.findOne({
      postId: data.postId,
      likedBy: profile._id,
    });

    if (existing) {
      await Like.findByIdAndDelete(existing._id);
      return { isCreated: false };
    }

    await Like.create({
      ...data,
      likedBy: profile._id,
    });

    return { isCreated: true };
  }
}
