import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api-client';
import {
  type TProjectsSummaryWithCursorPaginationResponse,
  type TAddProjectArrayItem,
  type TDeleteProject,
  type TDeleteProjectArrayItem,
  type TPagination,
  type TProjectById,
  type TProjectByTechStack,
  type TProjectByTitle,
  type TProjectResponse,
  type TProjectsOfUser,
  type TUpdateProjectField,
} from 'shared';

export const createProjectService = async (data: FormData): Promise<TProjectResponse> => {
  return apiPost<TProjectResponse>('/api/v1/project/create', data);
};

export const deleteProjectSerice = async (data: TDeleteProject) => {
  return apiDelete('api/v1/project/delete', data);
};

export const addArrayItemProjectSerice = async (
  data: TAddProjectArrayItem,
): Promise<TProjectResponse> => {
  return apiPost<TProjectResponse>('/api/v1/project/add-array-item', data);
};

export const deleteArrayItemProjectSerice = async (
  params: TDeleteProjectArrayItem,
): Promise<TProjectResponse> => {
  return apiDelete<TProjectResponse>('api/v1/project/delete-array-item', params);
};

export const updateFieldItemProjectSerice = async (
  data: TUpdateProjectField,
): Promise<TProjectResponse> => {
  return apiPatch<TProjectResponse>('/api/v1/project/update-field-item', data);
};

export const fetchProjectsByTitleService = async (
  data: TProjectByTitle,
  pagination: TPagination,
): Promise<TProjectsSummaryWithCursorPaginationResponse> => {
  return apiGet<TProjectsSummaryWithCursorPaginationResponse>('/api/v1/project/by-title', {
    ...data,
    ...pagination,
  });
};

export const fetchProjectsByTechStackService = async (
  data: TProjectByTechStack,
  pagination: TPagination,
): Promise<TProjectsSummaryWithCursorPaginationResponse> => {
  return apiGet<TProjectsSummaryWithCursorPaginationResponse>('/api/v1/project/by-techstack', {
    ...data,
    ...pagination,
  });
};

export const fetchUserProjectsService = async (
  data: TProjectsOfUser,
  pagination: TPagination,
): Promise<TProjectsSummaryWithCursorPaginationResponse> => {
  return apiGet<TProjectsSummaryWithCursorPaginationResponse>(
    `/api/v1/project/user/${data.profileUrl}`,
    pagination,
  );
};

export const fetchProjectByIdService = async (data: TProjectById): Promise<TProjectResponse> => {
  return apiGet<TProjectResponse>(`/api/v1/project/${data.projectId}`);
};
