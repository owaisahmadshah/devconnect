import { Profile } from '../models/profile.model.js';
import { HttpStatus, type TUserProfileResponse, type TUserProfileSummaryResponse } from 'shared';
import { ApiError } from '../utils/ApiError.js';
import { ProfileMapper } from '../mapper/profile.mapper.js';
import { UserService } from './user.service.js';

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
  static async getUsersProfile(identifier: string): Promise<TUserProfileResponse> {
    const user = await UserService.getUser(identifier);

    const profile = await Profile.findOne({ user: user._id }).populate({
      path: 'user',
      select: 'username email role',
    });

    if (!profile) {
      throw new ApiError(HttpStatus.NO_CONTENT, 'Profile not found.');
    }

    const responseProfile = ProfileMapper.toUserProfile(profile);

    return responseProfile;
  }
}
