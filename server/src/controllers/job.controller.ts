import type { Request, Response } from 'express';

import type { JobService } from '../services/job.service.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { HttpStatus } from 'shared';
import { ApiResponse } from '../utils/ApiResponse.js';

export class JobController {
  constructor(private service: JobService) {}

  /**
   * Creates a new job.
   *
   * @route POST /api/v1/jobs/create
   *
   * @param {Request} req - Contains `req.user` (authenticated user)
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TJobResponse>>}
   *
   * @description
   * Creates a new job for the authenticated user.
   */
  createJob = asyncHandler(async (req: Request, res: Response) => {
    const jobResponse = await this.service.createJob({
      ...req.body,
      createdBy: req.user?.profileId as string,
    });

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.CREATED, jobResponse, 'Job created successfully'));
  });

  /**
   * Deletes a job.
   *
   * @route DELETE /api/v1/jobs/:_id
   *
   * @param {Request} req - Contains `req.user` (authenticated user) and `req.params._id`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TJobResponse>>}
   *
   * @description
   * Deletes a job for the authenticated user.
   */
  deleteJob = asyncHandler(async (req: Request, res: Response) => {
    const deletedJob = await this.service.deleteJob({
      _id: String(req.params._id),
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, deletedJob, 'Job deleted successfully'));
  });

  /**
   * Updates a job's status.
   *
   * @route PATCH /api/v1/jobs/update-status
   *
   * @param {Request} req - Contains `req.user` (authenticated user), `req.body._id` and `req.body.status`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TJobResponse>>}
   *
   * @description
   * Updates a job's status for the authenticated user.
   */
  updateJobStatus = asyncHandler(async (req: Request, res: Response) => {
    const updatedJob = await this.service.updateJobStatus({
      _id: req.body._id,
      status: req.body.status,
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, updatedJob, 'Job status updated successfully'));
  });

  /**
   * Retrieves a job by its ID.
   *
   * @route GET /api/v1/jobs/:_id
   *
   * @param {Request} req - Contains `req.user` (authenticated user) and `req.params._id`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TJobResponse>>}
   *
   * @description
   * Retrieves a job by its ID for the authenticated user.
   */
  findJobById = asyncHandler(async (req: Request, res: Response) => {
    const jobResponse = await this.service.findJobById({
      jobId: String(req.params._id),
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, jobResponse, 'Job retrieved successfully'));
  });

  /**
   * Retrieves all jobs of an organization.
   *
   * @route GET /api/v1/organizations/:organizationId/jobs
   *
   * @param {Request} req - Contains `req.user` (authenticated user), `req.params.organizationId`, and query parameters `limit` and `cursor`
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TJobListResponseWithCursorPagination[]>>}
   *
   * @description
   * Retrieves all jobs of an organization for the authenticated user, with pagination support.
   */
  findAllJobsOfOrganization = asyncHandler(async (req: Request, res: Response) => {
    const jobsResponse = await this.service.findAllJobsOfOrganization({
      organizationId: String(req.params.organizationId),
      limit: Number(req.query.limit) || 10,
      cursor: (req.query.cursor as string) || null,
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, jobsResponse, 'Jobs retrieved successfully'));
  });
}
