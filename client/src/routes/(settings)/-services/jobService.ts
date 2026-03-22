import { apiPost, apiGet, apiDelete, apiPatch } from '@/lib/api-client';

import type {
  TCreateJob,
  TDeleteJob,
  TGetSearchJob,
  TJobListResponseWithCursorPagination,
  TJobResponse,
  TPagination,
  TUpdateJob,
} from 'shared';

export const createJobService = async (data: TCreateJob) => {
  return apiPost<TJobResponse>('/api/v1/jobs/create', data);
};

export const deleteJobService = async (data: TDeleteJob) => {
  return apiDelete<TJobResponse>(`/api/v1/jobs/${data._id}`);
};

export const updateJobStatusService = async (data: TUpdateJob) => {
  return apiPatch<TJobResponse>('/api/v1/jobs/update-status', data);
};

export const fetchJobByIdService = async (jobId: string) => {
  return apiGet<TJobResponse>(`/api/v1/jobs/${jobId}`);
};

export const fetchAllJobsOfOrganizationService = async (
  {
    organizationId,
  }: {
    organizationId: string;
  },
  query: TPagination,
) => {
  return apiGet<TJobListResponseWithCursorPagination>(`/api/v1/jobs/${organizationId}/jobs`, query);
};

export const fetchJobsFeedService = (data: TPagination) => {
  return apiGet<TJobListResponseWithCursorPagination>('/api/v1/jobs/feed', data);
};

export const fetchJobsSearchService = (
  data: TPagination & {
    query: TGetSearchJob;
  },
) => {
  const { query, ...pagination } = data;
  return apiGet<TJobListResponseWithCursorPagination>('/api/v1/jobs/search', {
    ...query,
    ...pagination,
  });
};
