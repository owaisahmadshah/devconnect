import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ProfileService } from '../services/profile.service.js';
import {
  HttpStatus,
  type TDeleteProfileArrayItem,
  type TAddProfileArrayField,
  type TSingleImageBackend,
  type TUpdateProfileField,
  type TFullNameSearch,
  type TPagination,
} from 'shared';
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

    const profile = await ProfileService.getUserProfileSummary(req.user._id);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Got user profile successfully.'));
  });

  /**
   * Retrieves user's profile.
   *
   * @route GET /api/v1/users/:username
   * @param {Request} req.params.identifier contains username or email
   * @returns User profile of type TUserProfileResponse
   */
  static getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const params = req.params;
    if (!params.identifier) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Username is not provided.');
    }
    const profile = await ProfileService.getUsersProfile(params.identifier, req?.user ?? null);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Got user profile successfully.'));
  });

  /**
   * Retrieves user's profile.
   *
   * @route PATCH /api/v1/profile/add-array-item
   * @param {Request} req.params.identifier contains IRequestUser
   * @returns User profile of type TUserProfileResponse
   */
  static addArrayItem = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const updateData: TAddProfileArrayField = req.body;

    const profile = await ProfileService.addArrayItem(updateData, req.user);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Got user profile successfully.'));
  });

  /**
   * Retrieves user's profile.
   *
   * @route DELETE /api/v1/profile/remove-array-item
   * @param {Request} req contains IRequestUser and TDeleteProfileArrayItem
   * @returns
   */
  static removeArrayItem = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const updateData: TDeleteProfileArrayItem = req.query as TDeleteProfileArrayItem;

    await ProfileService.removeArrayItem(updateData, req.user);

    return res.status(HttpStatus.NO_CONTENT).end();
  });

  /**
   * Retrieves user's profile.
   *
   * @route PATCH /api/v1/profile/update-profile-image
   * @param {Request} req contains IRequestUser and TSingleImageBackend
   * @returns User profile of type TUserProfileResponse
   */
  static updateProfilePicture = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    const updateData: TSingleImageBackend = req.file as TSingleImageBackend;
    const profile = await ProfileService.updateProfileImage(updateData, req.user);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Updated profile picture successfully.'));
  });

  /**
   * Updates user's profile single field.
   *
   * @route PATCH /api/v1/profile/update-field
   * @param {Request} req contains IRequestUser and TUpdateProfileField
   * @returns User profile of type TUserProfileResponse
   */
  static updateProfileField = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const updateData: TUpdateProfileField = req.body as TUpdateProfileField;
    const profile = await ProfileService.updateProfileField(updateData, req.user);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Updated profile picture successfully.'));
  });

  /**
   * Fetches user profiles using first and last name.
   *
   * @route GET /api/v1/profile/fetch-profiles-by-names
   * @param {Request} req contains TFullNameSearch & TPagination
   * @returns User profile of type TUserProfileResponse
   */
  static fullNameSearch = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, limit, cursor } = req.query;

    const profiles = await ProfileService.fetchUsersByName(
      { fullName: fullName as string },
      { limit: Number(limit), cursor: typeof cursor === 'string' ? cursor : null },
    );

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profiles, 'Got profiles successfully.'));
  });
}
