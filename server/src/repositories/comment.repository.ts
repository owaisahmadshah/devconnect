import type { TCreateComment } from 'shared';
import { Comment } from '../models/comment.model.js';
// import mongoose from 'mongoose';

export class CommentRepository {
  createComment(comment: TCreateComment) {
    return Comment.create(comment);
  }

  findByIdAndDelete(id: string) {
    return Comment.findByIdAndDelete(id);
  }

  fetchPaginatedComments({
    postId,
    limit = 10,
    // profileId,
    cursor,
  }: {
    postId: string;
    profileId: string;
    limit: number;
    cursor: string | null;
  }) {
    const filter: any = { postId };
    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }

    // const mongooseProfileId = new mongoose.Types.ObjectId(profileId);

    return Comment.aggregate([
      { $match: filter },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'commentBy',
          foreignField: '_id',
          as: 'commentBy',
        },
      },
      {
        $addFields: {
          commentBy: {
            $arrayElemAt: ['$commentBy', 0],
          },
        },
      },
    ]);
  }

  deleteCommentById(commentId: string) {
    return Comment.findByIdAndDelete(commentId);
  }
}
