import type { TCommentResponse } from 'shared';
import { Document } from 'mongoose';

export class CommentMapper {
  toPublicComment(commentObj: Document): TCommentResponse {
    const comment = commentObj instanceof Document ? commentObj.toObject() : commentObj;

    return {
      _id: comment._id.toString(),
      postId: comment.postId,
      commentBy: comment.commentBy,
      body: comment.body,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
