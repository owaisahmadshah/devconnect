import {
  type TBaseProfile,
  type TUserProfileResponse,
  type TUserProfileSummaryResponse,
} from 'shared';
import { Document } from 'mongoose';

export class ProfileMapper {
  static toUserProfileSummary(profileData: TBaseProfile | Document): TUserProfileSummaryResponse {
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

  static toUserProfile(profileData: TBaseProfile | Document): TUserProfileResponse {
    const profileObj = profileData instanceof Document ? profileData.toObject() : profileData;
    return {
      _id: profileObj._id,
      username: profileObj.user.username,
      email: profileObj.user.email,
      role: profileObj.user.role,
      firstName: profileObj.firstName,
      lastName: profileObj.lastName ?? '',
      profilePictureUrl: profileObj.profilePictureUrl,
      bio: profileObj.bio,
      isVerified: profileObj.isVerified,
      achievements: profileObj.achievements,
      certifications: profileObj.certifications,
      educations: profileObj.educations,
      experiences: profileObj.experiences,
      phoneNumber: profileObj.phoneNumber,
      profileUrls: profileObj.profileUrls,
      skills: profileObj.skills,
      socialMediaLinks: profileObj.socialMediaLinks,
      visibility: profileObj.visibility,
    };
  }

  static toFilterPrivateProfile(profileObj: TUserProfileResponse): TUserProfileResponse {
    const educations = profileObj.visibility.education === 'Private' ? [] : profileObj.educations;
    const skills = profileObj.visibility.skills === 'Private' ? [] : profileObj.skills;
    const experiences =
      profileObj.visibility.experience === 'Private' ? [] : profileObj.experiences;
    const certifications =
      profileObj.visibility.certifications === 'Private' ? [] : profileObj.certifications;
    // TODO: Add condition for certifications too...

    return {
      ...profileObj,
      certifications: certifications,
      experiences: experiences,
      educations: educations,
      skills: skills,
    };
  }

  static toFilterConnectionsOnlyProfile(profileData: TUserProfileResponse): TUserProfileResponse {
    const profileObj = profileData;

    const educations =
      profileObj.visibility.education === 'connections-only' ? [] : profileObj.educations;
    const skills = profileObj.visibility.skills === 'connections-only' ? [] : profileObj.skills;
    const experiences =
      profileObj.visibility.experience === 'connections-only' ? [] : profileObj.experiences;
    const certifications =
      profileObj.visibility.certifications === 'connections-only' ? [] : profileObj.certifications;
    // TODO: Add condition for certifications too...

    return {
      ...profileObj,
      certifications: certifications,
      experiences: experiences,
      educations: educations,
      skills: skills,
    };
  }
}
