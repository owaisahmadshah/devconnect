import mongoose from 'mongoose';
import { Post } from '../models/post.model.js';

export class PostRepository {
  create(postData: any) {
    return Post.create(postData);
  }

  findById(postId: string) {
    return Post.findById(postId).populate({
      path: 'createdBy',
      select:
        '_id username email firstName lastName role profilePictureUrl bio isVerified profileUrls',
    });
  }

  findByIdWithUser(postId: string) {
    return Post.findById(postId).populate({
      path: 'createdBy',
      select: 'user', // Get user for update validation
    });
  }

  deleteOne(filter: any, session?: mongoose.ClientSession) {
    if (session) {
      return Post.deleteOne(filter, { session });
    }
    return Post.deleteOne(filter);
  }

  aggregate(pipeline: any[]) {
    return Post.aggregate(pipeline);
  }

  fetchPaginatedPostsAggregate({
    filter,
    limit,
    profileId,
  }: {
    filter: any;
    limit: number;
    profileId: mongoose.Types.ObjectId | null;
  }) {
    return Post.aggregate([
      {
        $match: filter,
      },
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
          let: {
            creatorId: '$createdBy',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$creatorId'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
                role: 1,
                profilePictureUrl: 1,
                bio: 1,
                profileUrls: 1,
                isVerified: 1,
              },
            },
          ],
          as: 'createdBy',
        },
      },
      {
        $addFields: {
          createdBy: {
            $arrayElemAt: ['$createdBy', 0],
          },
        },
      },
      {
        $lookup: {
          from: 'likes',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$postId', '$$postId'],
                    },
                    {
                      $eq: ['$likedBy', profileId],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                value: 1,
              },
            },
          ],
          as: 'currentUserLike',
        },
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'postId',
          as: 'allLikes',
        },
      },
      {
        $addFields: {
          totalLikes: {
            $size: '$allLikes',
          },
          likeType: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: '$currentUserLike',
                  },
                  0,
                ],
              },
              then: {
                $arrayElemAt: ['$currentUserLike.value', 0],
              },
              else: '$$REMOVE',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'postId',
          pipeline: [
            {
              $count: 'count',
            },
          ],
          as: 'commentCount',
        },
      },
      {
        $addFields: {
          totalComments: {
            $ifNull: [{ $arrayElemAt: ['$commentCount.count', 0] }, 0],
          },
        },
      },
      {
        $project: {
          allLikes: 0,
          commentCount: 0,
        },
      },
    ]);
  }
}
