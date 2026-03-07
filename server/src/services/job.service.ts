import {
  HttpStatus,
  type TCreateJob,
  type TDeleteJob,
  type TGetSearchJob,
  type TJobListResponseWithCursorPagination,
  type TPagination,
  type TUpdateJob,
} from 'shared';
import type { JobMapper } from '../mapper/job.mapper.js';
import type { JobRepository } from '../repositories/job.repository.js';
import { ApiError } from '../utils/ApiError.js';

interface IJobService {
  repo: JobRepository;
  mapper: JobMapper;
}

export class JobService {
  constructor(private deps: IJobService) {}

  async createJob(jobData: TCreateJob) {
    const { repo } = this.deps;

    const createdJob = await repo.createJob(jobData);

    if (!createdJob) {
      throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create job');
    }

    return createdJob;
  }

  async deleteJob(job: TDeleteJob) {
    const { repo } = this.deps;

    const deletedJob = await repo.deleteJob(job);

    if (!deletedJob) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Job not found');
    }

    return deletedJob;
  }

  async updateJobStatus(job: TUpdateJob) {
    const { repo } = this.deps;

    const updatedJob = await repo.updateJobStatus(job);

    if (!updatedJob) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Job not found');
    }

    return updatedJob;
  }

  async findJobById({ jobId }: { jobId: string }) {
    const { repo, mapper } = this.deps;

    const job = await repo.findJobById({ jobId });

    if (!job || job.length === 0) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Job not found');
    }

    return mapper.toJobResponse(job[0]);
  }

  async findAllJobsOfOrganization({
    organizationId,
    limit,
    cursor,
  }: {
    organizationId: string;
    limit: number;
    cursor: string | null;
  }): Promise<TJobListResponseWithCursorPagination> {
    const { repo, mapper } = this.deps;

    const jobs = await repo.findAllJobsOfOrganization({
      organizationId,
      limit,
      cursor,
    });

    const hasMore = jobs.length === limit;
    const nextCursor = hasMore ? (jobs[jobs.length - 1]._id as string) : null;

    return {
      jobs: jobs.map(job => mapper.toJobSummaryResponse(job)),
      hasMore,
      nextCursor,
    };
  }

  searchJobs = async (query: TGetSearchJob & TPagination) => {
    const { repo, mapper } = this.deps;
    const jobs = await repo.searchJobs(query);

    const hasMore = jobs.length === query.limit;
    const nextCursor = hasMore ? (jobs[jobs.length - 1]._id as string) : null;

    return {
      jobs: jobs.map(job => mapper.toJobSummaryResponse(job)),
      hasMore,
      nextCursor,
    };
  };

  getJobFeed = async (query: { profileId: string; limit: number; cursor: string | null }) => {
    const { repo, mapper } = this.deps;

    const jobs = await repo.getJobFeed(query);

    const hasMore = jobs.length === query.limit;
    const nextCursor = hasMore ? (jobs[jobs.length - 1]._id as string) : null;

    return {
      jobs: jobs.map(job => mapper.toJobSummaryResponse(job)),
      hasMore,
      nextCursor,
    };
  };
}
