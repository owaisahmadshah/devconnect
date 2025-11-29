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
   * Creates a post.
   *
   * @route POST /api/v1/posts/create
   * @param {Request} req.user contains authenticated user TCreatePost(req.body)
   * @returns TPostResponse
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
   * Deletes a post.
   *
   * @route DELETE /api/v1/posts/delete
   * @param {Request} req.user contains authenticated user and postId(req.query)
   * @returns
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
   * Get all posts(feed).
   *
   * @route GET (/api/v1/posts/user/:profileUrl OR /api/v1/posts/feed)
   * @param {Request} req contains authenticated user(req.user) profileUrl(req.params)? and {limit, cursor}(req.query)
   * @returns TProjectsSummaryWithCursorPaginationResponse[]
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
   * Get a specific post by id.
   *
   * @route GET /api/v1/posts/post/:postId
   * @param {Request} req contains authenticated user(req.user) postId(req.params)
   * @returns TPostResponse
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
