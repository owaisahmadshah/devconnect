import type { Request, Response } from 'express';

import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HttpStatus } from 'shared';
import type { OrganizationMemberService } from '../services/organizationMember.service.js';

export class OrganizationMemberController {
  constructor(private service: OrganizationMemberService) {}

  /**
   * Creates a new organization member.
   *
   * @route POST /api/v1/organization-members/create
   *
   * @param {Request} req - Contains `req.user` (authenticated user) and `req.body` (organization member data)
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationMemberResponse>>}
   *
   * @description
   * Creates a new organization member for the authenticated user.
   */
  createOrganizationMember = asyncHandler(async (req: Request, res: Response) => {
    const organizationMemberResponse = await this.service.createOrgMember({
      ...req.body,
    });

    return res
      .status(HttpStatus.CREATED)
      .json(
        new ApiResponse(
          HttpStatus.CREATED,
          organizationMemberResponse,
          'Organization member created successfully',
        ),
      );
  });

  /**
   * Deletes an organization member.
   *
   * @route DELETE /api/v1/organization-members/:organizationId/delete/:userId
   *
   * @param {Request} req - Contains `req.user` (authenticated user), `req.params.organizationId`, and `req.params.userId`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationMemberResponse>>}
   *
   * @description
   * Deletes an organization member for the authenticated user.
   */
  deleteOrganizationMember = asyncHandler(async (req: Request, res: Response) => {
    const deletedOrganizationMember = await this.service.deleteOrganizationMember({
      organizationId: String(req.params.organizationId),
      userId: String(req.params.userId),
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          deletedOrganizationMember,
          'Organization member deleted successfully',
        ),
      );
  });

  /**
   * Retrieves a list of members in a specific organization.
   *
   * @route GET /api/v1/organization-members/members/:organizationId
   *
   * @param {Request} req - Contains `req.user` (authenticated user) and `req.params.organizationId`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationMemberResponse[]>>}
   *
   * @description
   * Fetches all members in a specific organization that the authenticated user is a part of.
   */
  findOrganizationAllMembers = asyncHandler(async (req: Request, res: Response) => {
    const members = await this.service.findAllMembersOfOrganizationById({
      organizationId: String(req.params.organizationId),
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, members, 'Fetched organization members successfully'));
  });

  /**
   * Updates an organization member's role.
   *
   * @route PUT /api/v1/organization-members/update-role
   *
   * @param {Request} req - Contains `req.user` (authenticated user), req.body._id (organization member ID), and req.body.role (new role)`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationMemberResponse>>}
   *
   * @description
   * Updates an organization member's role for the authenticated user.
   */
  updateOrganizationMemberRole = asyncHandler(async (req: Request, res: Response) => {
    const updatedOrganizationMember = await this.service.updateOrganizationMemberRole({
      _id: req.body._id,
      role: req.body.role,
      organizationId: req.body.organizationId,
      actorId: String(req.user?.profileId),
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          updatedOrganizationMember,
          'Organization member role updated successfully',
        ),
      );
  });

  /**
   * Fetches organization member invitations.
   *
   * @route GET /api/v1/organization-members/invitations
   *
   * @param {Request} req - Contains `req.user` (authenticated user)`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationMemberResponse[]>>}
   *
   * @description
   * Fetches organization member invites of a user.
   */
  organizationMemberInvitations = asyncHandler(async (req: Request, res: Response) => {
    const updatedOrganizationMember = await this.service.organizationMemberInvitations({
      profileId: String(req.user?.profileId ?? ''),
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          updatedOrganizationMember,
          'Organization member role updated successfully',
        ),
      );
  });

  /**
   * Updates an organization member's role.
   *
   * @route POST /api/v1/organization-members/invite
   *
   * @param {Request} req - Contains `req.user` (authenticated user), req.body.userId (organization member ID), req.body.status (optional flag, pending or accepted), req.body.role (admin or member), and req.body.role (new role)`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TOrganizationMemberResponse>>}
   *
   * @description
   * Creates a new invite for an organization.
   */
  createOrganizationMemberInvite = asyncHandler(async (req: Request, res: Response) => {
    const updatedOrganizationMember = await this.service.createOrganizationMemberInvite({
      ...req.body,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          updatedOrganizationMember,
          'Organization member role updated successfully',
        ),
      );
  });
}
