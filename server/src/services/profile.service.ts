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
import { ApiError } from '../utils/ApiError.js';
import { ProfileMapper } from '../mapper/profile.mapper.js';
import { UserService } from './user.service.js';
import type { IRequestUser } from '../types/index.js';
import { uploadSingleImage } from '../utils/uploadImages.js';
import type { ProfileRepository } from '../repositories/profile.repository.js';

export class ProfileService {
  constructor(private repo: ProfileRepository, private userServ: UserService) {}

  getUserProfileSummary = async (queryText: string): Promise<TUserProfileSummaryResponse> => {
    const profile = await this.repo.findByUserIdOrProfileUrl(queryText);

    if (!profile) {
      throw new ApiError(HttpStatus.NO_CONTENT, 'Profile not found.');
    }

    const profileRes = ProfileMapper.toUserProfileSummary(profile);

    return profileRes;
  };

  getUsersProfile = async (
    profileUrl: string,
    reqUser: IRequestUser | null,
  ): Promise<TUserProfileResponse> => {
    const profile = await this.repo.findByProfileUrl(profileUrl);

    if (!profile) {
      throw new ApiError(HttpStatus.NO_CONTENT, 'Profile not found.');
    }

    const responseProfile = ProfileMapper.toUserProfile(profile);

    const user = await this.userServ.getUser(reqUser?.email ?? '');

    // If user requesting his own profile
    if (reqUser?._id === user?._id) {
      return responseProfile;
    }

    // Removing all privates
    const privateProfile = ProfileMapper.toFilterPrivateProfile(responseProfile);

    // TODO: If user is not in connections filter connections-only

    return privateProfile;
  };

  addArrayItem = async (
    updateData: TAddProfileArrayField,
    user: IRequestUser,
  ): Promise<TAddNewItemToProfileWithIdResponse> => {
    const profile = await this.repo.addArrayItem(user._id, updateData);

    if (!profile) {
      throw new ApiError(404, 'Profile not found.');
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
    const { fieldName, deleteObjectId } = removeData;

    const profile = await this.repo.removeArrayItem(user._id, fieldName, deleteObjectId);

    if (!profile) {
      throw new ApiError(404, 'Profile not found.');
    }

    const responseProfile = ProfileMapper.toUserProfile(profile);

    return responseProfile;
  };

  updateProfileImage = async (
    image: TSingleImageBackend,
    user: IRequestUser,
  ): Promise<TUserProfileResponse> => {
    // TODO: Add DI for uploads
    const { url, success } = await uploadSingleImage(image.path);

    if (!success) {
      throw new ApiError(401, 'Error uploading proilfe picture to cloudinary.');
    }

    const profile = await this.repo.updateField(user._id, 'profilePictureUrl', url);

    if (!profile) {
      throw new ApiError(401, 'User not found.');
    }

    const responseProfile = ProfileMapper.toUserProfile(profile);

    return responseProfile;
  };

  updateProfileField = async (
    updateData: TUpdateProfileField,
    user: IRequestUser,
  ): Promise<TUserProfileResponse> => {
    const { fieldName, fieldData } = updateData;

    const profile = await this.repo.findByUserId(user._id);

    if (!profile) {
      throw new ApiError(401, 'User not found.');
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

    await this.repo.save(profile);

    const responseProfile = ProfileMapper.toUserProfile(profile);
    return responseProfile;
  };

  searchProfiles = async (
    input: string,
    pagination: TValidateSearchParamsPagination,
  ): Promise<TUserProfileSummaryresponseWithPagination> => {
    const { limit, cursor } = pagination;

    // TODO: Change all createdAt cursors' to _id
    const matchStage = cursor
      ? { $match: { _id: { $lt: new mongoose.Types.ObjectId(cursor) } } }
      : null;

    const results = await this.repo.searchProfiles(input, matchStage, limit);

    const hasMore = results.length > limit;
    const items = hasMore
      ? results.slice(0, -1).map(item => ProfileMapper.toUserProfileSummary(item))
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
}
