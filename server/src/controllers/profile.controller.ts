import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ProfileService } from '../services/profile.service.js';
import { HttpStatus } from '@shared/src/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export class ProfileController {
  /**
   * Retrieves a summary of the authenticated user's profile.
   *
   * @route GET /api/v1/users/profile
   * @param {Request} req.user contains authenticated user
   * @returns User profile summary data
   */
  static getSignedInUserProfileSummary = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const profile = await ProfileService.getUserProfile(req.user._id);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Got user profile successfully.'));
  });
}
