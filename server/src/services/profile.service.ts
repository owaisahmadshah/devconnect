import { Profile } from '../models/profile.model.js';
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
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export class ProfileService {
  static async getUserProfileSummary(userId: string): Promise<TUserProfileSummaryResponse> {
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
    profileUrl: string,
    reqUser: IRequestUser | null,
  ): Promise<TUserProfileResponse> {
    const user = await UserService.getUser(reqUser?.email ?? '');

    const profile = await Profile.findOne({ 'profileUrls.url': profileUrl }).populate({
      path: 'user',
      select: 'username email role',
    });

    if (!profile) {
      throw new ApiError(HttpStatus.NO_CONTENT, 'Profile not found.');
    }

    const responseProfile = ProfileMapper.toUserProfile(profile);

    // If user is requesting his/her profile
    if (reqUser?._id === user?._id) {
      return responseProfile;
    }

    // Removing all privates
    const privateProfile = ProfileMapper.toFilterPrivateProfile(responseProfile);

    // TODO: If user is not in connections filter connections-only

    return privateProfile;
  }

  static async addArrayItem(
    updateData: TAddProfileArrayField,
    user: IRequestUser,
  ): Promise<TAddNewItemToProfileWithIdResponse> {
    const { fieldName, fieldData } = updateData;

    const profile = await Profile.findOne({ user: user._id });

    if (!profile) {
      throw new ApiError(404, 'Profile not found.');
    }

    // Add item to array
    (profile as any)[fieldName].unshift(fieldData);

    await profile.save();

    const newlyAddedItem: TAddNewItemToProfileWithIdResponse = (profile as any)[fieldName][0];
    return newlyAddedItem;
  }

  static async removeArrayItem(
    removeData: TDeleteProfileArrayItem,
    user: IRequestUser,
  ): Promise<TUserProfileResponse> {
    const profile = await Profile.findOne({ user: user._id });

    if (!profile) {
      throw new ApiError(404, 'Profile not found.');
    }

    const { fieldName, deleteObjectId } = removeData;

    (profile as any)[fieldName] = (profile as any)[fieldName].filter(
      (field: any) => String(field._id) !== String(deleteObjectId),
    );

    await profile.save();

    const responseProfile = ProfileMapper.toUserProfile(profile);

    return responseProfile;
  }

  static async uploadImageOnCloudinary(
    imagePath: string,
  ): Promise<{ url: string; success: boolean }> {
    const response = await uploadOnCloudinary(imagePath);
    return { url: response?.url ?? '', success: response?.url ? true : false };
  }

  static async updateProfileImage(
    image: TSingleImageBackend,
    user: IRequestUser,
  ): Promise<TUserProfileResponse> {
    const { url, success } = await this.uploadImageOnCloudinary(image.path);

    if (!success) {
      throw new ApiError(401, 'Error uploading proilfe picture to cloudinary.');
    }

    const profile = await Profile.findOne({ user: user._id }).populate({
      path: 'user',
      select: 'username email role',
    });

    if (!profile) {
      throw new ApiError(401, 'User not found.');
    }

    profile.profilePictureUrl = url;
    await profile.save();

    const responseProfile = ProfileMapper.toUserProfile(profile);
    return responseProfile;
  }

  static async updateProfileField(
    updateData: TUpdateProfileField,
    user: IRequestUser,
  ): Promise<TUserProfileResponse> {
    const { fieldName, fieldData } = updateData;

    const profile = await Profile.findOne({ user: user._id }).populate({
      path: 'user',
      select: 'username email role',
    });

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

    await profile.save();

    const responseProfile = ProfileMapper.toUserProfile(profile);
    return responseProfile;
  }

  static async searchProfiles(
    input: string,
    pagination: TValidateSearchParamsPagination,
  ): Promise<TUserProfileSummaryresponseWithPagination> {
    const { limit, cursor } = pagination;

    const matchStage = cursor ? { $match: { createdAt: { $lt: new Date(cursor) } } } : null;

    const pipeline: any[] = [
      {
        $search: {
          index: 'name_autocomplete',
          compound: {
            should: [
              {
                autocomplete: {
                  query: input,
                  path: 'firstName',
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                },
              },
              {
                autocomplete: {
                  query: input,
                  path: 'lastName',
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                },
              },
            ],
          },
        },
      },
      ...(matchStage ? [matchStage] : []),
      { $sort: { createdAt: -1 } }, // Ensure descending order for pagination
      { $limit: limit + 1 }, // Fetch one extra to determine if there's a next page
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          profilePictureUrl: 1,
          bio: 1,
          role: 1,
          username: 1,
          isVerified: 1,
          email: 1,
          score: { $meta: 'searchScore' },
        },
      },
    ];

    const results = await Profile.aggregate(pipeline);

    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, -1) : results;
    const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null;

    return {
      profiles: items,
      hasMore,
      nextCursor,
    };
  }

  static async fetchUsersByName(
    { fullName }: TFullNameSearch,
    pagination: TValidateSearchParamsPagination,
  ): Promise<TUserProfileSummaryresponseWithPagination> {
    return this.searchProfiles(fullName, pagination);
  }
}
