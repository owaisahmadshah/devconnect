import api from '@/lib/axios';
import { apiGet, apiPost } from '@/lib/api-client';
import {
  type TAddProfileArrayField,
  type TUserProfileParams,
  type TDeleteProfileArrayItem,
  type TUpdateProfileField,
  type TReposListResponse,
  type TCreateGithubProject,
  type TProjectResponse,
} from 'shared';

export const profileService = async (data: TUserProfileParams) => {
  const response = await api.get(`/api/v1/profile/${data.url}`);
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

export const fetchRepoService = async (): Promise<TReposListResponse[]> => {
  return apiGet<TReposListResponse[]>('/api/v1/github/repos');
};

export const addRepoProjectService = async (
  data: TCreateGithubProject,
): Promise<TProjectResponse> => {
  return apiPost<TProjectResponse>('/api/v1/github/repo/add', data);
};
