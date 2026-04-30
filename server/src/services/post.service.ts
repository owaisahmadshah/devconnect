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
import type { IRequestUser } from '../types/index.js';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import type { ProfileService } from './profile.service.js';
import type { PostRepository } from '../repositories/post.repository.js';

interface IPostServiceDeps {
  repo: PostRepository;
  profileService: ProfileService;
  uploadMultipleImages: typeof uploadMultipleImages;
  postMapper: PostMapper;
  startSession: typeof mongoose.startSession;
  objectId: typeof mongoose.Types.ObjectId;
}

export class PostService {
  constructor(private deps: IPostServiceDeps) {}

  createPost = async (postData: TCreatePost, userId: string): Promise<TPostResponse> => {
    const { repo, uploadMultipleImages, profileService, postMapper } = this.deps;

    let paths: string[] = [];
    if (postData?.media) {
      postData.media.forEach(path => paths.push(path.path));
    }
    // Uploading images to cloudinary
    const { urls, success } = await uploadMultipleImages(paths);

    const profile = await profileService.getUserProfileSummary(userId);

    if (!success) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Error uploading project images');
    }

    let uploadedMedia: { url: string; mediaType: string }[] = [];

    urls.forEach(url => {
      uploadedMedia.push({
        url,
        mediaType: 'image',
      });
    });

    const post = await repo.create({
      ...postData,
      media: uploadedMedia,
      createdBy: profile._id,
    });

    const responsePost = postMapper.toPublicPost(post);

    return responsePost;
  };

  deletePost = async (deletePost: TDeletePost, user: IRequestUser) => {
    const { repo, profileService, startSession } = this.deps;

    // TODO Update validation
    // ------Start validation
    const project = await repo.findByIdWithUser(deletePost._id);

    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found');
    }

    if ((project.createdBy as any).user.toString() !== user._id.toString()) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to modify this project');
    }
    // ------End Validation

    // Start transaction
    const session = await startSession();
    session.startTransaction();

    const profile = await profileService.getUserProfileSummary(user._id);

    try {
      await repo.deleteOne({ _id: deletePost._id, createdBy: profile._id }, session);
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
          'Failed to delete post. Please try again',
        );
      }
    } finally {
      session.endSession();
    }
  };

  fetchPaginatedPosts = async ({
    filter,
    limit = 10,
    cursor,
    profile_userId,
  }: {
    filter: any;
    limit: number;
    cursor: string | null;
    profile_userId?: string;
  }) => {
    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }

    const { repo, postMapper, objectId } = this.deps;

    // TODO: Change with who is currently signed in?
    const profileId = profile_userId ? new objectId(profile_userId) : null;

    const posts = await repo.fetchPaginatedPostsAggregate({
      filter,
      limit,
      profileId,
    });

    const responsePosts: TPostResponse[] = posts.map(post => postMapper.toPublicPost(post));

    const hasMore = responsePosts.length === limit;
    const lastPost = responsePosts.at(-1);
    const nextCursor: string | null =
      hasMore && lastPost?.createdAt ? lastPost.createdAt.toISOString() : null;

    return { posts: responsePosts, hasMore, nextCursor };
  };

  /**
   * Retrieves a user's profile using the provided profile URL,
   * then fetches all post created by that user.
   */
  fetchUserPostsByProfileUrls = async (
    profileUrl: string,
    limit: number = 10,
    cursor: string | null,
    profile_userId: string,
  ): Promise<TPostsResponseWithCursorPaginationResponse> => {
    const { profileService } = this.deps;

    const profile = await profileService.getUserProfileSummary(profileUrl);

    const filter: any = { createdBy: profile._id };

    return this.fetchPaginatedPosts({ filter, limit, cursor, profile_userId });
  };

  fetchPost = async (postId: string): Promise<TPostResponse> => {
    const { repo, postMapper } = this.deps;

    console.log(postId);

    const post = await repo.findById(postId);

    console.log(post);

    if (!post) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Post not found.');
    }

    const responsePost = postMapper.toPublicPost(post);

    return responsePost;
  };
}
