import type {  TPostResponse } from 'shared';
import { Document } from 'mongoose';

export class PostMapper {
  toPublicPost = (postData: any): TPostResponse => {
    const post = postData instanceof Document ? postData.toObject() : postData;

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
