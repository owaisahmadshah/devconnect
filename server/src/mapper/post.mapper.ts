import type { TPostResponse } from 'shared';
import type { Document } from 'mongoose';

export class PostMapper {
  toPublicPost = (postData: Document): TPostResponse => {
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
      totalComments: post?.totalComments,
    };

    if (post?.likeType) {
      response.likeType = post.likeType;
    }

    return response;
  };
}
