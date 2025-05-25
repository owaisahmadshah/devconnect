import { userProfileSummarySchema, type TProfile, type TUserProfileSummaryResponse } from 'shared';
import { Document } from 'mongoose';

export class ProfileMapper {
  static toUserProfileSummary(profileData: TProfile | Document): TUserProfileSummaryResponse {
    const profileObj = profileData instanceof Document ? profileData.toObject() : profileData;
    return {
      _id: profileObj._id,
      username: profileObj.user.username,
      email: profileObj.user.email,
      firstName: profileObj.firstName,
      lastName: profileObj.lastName ?? '',
      role: profileObj.user.role,
      profilePictureUrl: profileObj.profilePictureUrl,
      bio: profileObj.bio,
      isVerified: profileObj.isVerified,
    };
  }
}
