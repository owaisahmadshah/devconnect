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
import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { ProfileService } from './profile.service.js';

export class PostService {
  static async createPost(postData: TCreatePost): Promise<TPostResponse> {
    let paths: string[] = [];
    if (postData?.media) {
      postData.media.forEach(path => paths.push(path.path));
    }
    // Uploading images to cloudinary
    const { urls: media, success } = await uploadMultipleImages(paths);

    if (!success) {
      throw new ApiError(401, 'Error uploading project images');
    }

    const post = await Post.create({ ...postData, media });

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

    try {
      await Post.deleteOne({ _id: deletePost._id, createdBy: user._id }, { session });
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
  }: {
    filter: any;
    limit: number;
    cursor: string | null;
  }) {
    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(limit).populate({
      path: 'createdBy',
      select:
        '_id username email firstName lastName role profilePictureUrl bio isVerified profileUrls',
    });

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
  static async fetchUserProjectsByProfileUrls(
    profileUrl: string,
    limit: number = 10,
    cursor: string | null,
  ): Promise<TPostsResponseWithCursorPaginationResponse> {
    const profile = await ProfileService.getUserProfileSummary(profileUrl);

    const filter: any = { createdBy: profile._id };

    return this.fetchPaginatedPosts({ filter, limit, cursor });
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
