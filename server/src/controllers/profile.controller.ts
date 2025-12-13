import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ProfileService } from '../services/profile.service.js';
import {
  HttpStatus,
  type TDeleteProfileArrayItem,
  type TAddProfileArrayField,
  type TSingleImageBackend,
  type TUpdateProfileField,
} from 'shared';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export class ProfileController {
  constructor(private service: ProfileService) {}

  /**
   * Retrieves a summary of the authenticated user's profile.
   *
   * @route GET /api/v1/users/profile
   *
   * @param {Request} req - Contains `req.user` (authenticated user)
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TUserProfileSummaryResponse>>}
   *
   * @description
   * Fetches the minimal profile summary (name, picture, URLs, verification, etc.)
   * for the currently authenticated user.
   */

  getSignedInUserProfileSummary = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const profile = await this.service.getUserProfileSummary(req.user._id);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Got user profile successfully.'));
  });

  /**
   * Retrieves a user's public profile by username or URL identifier.
   *
   * @route GET /api/v1/users/:url
   *
   * @param {Request} req - Contains:
   *   - req.params.url: username or profile URL
   *   - req.user?: authenticated user (optional)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TUserProfileResponse>>}
   *
   * @description
   * Looks up a user's public profile using a username or profile URL.
   * Returns full public profile information, optionally adjusted based
   * on whether the requester is authenticated.
   */

  getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const params = req.params;

    if (!params.url) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Username is not provided.');
    }

    const profile = await this.service.getUsersProfile(params.url, req?.user ?? null);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Got user profile successfully.'));
  });

  /**
   * Adds an item to an array field in the authenticated user's profile.
   *
   * @route PATCH /api/v1/profile/add-array-item
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.body: TAddProfileArrayField
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TUserProfileResponse>>}
   *
   * @description
   * Adds a new entry (e.g., social link, experience, project link) to an
   * array-type profile field such as `profileUrls`.
   */

  addArrayItem = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const profile = await this.service.addArrayItem(req.body, req.user);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Got user profile successfully.'));
  });

  /**
   * Removes an item from an array field in the authenticated user's profile.
   *
   * @route DELETE /api/v1/profile/remove-array-item
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.query: TDeleteProfileArrayItem
   *
   * @returns {Promise<void>}
   *
   * @description
   * Removes an existing array item from a profile field.
   * Responds with HTTP 204 (No Content) on success.
   */
  removeArrayItem = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    await this.service.removeArrayItem(req.query as TDeleteProfileArrayItem, req.user);

    return res.status(HttpStatus.NO_CONTENT).end();
  });

  /**
   * Updates the authenticated user's profile picture.
   *
   * @route PATCH /api/v1/profile/update-profile-image
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.file: TSingleImageBackend
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TUserProfileResponse>>}
   *
   * @description
   * Replaces the user's current profile picture with a new uploaded image.
   */
  updateProfilePicture = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    const updateData: TSingleImageBackend = req.file as TSingleImageBackend;
    const profile = await this.service.updateProfileImage(updateData, req.user);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Updated profile picture successfully.'));
  });

  /**
   * Updates a single field in the authenticated user's profile.
   *
   * @route PATCH /api/v1/profile/update-field
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.body: TUpdateProfileField
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TUserProfileResponse>>}
   *
   * @description
   * Updates a single profile attribute (e.g., bio, firstName, lastName).
   */

  updateProfileField = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const updateData: TUpdateProfileField = req.body as TUpdateProfileField;
    const profile = await this.service.updateProfileField(updateData, req.user);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profile, 'Updated profile picture successfully.'));
  });

  /**
   * Searches for user profiles by full name with pagination.
   *
   * @route GET /api/v1/profile/fetch-profiles-by-names
   *
   * @param {Request} req - Contains:
   *   - req.query.fullName: string
   *   - req.query.limit?: number
   *   - req.query.cursor?: string (ISO timestamp)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TUserProfileResponse[]>>}
   *
   * @description
   * Performs a full-name based search (first + last name) and returns
   * results using cursor-based pagination for efficient feed loading.
   */
  fullNameSearch = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, limit, cursor } = req.query;

    const profiles = await this.service.fetchUsersByName(
      { fullName: fullName as string },
      { limit: Number(limit), cursor: typeof cursor === 'string' ? cursor : null },
    );

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, profiles, 'Got profiles successfully.'));
  });
}
