import type { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import mongoose from 'mongoose';

import type { IRequestUser } from '../types/index.js';
import { saveState, validateState } from '../utils/stateCache.js';
import { ApiError } from '../utils/ApiError.js';
import { HttpStatus, type TCreateGithubProject, type TProjectResponse, type TReposListResponse } from 'shared';
import { User } from '../models/user.model.js';
import { Profile } from '../models/profile.model.js';
import logger from '../utils/logger.js';
import { GithubMapper } from '../mapper/github.mapper.js';
import { ProfileService } from './profile.service.js';
import { ProjectService } from './project.service.js';

export class GithubService {
  static connectGithub = async (): Promise<{ redirectUrl: string }> => {
    const state = crypto.randomBytes(16).toString('hex');

    saveState(state);

    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&state=${state}&scope=${process.env.GITHUB_SCOPE}`;

    return { redirectUrl };
  };

  static githubCallback = async (req: Request, res: Response): Promise<{ redirectUrl: string }> => {
    const user = req.user;

    if (!user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const { code, state } = req.query;

    if (!validateState(state as string)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid or expired state');
    }

    const profile = await Profile.findOne({ user: user._id });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Exchange code -> access token
      const tokenRes = await axios.post(
        `https://github.com/login/oauth/access_token`,
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        { headers: { Accept: 'application/json' } },
      );

      const { access_token, token_type } = tokenRes.data;

      const ghUser = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${access_token}` },
      });
      const { id, login, avatar_url, html_url, email } = ghUser.data;

      await User.findByIdAndUpdate(
        user._id,
        {
          github_id: id,
          github_login: login,
          github_access_token: access_token,
          github_access_token_type: token_type,
        },
        { session },
      );

      await Profile.updateOne(
        { user: user._id },
        {
          github_avatar_url: avatar_url,
          github_html_url: html_url,
          github_email: email || null,
        },
        { upsert: true, session },
      );

      await session.commitTransaction();
      // TODO: Correct the url redirect user to desired url
      return {
        redirectUrl: `${process.env.FRONTEND_URL}/${profile?.profileUrls[0]?.url}?connected=github`,
      };
    } catch (err) {
      console.error('GitHub OAuth error:', err);

      await session.abortTransaction();

      return {
        redirectUrl: `${process.env.FRONTEND_URL}/${profile?.profileUrls[0]?.url}?error=github`,
      };
    } finally {
      session.endSession();
    }
  };

  static githubRepos = async (req_user: IRequestUser): Promise<TReposListResponse[]> => {
    if (!req_user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const user = await User.findById(req_user._id);
    if (!user?.github_access_token?.trim()) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'GITHUB_ACCESS_TOKEN_MISSING');
    }

    const repos = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `token ${user.github_access_token}` },
    });

    return GithubMapper.toGithubProjectsListResponse(repos.data);
  };

  static addRepoProject = async (
    req_user: IRequestUser,
    repoDetails: TCreateGithubProject,
  ): Promise<TProjectResponse> => {
    if (!req_user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const user = await User.findById(req_user._id);
    if (!user?.github_access_token?.trim()) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'GITHUB_ACCESS_TOKEN_MISSING');
    }

    const response = await axios.get(
      `https://api.github.com/repos/owaisahmadshah/${repoDetails.githubName}`,
      {
        headers: { Authorization: `token ${user.github_access_token}` },
      },
    );

    const profile = await ProfileService.getUserProfileSummary(req_user._id);

    const repo = GithubMapper.toBaseProject(response.data, profile._id);

    return ProjectService.createProject(repo);
  };
}
