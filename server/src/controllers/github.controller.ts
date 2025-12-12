import type { Request, Response } from 'express';

import { asyncHandler } from '../utils/AsyncHandler.js';
import { GithubService } from '../services/github.service.js';
import { ApiError } from '../utils/ApiError.js';
import { HttpStatus } from 'shared';
import { ApiResponse } from '../utils/ApiResponse.js';

export class GithubController {
  /**
   * Redirects the authenticated user to GitHub for OAuth authentication.
   *
   * @route GET /api/v1/github/connect
   *
   * @param {Request} req - Contains authenticated user (req.user)
   * @param {Response} res - Express response object
   *
   * @returns {Promise<void>} - Redirects user to GitHub login page
   *
   * @description
   * Initiates the GitHub OAuth flow by generating the authorization URL
   * using the client ID and client secret. The user is then redirected
   * to GitHub to grant access.
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
   * Handles the GitHub OAuth callback after user authorization.
   *
   * @route GET /api/v1/github/callback
   *
   * @param {Request} req - Contains authenticated user (req.user) and GitHub callback query parameters
   * @param {Response} res - Express response object
   *
   * @returns {Promise<void>} - Redirects user to a page showing connected GitHub account
   *
   * @description
   * GitHub calls this endpoint after the user grants or denies permissions.
   * Processes the callback, exchanges code for an access token, and redirects
   * the user to the application page displaying their GitHub account details.
   */
  static githubCallback = asyncHandler(async (req: Request, res: Response) => {
    const { redirectUrl } = await GithubService.githubCallback(req, res);
    res.redirect(redirectUrl);
  });

  /**
   * Retrieves the authenticated user's GitHub repositories.
   *
   * @route GET /api/v1/github/repos
   *
   * @param {Request} req - Contains authenticated user (req.user)
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<any>>} - Returns a list of repositories with names and details
   *
   * @description
   * Fetches all repositories from GitHub for the connected user using
   * the stored OAuth token.
   */
  static githubRepos = asyncHandler(async (req: Request, res: Response) => {
    if (!req?.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const repos = await GithubService.githubRepos(req?.user);
    return res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, repos, 'success'));
  });

  /**
   * Adds a new GitHub repository project to the user's account.
   *
   * @route POST /api/v1/github/repo/add
   *
   * @param {Request} req - Contains authenticated user (req.user) and project data (TCreateGithubProject)
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<any>>} - Returns the added GitHub project
   *
   * @description
   * Adds a new project to the authenticated user's GitHub account and
   * returns the project information. Requires OAuth authentication.
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
