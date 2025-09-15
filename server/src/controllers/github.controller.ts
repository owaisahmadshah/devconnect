import type { Request, Response } from 'express';

import { asyncHandler } from '../utils/AsyncHandler.js';
import { GithubService } from '../services/github.service.js';
import { ApiError } from '../utils/ApiError.js';
import { HttpStatus } from 'shared';
import { ApiResponse } from '../utils/ApiResponse.js';

export class GithubController {
  /**
   * Just redirects to github login page with client_id and client_secret
   *
   * @route GET /api/v1/github/connect
   * @redirect To github login page
   */
  static connectGithub = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'User is unauthrozied');
    }
    const { redirectUrl } = await GithubService.connectGithub();
    res.redirect(redirectUrl);
  });

  /**
   * Github will hit this end point after user gives permission.
   *
   * @route GET /api/v1/github/callback
   * @param {Request} req contains IRequestUser and user github info
   * @redirect To a page where user can see it's github account it connect
   */
  static githubCallback = asyncHandler(async (req: Request, res: Response) => {
    const { redirectUrl } = await GithubService.githubCallback(req, res);
    res.redirect(redirectUrl);
  });

  /**
   * To get user github repositories
   *
   * @route GET /api/v1/github/repos
   * @param {Request} req contains IRequestUser
   * @return List of repositories with their names
   */
  static githubRepos = asyncHandler(async (req: Request, res: Response) => {
    if (!req?.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const repos = await GithubService.githubRepos(req?.user);
    return res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, repos, 'success'));
  });

  /**
   * To add a github repository
   *
   * @route POST /api/v1/github/repo/add
   * @param {Request} req contains IRequestUser and TCreateGithubProject
   * @return Added project
   */
  static addRepoProject = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const project = await GithubService.addRepoProject(req.user, req.body);

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.OK, project, 'Added github project sucessfully.'));
  });
}
