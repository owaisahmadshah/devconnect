import type { Request, Response } from 'express';

import {
  HttpStatus,
  type TCreatePost,
  type TDeletePost,
  type TMultipleBackendImages,
  type TPostsResponseWithCursorPaginationResponse,
} from 'shared';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { PostService } from '../services/post.service.js';
import { ProfileService } from '../services/profile.service.js';

export class PostController {
  /**
   * Creates a new post for the authenticated user.
   *
   * @route POST /api/v1/posts/create
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.body: TCreatePost (post data excluding media)
   *   - req.files.media?: TMultipleBackendImages (optional media files)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TPostResponse>>}
   *
   * @description
   * Validates the authenticated user, processes media files if provided,
   * creates a new post in the database, and returns the created post.
   */
  static createPost = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const data: Omit<TCreatePost, 'media'> = req.body;
    const media: TMultipleBackendImages = (req.files as any)?.media as TMultipleBackendImages;

    const createPost: TCreatePost = {
      ...data,
      media,
    };

    const post = await PostService.createPost(createPost, req.user._id);

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.OK, post, 'Created post sucessfully.'));
  });

  /**
   * Deletes a post by ID for the authenticated user.
   *
   * @route DELETE /api/v1/posts/delete
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.query._id: string (ID of the post to delete)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<void>>}
   *
   * @description
   * Deletes the specified post if the authenticated user is authorized.
   * Returns HTTP 204 (No Content) on successful deletion.
   */

  static deleteProject = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }
    const { _id } = req.query;
    const data: TDeletePost = { _id: _id as string };

    await PostService.deletePost(data, req.user);

    return res
      .status(HttpStatus.NO_CONTENT)
      .json(new ApiResponse(HttpStatus.NO_CONTENT, {}, 'Deleted post sucessfully.'));
  });

  /**
   * Retrieves paginated posts (feed) for the authenticated user.
   *
   * @route GET /api/v1/posts/feed
   * @route GET /api/v1/posts/user/:profileUrl
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.params.profileUrl?: string (optional user profile URL)
   *   - req.query.limit?: number
   *   - req.query.cursor?: string (ISO timestamp for cursor-based pagination)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TPostsResponseWithCursorPaginationResponse>>}
   *
   * @description
   * Fetches posts either for a specific user's profile (if `profileUrl` is provided)
   * or for the authenticated user's main feed.
   * Supports cursor-based pagination with `limit` and `cursor` parameters.
   */
  static fetchPosts = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { profileUrl } = req.params;
    const { limit, cursor } = req.query;

    let posts: TPostsResponseWithCursorPaginationResponse;

    const { _id: profile_userId } = await ProfileService.getUserProfileSummary(req.user._id);

    if (profileUrl) {
      posts = await PostService.fetchUserPostsByProfileUrls(
        profileUrl,
        Number(limit),
        cursor ? String(cursor) : null,
        profile_userId.toString(),
      );
    } else {
      posts = await PostService.fetchPaginatedPosts({
        filter: {},
        limit: Number(limit),
        cursor: cursor ? String(cursor) : null,
        profile_userId: profile_userId.toString(),
      });
    }

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, posts, 'Fetched posts successfully.'));
  });

  /**
   * Retrieves a specific post by its ID.
   *
   * @route GET /api/v1/posts/post/:postId
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.params.postId: string (ID of the post to fetch)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TPostResponse>>}
   *
   * @description
   * Fetches a single post by its ID.
   * Returns the post details in a public-safe response format.
   */
  static fetchPost = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { postId } = req.params;

    const post = await PostService.fetchPost(String(postId));

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, post, 'Fetched post successfully.'));
  });
}
