import api from '@/lib/axios';
import type { TUserProfileParams, TUserProfileUpdateArrayData } from 'shared';

export const profileService = async (data: TUserProfileParams) => {
  const response = await api.get(`/api/v1/profile/${data.identifier}`);
  return response.data;
};

export const addProfileArrayItemService = async (data: TUserProfileUpdateArrayData) => {
  const response = await api.patch('/api/v1/profile/add-array-item', data);
  return response.data;
};
