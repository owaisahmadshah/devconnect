import type { TPostResponse } from 'shared';
import type { Document } from 'mongoose';

export class PostMapper {
  static toPublicPost = (postData: Document): TPostResponse => {
    const post = postData;

    const response: TPostResponse = {
      _id: post._id.toString(),
      createdBy: post.createdBy,
      description: post.description,
      links: post.links,
      media: post.media,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      totalLikes: post?.totalLikes,
    };

    if (post?.likeType) {
      response.likeType = post.likeType;
    }

    return response;
  };
}
