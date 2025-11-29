import {
  HttpStatus,
  type TCreatePost,
  type TDeletePost,
  type TPostResponse,
  type TPostsResponseWithCursorPaginationResponse,
} from 'shared';
import { uploadMultipleImages } from '../utils/uploadImages.js';
import { ApiError } from '../utils/ApiError.js';
import { PostMapper } from '../mapper/post.mapper.js';
import { Post } from '../models/post.model.js';
import type { IRequestUser } from '../types/index.js';
import mongoose, { Schema } from 'mongoose';
import logger from '../utils/logger.js';
import { ProfileService } from './profile.service.js';

export class PostService {
  static async createPost(postData: TCreatePost, userId: string): Promise<TPostResponse> {
    let paths: string[] = [];
    if (postData?.media) {
      postData.media.forEach(path => paths.push(path.path));
    }
    // Uploading images to cloudinary
    const { urls, success } = await uploadMultipleImages(paths);

    const profile = await ProfileService.getUserProfileSummary(userId);

    if (!success) {
      throw new ApiError(401, 'Error uploading project images');
    }

    let uploadedMedia: { url: string; mediaType: string }[] = [];

    urls.forEach(url => {
      uploadedMedia.push({
        url,
        mediaType: 'image',
      });
    });

    const post = await Post.create({ ...postData, media: uploadedMedia, createdBy: profile._id });

    const responsePost = PostMapper.toPublicPost(post);

    return responsePost;
  }

  static async deletePost(deletePost: TDeletePost, user: IRequestUser) {
    // TODO Update validation
    // ------Start validation
    const project = await Post.findById(deletePost._id).populate({
      path: 'createdBy',
      select: 'user', // Get user for update validation
    });

    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found');
    }

    if ((project.createdBy as any).user.toString() !== user._id.toString()) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to modify this project');
    }
    // ------End Validation

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    const profile = await ProfileService.getUserProfileSummary(user._id);

    try {
      await Post.deleteOne({ _id: deletePost._id, createdBy: profile._id }, { session });
      // TODO: Delete all the documents from all the collections(like likes, comments etc.) related to this particular document

      // Explicitly commit the transaction
      await session.commitTransaction();
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();

      if (error instanceof ApiError) {
        throw error;
      } else {
        logger.error('Error in post delete transaction:', error);
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Faild to delete post. Please try again',
        );
      }
    } finally {
      session.endSession();
    }
  }

  static async fetchPaginatedPosts({
    filter,
    limit = 10,
    cursor,
    profile_userId,
  }: {
    filter: any;
    limit: number;
    cursor: string | null;
    profile_userId?: string;
  }) {
    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }

    // TODO: Change with who is currently signed in?
    const profileId = profile_userId ? new mongoose.Types.ObjectId(profile_userId) : null;

    const posts = await Post.aggregate([
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
        $project: {
          allLikes: 0,
          // currentUserLike: 0,
        },
      },
    ]);

    const responsePosts: TPostResponse[] = posts.map(post => PostMapper.toPublicPost(post));

    const hasMore = responsePosts.length === limit;
    const lastPost = responsePosts.at(-1);
    const nextCursor: string | null = lastPost?.createdAt ? lastPost.createdAt.toISOString() : null;

    return { posts: responsePosts, hasMore, nextCursor };
  }

  /**
   * Retrieves a user's profile using the provided profile URL,
   * then fetches all post created by that user.
   */
  static async fetchUserPostsByProfileUrls(
    profileUrl: string,
    limit: number = 10,
    cursor: string | null,
    profile_userId: string,
  ): Promise<TPostsResponseWithCursorPaginationResponse> {
    const profile = await ProfileService.getUserProfileSummary(profileUrl);

    const filter: any = { createdBy: profile._id };

    return this.fetchPaginatedPosts({ filter, limit, cursor, profile_userId });
  }

  static async fetchPost(postId: string): Promise<TPostResponse> {
    const post = await Post.findById(postId).populate({
      path: 'createdBy',
      select:
        '_id username email firstName lastName role profilePictureUrl bio isVerified profileUrls',
    });

    if (!post) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Post not found.');
    }

    const responsePost = PostMapper.toPublicPost(post);

    return responsePost;
  }
}
