import api from '@/lib/axios';
import type {
  TUserProfileDeleteArrayData,
  TUserProfileParams,
  TUserProfileUpdateArrayData,
} from 'shared';

export const profileService = async (data: TUserProfileParams) => {
  const response = await api.get(`/api/v1/profile/${data.identifier}`);
  return response.data;
};

export const addProfileArrayItemService = async (data: TUserProfileUpdateArrayData) => {
  const response = await api.patch('/api/v1/profile/add-array-item', data);
  return response.data;
};

export const removeProfileArrayItemService = async (data: TUserProfileDeleteArrayData) => {
  const response = await api.delete('/api/v1/profile/remove-array-item', { params: data });
  return response.data;
};
