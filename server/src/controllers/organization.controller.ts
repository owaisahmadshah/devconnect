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
      profileId: req.user?.profileId as string,
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, organization, 'Fetched organization successfully'));
  });

  /**
   * Retrieves a list of recommended organizations for the authenticated user.
   *
   * @route GET /api/v1/organizations/recommendations
   *
   * @param {Request} req - Contains `req.user` (authenticated user) and optional query parameters `limit` and `cursor` for pagination
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationListResponseWithCursorPagination[]>>}
   *
   * @description
   * Fetches a list of recommended organizations that the authenticated user may be interested in joining.
   */
  findRecommendedOrganizationsForUser = asyncHandler(async (req: Request, res: Response) => {
    const organizations = await this.service.findRecommendedOrganizationsForUser({
      profileId: req.user?.profileId as string,
      limit: Number(req.query.limit) || 10,
      cursor: (req.query.cursor as string) || null,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          organizations,
          'Fetched recommended organizations for user successfully',
        ),
      );
  });

  /**
   * Searches for organizations based on a query string.
   *
   * @route GET /api/v1/organizations/search
   *
   * @param {Request} req - Contains `req.user` (authenticated user) and query parameters `query`, `limit`, and `cursor` for pagination
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationListResponseWithCursorPagination[]>>}
   *
   * @description
   * Searches for organizations that match the provided query string, allowing users to discover new organizations to join.
   */
  searchOrganizations = asyncHandler(async (req: Request, res: Response) => {
    const organizations = await this.service.searchOrganizations({
      query: String(req.query.query),
      profileId: req.user?.profileId as string,
      limit: Number(req.query.limit) || 10,
      cursor: (req.query.cursor as string) || null,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          organizations,
          'Fetched searched organizations successfully',
        ),
      );
  });

  /**
   * Updates a specific field of an organization.
   *
   * @route PATCH /api/v1/organizations/field/:organizationId
   *
   * @param {Request} req - Contains `req.user` (authenticated user), `req.params.organizationId`, and request body with `field` and `value`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationResponse>>}
   *
   * @description
   * Updates a specific field (e.g., description, websiteURL) of an organization. Only organization admins should be allowed to perform this action.
   */
  updateOrganizationField = asyncHandler(async (req: Request, res: Response) => {
    const { organizationId } = req.params;
    const { field, value } = req.body;

    const updatedOrganization = await this.service.updateOrganizationField({
      organizationId: organizationId as string,
      field,
      value,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, updatedOrganization, 'Organization updated successfully'),
      );
  });

  updateOrganizationLogo = asyncHandler(async (req: Request, res: Response) => {
    const { organizationId } = req.params;
    const file = req.file;

    if (!file) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new ApiResponse(HttpStatus.BAD_REQUEST, null, 'Logo file is required'));
    }

    const updatedOrganization = await this.service.updateOrganizationLogo({
      organizationId: organizationId as string,
      file,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          updatedOrganization,
          'Organization logo updated successfully',
        ),
      );
  });
}
