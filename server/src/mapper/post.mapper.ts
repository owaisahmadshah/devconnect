import type { TPostResponse } from '@shared/src/index.js';
import type { Document } from 'mongoose';

export class PostMapper {
  static toPublicPost = (postData: Document): TPostResponse => {
    const post = postData.toObject();
    return {
      _id: post._id,
      createdBy: post.createdBy,
      description: post.description,
      links: post.links,
      media: post.media,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };
}
