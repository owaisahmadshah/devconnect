import type { Request, Response } from 'express';

import {
  HttpStatus,
  type TAddProjectArrayItem,
  type TCreateProject,
  type TDeleteProject,
  type TDeleteProjectArrayItem,
  type TUpdateProjectField,
} from 'shared';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ProjectService } from '../services/project.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export class ProjectController {
  /**
   * Creates a project.
   *
   * @route POST /api/v1/project/create
   * @param {Request} req.user contains authenticated user TCreateProject(req.body)
   * @returns TProjectResponse
   */
  static createProject = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }
    const data: TCreateProject = req.body;

    const project = await ProjectService.createProject(data);

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.OK, project, 'Created project sucessfully.'));
  });

  /**
   * Deletes a project.
   *
   * @route DELETE /api/v1/project/delete
   * @param {Request} req.user contains authenticated user and projectId(req.query)
   * @returns
   */
  static deleteProject = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }
    const { _id } = req.query;
    const data: TDeleteProject = { _id: _id as string };

    await ProjectService.deleteProject(data, req.user);

    return res
      .status(HttpStatus.NO_CONTENT)
      .json(new ApiResponse(HttpStatus.NO_CONTENT, {}, 'Deleted project sucessfully.'));
  });

  /**
   * Creates a new array item in project.
   *
   * @route POST /api/v1/project/add-array-item
   * @param {Request} req.user contains authenticated user and TAddProjectArrayItem(req.body)
   * @returns TProjectResponse
   */
  static addArrayItem = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }
    const data: TAddProjectArrayItem = req.body;

    const project = ProjectService.createProjectArrayFieldItem(data, req.user);

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.CREATED, project, 'Created new array item sucessfully.'));
  });

  /**
   * Creates a new array item in project.
   *
   * @route PATCH /api/v1/project/update-field-item
   * @param {Request} req.user contains authenticated user and TUpdateProjectField(req.body)
   * @returns TProjectResponse
   */
  static updateProjectItemField = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }
    const data: TUpdateProjectField = req.body;

    const project = ProjectService.updateProjectFieldItem(data, req.user);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, project, 'Updated project sucessfully.'));
  });

  /**
   * Deletes array item in project.
   *
   * @route DELETE /api/v1/project/delete-array-item
   * @param {Request} req contains authenticated user(req.user) and TDeleteProjectArrayItem(req.body)
   * @returns TProjectResponse
   */
  static deleteProjectArrayItem = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }
    const data: TDeleteProjectArrayItem = req.body;

    const project = ProjectService.deleteProjectArrayItem(data, req.user);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, project, 'Deleted project array item sucessfully.'));
  });

  /**
   * Creates a new array item in project.
   *
   * @route GET /api/v1/project/by-title
   * @param {Request} req contains authenticated user(req.user) and title, limit and cursor in req.query
   * @returns TProjectsSummaryWithCursorPaginationResponse[]
   */
  static searchProjectByTitle = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { title, limit, cursor } = req.query;

    const project = await ProjectService.searchProjectsByTitle(
      { title: title as string },
      Number(limit as string),
      typeof cursor === 'string' ? cursor : undefined,
    );

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, project, 'Fetched projects successfully.'));
  });

  /**
   * Filtering projects based on techStacks.
   *
   * @route GET /api/v1/project/by-techstack
   * @param {Request} req.user contains authenticated user and { techStacks, limit, cursor } in req.query
   * @returns TProjectsSummaryWithCursorPaginationResponse[]
   */
  static filterProjectsByTechStacks = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { techStacks, limit, cursor } = req.query;

    const projects = await ProjectService.filterProjectsByTechStack(
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
   * Filtering projects of a particular user.
   *
   * @route GET /api/v1/project/user/:profileId
   * @param {Request} req contains authenticated user(req.user) profilId(req.params) and {limit, cursor}(req.query)
   * @returns TProjectsSummaryWithCursorPaginationResponse[]
   */
  static fetchUserProjects = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { profileId } = req.params;
    const { limit, cursor } = req.query;

    const projects = await ProjectService.fetchUserProjects(
      {
        profileId: profileId as string,
      },
      limit ? Number(limit) : 10,
      typeof cursor === 'string' ? cursor : undefined,
    );

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, projects, 'Fetched projects successfully.'));
  });

  /**
   * Fetches a particular project with _id.
   *
   * @route GET /api/v1/project/:projectId
   * @param {Request} req contains authenticated user(req.user) and projectId(req.params)
   * @returns TProjectResponse
   */
  static fetchProjectById = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { projectId } = req.params;

    const projects = await ProjectService.fetchProjectById({
      projectId: projectId as string,
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, projects, 'Fetched projects successfully.'));
  });
}
