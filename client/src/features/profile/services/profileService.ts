import api from '@/lib/axios';
import type {
  TAddProfileArrayField,
  TUserProfileParams,
  TDeleteProfileArrayItem,
  TUpdateProfileField,
} from 'shared';

export const profileService = async (data: TUserProfileParams) => {
  const response = await api.get(`/api/v1/profile/${data.identifier}`);
  return response.data;
};

export const addProfileArrayItemService = async (data: TAddProfileArrayField) => {
  const response = await api.patch('/api/v1/profile/add-array-item', data);
  return response.data;
};

export const removeProfileArrayItemService = async (data: TDeleteProfileArrayItem) => {
  const response = await api.delete('/api/v1/profile/remove-array-item', { params: data });
  return response.data;
};

export const updateProfilePicture = async (data: FormData) => {
  const response = await api.patch('/api/v1/profile/update-profile-image', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProfileFieldService = async (data: TUpdateProfileField) => {
  const response = await api.patch('/api/v1/profile/update-field', data);
  return response.data;
};
