import type { Request, Response } from 'express';

import { HttpStatus, type TCreateLike } from 'shared';

import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { LikeService } from '../services/like.service.js';

export class LikeController {
  /**
   * Creates or Deleate a like/reaction.
   *
   * @route POST /api/v1/reaction/react
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
