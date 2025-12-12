import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/AsyncHandler.js';
import type { CommentService } from '../services/comment.service.js';
import { ApiError } from '../utils/ApiError.js';
import { HttpStatus } from 'shared';
import { ApiResponse } from '../utils/ApiResponse.js';

export class CommentController {
  constructor(private service: CommentService) {}

  /**
   * Creates a new comment for a post.
   *
   * @route POST /api/v1/comment/create
   *
   * @param {Request} req - Express request object containing:
   *   - req.user._id: authenticated user
   *   - req.body: TCreateComment
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TCommentResponse>>}
   *
   * @description
   * Validates the authenticated user, creates a comment in the database,
   * and returns the created comment in a public-safe response format.
   */
  createComment = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?._id) {
      throw new ApiError(400, 'Unauthorized');
    }

    const comment = await this.service.createComment(req.body, req.user?._id);

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.OK, comment, 'Created comment successfully.'));
  });

  /**
   * Deletes a comment by ID.
   *
   * @route DELETE /api/v1/comment/delete
   *
   * @param {Request} req - Express request object containing:
   *   - req.user._id: authenticated user
   *   - req.query._id: string (comment ID to delete)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TCommentDeleteResponse>>}
   *
   * @description
   * Validates authentication, deletes the comment if it exists,
   * and returns a success response containing the deleted comment ID and post ID.
   */
  deleteComment = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?._id) {
      throw new ApiError(400, 'Unauthorized');
    }

    const commentId = String(req.query._id);

    const commentDeleteResponse = await this.service.deleteComment(commentId);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, commentDeleteResponse, 'Deleted comment successfully.'));
  });

  /**
   * Retrieves paginated comments for a post using cursor-based pagination.
   *
   * @route GET /api/v1/comment/:postId
   *
   * @param {Request} req - Express request object containing:
   *   - req.user._id: authenticated user
   *   - req.params.postId: ID of the post for which comments are requested
   *   - req.query.limit?: number
   *   - req.query.cursor?: string (ISO timestamp)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TCommentsResponseWithCursorPaginationResponse>>}
   *
   * @description
   * Fetches a cursor-paginated list of comments for the specified post.
   * Includes pagination metadata such as `hasMore` and `nextCursor`.
   */
  fetchPaginatedComments = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const postId = req.params.postId;
    const { limit, cursor } = req.query;

    const comments = await this.service.fetchPaginatedComments({
      postId: postId as string,
      limit: Number(limit),
      cursor: cursor ? String(cursor) : null,
      userId: req.user._id,
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, comments, 'Fetched comments successfully'));
  });
}
