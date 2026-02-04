import mongoose from 'mongoose';

import {
  HttpStatus,
  type TDeleteProfileArrayItem,
  type TUserProfileResponse,
  type TUserProfileSummaryResponse,
  type TAddProfileArrayField,
  type TAddNewItemToProfileWithIdResponse,
  type TSingleImageBackend,
  type TUpdateProfileField,
  type TValidateSearchParamsPagination,
  type TUserProfileSummaryresponseWithPagination,
  type TFullNameSearch,
} from 'shared';
import type { IRequestUser } from '../types/index.js';

import { ApiError } from '../utils/ApiError.js';
import { ProfileMapper } from '../mapper/profile.mapper.js';
import { UserService } from './user.service.js';
import { ProfileRepository } from '../repositories/profile.repository.js';

import { uploadSingleImage } from '../utils/uploadImages.js';

interface IProfileServiceDeps {
  repo: ProfileRepository;
  userService: UserService;
  profileMapper: ProfileMapper;
  uploadSingleImage: typeof uploadSingleImage;
  objectId: typeof mongoose.Types.ObjectId;
}

export class ProfileService {
  constructor(private deps: IProfileServiceDeps) {}

  getUserProfileSummary = async (queryText: string): Promise<TUserProfileSummaryResponse> => {
    const { repo, profileMapper } = this.deps;

    const profile = await repo.findByUserIdOrProfileUrl(queryText);

    if (!profile) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Profile not found.');
    }

    const profileRes = profileMapper.toUserProfileSummary(profile);

    return profileRes;
  };

  getUsersProfile = async (
    profileUrl: string,
    reqUserProfileId: string,
  ): Promise<TUserProfileResponse> => {
    const { repo, profileMapper } = this.deps;

    const userProfile = await repo.findByProfileUrl(profileUrl);

    if (!userProfile) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Profile not found.');
    }

    const subjectProfileId = userProfile._id as string;

    const [profile] = await repo.findProfileByIdWithConnection({
      viewerProfileId: reqUserProfileId,
      subjectProfileId: subjectProfileId,
    });

    if (!profile) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Profile not found.');
    }

    const responseProfile = profileMapper.toUserProfile(profile);

    // If user requesting his own profile
    if (responseProfile._id === reqUserProfileId) {
      return responseProfile;
    }

    // Removing all privates
    const privateProfile = profileMapper.toFilterPrivateProfile(responseProfile);

    // TODO: If user is not in connections filter connections-only

    return privateProfile;
  };

  addArrayItem = async (
    updateData: TAddProfileArrayField,
    user: IRequestUser,
  ): Promise<TAddNewItemToProfileWithIdResponse> => {
    const { repo } = this.deps;
    const profile = await repo.addArrayItem(user._id, updateData);

    if (!profile) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Profile not found.');
    }

    const newlyAddedItem: TAddNewItemToProfileWithIdResponse = (profile as any)[
      updateData.fieldName
    ][0];

    return newlyAddedItem;
  };

  removeArrayItem = async (
    removeData: TDeleteProfileArrayItem,
    user: IRequestUser,
  ): Promise<TUserProfileResponse> => {
    const { repo, profileMapper } = this.deps;

    const { fieldName, deleteObjectId } = removeData;

    const profile = await repo.removeArrayItem(user._id, fieldName, deleteObjectId);

    if (!profile) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Profile not found.');
    }

    const responseProfile = profileMapper.toUserProfile(profile);

    return responseProfile;
  };

  updateProfileImage = async (
    image: TSingleImageBackend,
    user: IRequestUser,
  ): Promise<TUserProfileResponse> => {
    const { repo, uploadSingleImage, profileMapper } = this.deps;
    const { url, success } = await uploadSingleImage(image.path);

    if (!success) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error uploading profile picture to cloudinary.',
      );
    }

    const profile = await repo.updateField(user._id, 'profilePictureUrl', url);

    if (!profile) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Profile not found.');
    }

    const responseProfile = profileMapper.toUserProfile(profile);

    return responseProfile;
  };

  updateProfileField = async (
    updateData: TUpdateProfileField,
    user: IRequestUser,
  ): Promise<TUserProfileResponse> => {
    const { repo, profileMapper } = this.deps;

    const { fieldName, fieldData } = updateData;

    const profile = await repo.findByUserId(user._id);

    if (!profile) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Profile not found.');
    }

    profile[fieldName] = fieldData;

    if (fieldName === 'firstName' || fieldName === 'lastName') {
      const originalFirstName = profile.firstName.trim()?.split(' ').join('-').toLowerCase();
      const originalLastName = profile.lastName?.trim()?.split(' ').join('-').toLowerCase();
      const originalSlug = `${originalFirstName}-${originalLastName}`;

      let newSlug = fieldData.trim().split(' ').join('-').toLowerCase();

      if (fieldName === 'firstName') {
        newSlug = `${newSlug}-${originalLastName}`;
      } else {
        newSlug = `${originalFirstName}-${newSlug}`;
      }

      profile.profileUrls = profile.profileUrls?.filter(url => url.url !== originalSlug);
      (profile.profileUrls as any[]).unshift({ url: newSlug });
    }

    await repo.save(profile);

    const responseProfile = profileMapper.toUserProfile(profile);
    return responseProfile;
  };

  searchProfiles = async (
    input: string,
    pagination: TValidateSearchParamsPagination,
  ): Promise<TUserProfileSummaryresponseWithPagination> => {
    const { repo, profileMapper, objectId } = this.deps;

    const { limit, cursor } = pagination;

    // TODO: Change all createdAt cursors' to _id
    const matchStage = cursor ? { $match: { _id: { $lt: new objectId(cursor) } } } : null;

    const results = await repo.searchProfiles(input, matchStage, limit);

    const hasMore = results.length > limit;
    const items = hasMore
      ? results.slice(0, -1).map(item => profileMapper.toUserProfileSummary(item))
      : results;
    const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

    return {
      profiles: items,
      hasMore,
      nextCursor,
    };
  };

  fetchUsersByName = async (
    { fullName }: TFullNameSearch,
    pagination: TValidateSearchParamsPagination,
  ): Promise<TUserProfileSummaryresponseWithPagination> => {
    return this.searchProfiles(fullName, pagination);
  };

  recommendProfiles = async ({
    profileId,
    limit,
    cursor,
  }: {
    profileId: string;
    limit: number;
    cursor: string | null;
  }): Promise<TUserProfileSummaryresponseWithPagination> => {
    const { repo, profileMapper } = this.deps;

    const profiles = await repo.recommendPaginatedProfiles({ profileId, limit, cursor });

    const responseProfiles = profiles.map(profile => profileMapper.toUserProfileSummary(profile));

    const hasMore = responseProfiles.length === limit;

    const nextCursor = hasMore ? profiles.at(-1).createdAt.toISOString() : null;

    return {
      profiles,
      hasMore,
      nextCursor,
    };
  };
}
