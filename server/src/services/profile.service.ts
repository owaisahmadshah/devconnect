import { Profile } from '../models/profile.model.js';
import { HttpStatus, type TUserProfileResponse, type TUserProfileSummaryResponse } from 'shared';
import { ApiError } from '../utils/ApiError.js';
import { ProfileMapper } from '../mapper/profile.mapper.js';
import { UserService } from './user.service.js';
import type { IRequestUser } from '../types/index.js';

export class ProfileService {
  static async getUserProfile(userId: string): Promise<TUserProfileSummaryResponse> {
    const profile = await Profile.findOne({ user: userId })
      .populate({
        path: 'user',
        select: 'username email role',
      })
      .select('_id user firstName lastName profilePictureUrl bio isVerified');

    if (!profile) {
      throw new ApiError(HttpStatus.NO_CONTENT, 'Profile not found.');
    }

    const profileRes = ProfileMapper.toUserProfileSummary(profile);

    return profileRes;
  }
  static async getUsersProfile(
    identifier: string,
    reqUser: IRequestUser | null,
  ): Promise<TUserProfileResponse> {
    const user = await UserService.getUser(identifier);

    const profile = await Profile.findOne({ user: user._id }).populate({
      path: 'user',
      select: 'username email role',
    });

    if (!profile) {
      throw new ApiError(HttpStatus.NO_CONTENT, 'Profile not found.');
    }

    const responseProfile = ProfileMapper.toUserProfile(profile);

    // If user is requesting his/her profile
    if (reqUser?._id === user._id) {
      return responseProfile;
    }

    // Removing all privates
    const privateProfile = ProfileMapper.toFilterPrivateProfile(responseProfile);

    // TODO: If user is not in connections filter connections-only

    return privateProfile;
  }
}
