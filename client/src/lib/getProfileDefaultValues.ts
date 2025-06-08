import type { TUserProfileResponse } from 'shared';

export const getProfileDefaultValues = (): TUserProfileResponse => {
  return {
    _id: '',
    username: '',
    email: '',
    role: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    profilePictureUrl: '',
    bio: '',
    skills: [],
    educations: [],
    certifications: [],
    achievements: [],
    experiences: [],
    visibility: {
      certifications: 'Private',
      education: 'Private',
      experience: 'Private',
      skills: 'Private',
    },
    profileUrls: [],
    socialMediaLinks: [],
    isVerified: false,
  };
};
