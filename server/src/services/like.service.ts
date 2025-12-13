import { type TCreateLike } from 'shared';
import type { ProfileService } from './profile.service.js';
import type { LikeRepository } from '../repositories/like.repository.js';

export class LikeService {
  constructor(private repo: LikeRepository, private profileServ: ProfileService) {}

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

    return { isCreated: true };
  };
}
