import { Like } from '../models/like.model.js';

export class LikeRepository {
  findOne(filter: any) {
    return Like.findOne(filter);
  }

  findByIdAndDelete(likeId: string) {
    return Like.findByIdAndDelete(likeId);
  }

  create(likeData: any) {
    return Like.create(likeData);
  }
}
