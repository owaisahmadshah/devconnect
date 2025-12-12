import type { Request, Response } from 'express';

import { HttpStatus, type TCreateLike } from 'shared';

import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { LikeService } from '../services/like.service.js';

export class LikeController {
  /**
   * Creates or deletes a like/reaction for a post or comment.
   *
   * @route POST /api/v1/reaction/react
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.body: TCreateLike (data for the like/reaction, e.g., postId, type)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<{ isCreated: boolean }>>}
   *
   * @description
   * Toggles a like/reaction for a post or comment.
   * If the reaction already exists, it is removed; otherwise, it is created.
   * Returns `isCreated` indicating whether the like was added (true) or removed (false).
   */
  static createLike = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const data: TCreateLike = req.body;

    const isCreated = await LikeService.createLike(data, req.user._id);

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.OK, { isCreated }, 'Created reaction successfully.'));
  });
}
