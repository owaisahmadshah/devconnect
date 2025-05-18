import { Profile } from '../models/profile.model.js';
import { HttpStatus, type TUserProfileSummaryResponse } from '@shared/src/index.js';
import { ApiError } from '../utils/ApiError.js';
import { ProfileMapper } from '../mapper/profile.mapper.js';

export class ProfileService {
  static async getUserProfile(userId: string): Promise<TUserProfileSummaryResponse> {
    const profile = await Profile.findById(userId)
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
}
