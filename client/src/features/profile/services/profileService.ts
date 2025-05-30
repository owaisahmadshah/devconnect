import api from '@/lib/axios';
import type { TUserProfileParams } from 'shared';

export const profileService = async (data: TUserProfileParams) => {
  const response = await api.get(`/api/v1/users/profile/${data.identifier}`);
  return response.data;
};
