import { apiPost, apiGet, apiDelete } from '@/lib/api-client';

import type {
  TCreateJob,
  TDeleteJob,
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
  return apiPost<TJobResponse>('/api/v1/jobs/update-status', data);
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
