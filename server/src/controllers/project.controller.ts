import type { Request, Response } from 'express';

import {
  HttpStatus,
  type TAddProjectArrayItem,
  type TCreateProjectBackend,
  type TDeleteProject,
  type TDeleteProjectArrayItem,
  type TMultipleBackendImages,
  type TUpdateProjectField,
} from 'shared';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import type { ProjectService } from '../services/project.service.js';

export class ProjectController {
  constructor(private service: ProjectService) {}

  /**
   * Creates a new project for the authenticated user.
   *
   * @route POST /api/v1/project/create
   * @param {Request} req - Contains authenticated user (req.user) and project data (TCreateProjectBackend)
   * @param {Response} res - Express response object
   * @returns {Promise<ApiResponse<any>>} - Returns the created project
   *
   * @description
   * Handles creation of a new project including media files and featured status.
   */
  createProject = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const data: Omit<TCreateProjectBackend, 'media' | 'isFeatured'> = req.body;
    const media: TMultipleBackendImages = (req.files as any)?.media as TMultipleBackendImages;

    const createProjectData: TCreateProjectBackend = {
      ...data,
      media,
      isFeatured: req.body.isFeatured === 'true' ? true : false,
    };

    const project = await this.service.createProject(createProjectData);

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.CREATED, project, 'Created project sucessfully.'));
  });

  /**
   * Deletes a project by ID.
   *
   * @route DELETE /api/v1/project/delete
   * @param {Request} req - Contains authenticated user (req.user) and project ID in query parameters
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - No content returned, project is deleted
   *
   * @description
   * Deletes the specified project of the authenticated user.
   */
  deleteProject = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }
    const { _id } = req.query;
    const data: TDeleteProject = { _id: _id as string };

    await this.service.deleteProject(data, req.user);

    return res.status(HttpStatus.NO_CONTENT).end();
  });

  /**
   * Adds a new array item to a project.
   *
   * @route POST /api/v1/project/add-array-item
   * @param {Request} req - Contains authenticated user (req.user) and array item data (TAddProjectArrayItem)
   * @param {Response} res - Express response object
   * @returns {Promise<ApiResponse<any>>} - Returns the updated project
   *
   * @description
   * Adds a new item to an array field in the project (e.g., techStacks, links).
   */
  addArrayItem = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }
    const data: TAddProjectArrayItem = req.body;

    const project = await this.service.createProjectArrayFieldItem(data, req.user);

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.CREATED, project, 'Created new array item sucessfully.'));
  });

  /**
   * Updates a field of an array item in a project.
   *
   * @route PATCH /api/v1/project/update-field-item
   * @param {Request} req - Contains authenticated user (req.user) and updated field data (TUpdateProjectField)
   * @param {Response} res - Express response object
   * @returns {Promise<ApiResponse<any>>} - Returns the updated project
   *
   * @description
   * Updates a specific field within an array item of the project.
   */
  updateProjectItemField = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }
    const data: TUpdateProjectField = req.body;

    const project = await this.service.updateProjectFieldItem(data, req.user);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, project, 'Updated project sucessfully.'));
  });

  /**
   * Deletes an array item from a project.
   *
   * @route DELETE /api/v1/project/delete-array-item
   * @param {Request} req - Contains authenticated user (req.user) and array item identifier (TDeleteProjectArrayItem)
   * @param {Response} res - Express response object
   * @returns {Promise<ApiResponse<any>>} - Returns the updated project
   *
   * @description
   * Removes a specific item from an array field within a project.
   */
  deleteProjectArrayItem = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }
    const data: TDeleteProjectArrayItem = req.body;

    const project = await this.service.deleteProjectArrayItem(data, req.user);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, project, 'Deleted project array item sucessfully.'));
  });

  /**
   * Searches projects by title.
   *
   * @route GET /api/v1/project/by-title
   * @param {Request} req - Contains authenticated user (req.user) and query parameters: title, limit, cursor
   * @param {Response} res - Express response object
   * @returns {Promise<ApiResponse<any>>} - Returns cursor-paginated list of projects matching the title
   *
   * @description
   * Performs a search of projects based on title, supports pagination.
   */
  searchProjectByTitle = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { title, limit, cursor } = req.query;

    const project = await this.service.searchProjectsByTitle(
      { title: title as string },
      Number(limit as string),
      typeof cursor === 'string' ? cursor : undefined,
    );

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, project, 'Fetched projects successfully.'));
  });

  /**
   * Filters projects by tech stacks.
   *
   * @route GET /api/v1/project/by-techstack
   * @param {Request} req - Contains authenticated user (req.user) and query parameters: techStacks, limit, cursor
   * @param {Response} res - Express response object
   * @returns {Promise<ApiResponse<any>>} - Returns cursor-paginated list of projects filtered by tech stacks
   *
   * @description
   * Filters all projects to include only those containing specified tech stacks.
   */
  filterProjectsByTechStacks = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { techStacks, limit, cursor } = req.query;

    const projects = await this.service.filterProjectsByTechStack(
      {
        techStacks: typeof techStacks === 'string' ? [techStacks] : (techStacks as string[]) ?? [],
      },
      limit ? Number(limit) : 10,
      typeof cursor === 'string' ? cursor : undefined,
    );

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, projects, 'Fetched projects successfully.'));
  });

  /**
   * Fetches projects of a specific user by their profile URL.
   *
   * @route GET /api/v1/project/user/:profileId
   * @param {Request} req - Contains authenticated user (req.user), profileUrl (req.params), and query parameters: limit, cursor
   * @param {Response} res - Express response object
   * @returns {Promise<ApiResponse<any>>} - Returns cursor-paginated list of the user's projects
   *
   * @description
   * Retrieves all projects belonging to a specific user identified by their profile URL.
   */
  fetchUserProjectsByProfileUrls = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { profileUrl } = req.params;
    const { limit, cursor } = req.query;

    const projects = await this.service.fetchUserProjectsByProfileUrls(
      {
        profileUrl: profileUrl as string,
      },
      limit ? Number(limit) : 10,
      typeof cursor === 'string' ? cursor : undefined,
    );

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, projects, 'Fetched projects successfully.'));
  });

  /**
   * Fetches a project by its ID.
   *
   * @route GET /api/v1/project/:projectId
   * @param {Request} req - Contains authenticated user (req.user) and projectId (req.params)
   * @param {Response} res - Express response object
   * @returns {Promise<ApiResponse<any>>} - Returns the requested project
   *
   * @description
   * Retrieves the details of a specific project identified by its ID.
   */
  fetchProjectById = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { projectId } = req.params;

    const projects = await this.service.fetchProjectById({
      projectId: projectId as string,
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, projects, 'Fetched projects successfully.'));
  });
}
