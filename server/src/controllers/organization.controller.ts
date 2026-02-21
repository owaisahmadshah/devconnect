import type { Request, Response } from 'express';

import type { OrganizationService } from '../services/organization.service.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HttpStatus } from 'shared';

export class OrganizationController {
  constructor(private service: OrganizationService) {}

  /**
   * Creates a new organization.
   *
   * @route POST /api/v1/organizations/create
   *
   * @param {Request} req - Contains `req.user` (authenticated user)
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationResponse>>}
   *
   * @description
   * Creates a new organization for the authenticated user.
   */
  createOrganization = asyncHandler(async (req: Request, res: Response) => {
    const organizationResopnse = await this.service.createOrganization({
      ...req.body,
      createdBy: req.user?.profileId as string,
    });

    return res
      .status(HttpStatus.CREATED)
      .json(
        new ApiResponse(
          HttpStatus.CREATED,
          organizationResopnse,
          'Organization created successfully',
        ),
      );
  });

  /**
   * Deletes an organization.
   *
   * @route DELETE /api/v1/organizations/:organizationId
   *
   * @param {Request} req - Contains `req.user` (authenticated user) and `req.params.organizationId`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationResponse>>}
   *
   * @description
   * Deletes an organization for the authenticated user.
   */
  deleteOrganization = asyncHandler(async (req: Request, res: Response) => {
    const deletedOrganization = await this.service.deleteOrganization({
      _id: String(req.params.organizationId),
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, deletedOrganization, 'Organization deleted successfully'),
      );
  });

  /**
   * Retrieves a list of organizations the authenticated user belongs to.
   *
   * @route GET /api/v1/organizations
   *
   * @param {Request} req - Contains `req.user` (authenticated user) and optional query parameters `limit` and `cursor` for pagination
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationListResponseWithCursorPagination[]>>}
   *
   * @description
   * Fetches all organizations that the authenticated user is a member of.
   */
  getUserOrganizations = asyncHandler(async (req: Request, res: Response) => {
    const organizations = await this.service.findAllOrganizationsOfUser({
      profileId: req.user?.profileId as string,
      limit: Number(req.query.limit) || 10,
      cursor: (req.query.cursor as string) || null,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, organizations, 'Fetched user organizations successfully'),
      );
  });

  /**
   * Retrieves details of a specific organization by its URL or _id identifier.
   *
   * @route GET /api/v1/organizations/:query
   *
   * @param {Request} req - Contains `req.user` (authenticated user) and `req.params.query` (organization URL or ID)
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationResponse>>}
   *
   * @description
   * Fetches detailed information about a specific organization using its URL or _id identifier.
   */
  getOrganizationByIdOrURL = asyncHandler(async (req: Request, res: Response) => {
    const organization = await this.service.findOrganizationByIdOrURL({
      query: String(req.params.query),
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, organization, 'Fetched organization successfully'));
  });
}
