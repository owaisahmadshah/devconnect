import api from '@/lib/axios';
import type { TAddProfileArrayField, TUserProfileParams, TDeleteProfileArrayItem } from 'shared';

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
