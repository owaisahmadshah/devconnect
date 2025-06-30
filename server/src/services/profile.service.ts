import { Profile } from '../models/profile.model.js';
import {
  HttpStatus,
  type TDeleteProfileArrayItem,
  type TUserProfileResponse,
  type TUserProfileSummaryResponse,
  type TAddProfileArrayField,
  type TAddNewItemToProfileWithIdResponse,
  type TSingleImageBackend,
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
}
