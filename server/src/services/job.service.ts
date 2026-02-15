import { HttpStatus, type TCreateJob, type TDeleteJob, type TUpdateJob } from 'shared';
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
  }) {
    const { repo, mapper } = this.deps;

    const jobs = await repo.findAllJobsOfOrganization({
      organizationId,
      limit,
      cursor,
    });

    return jobs.map(job => mapper.toJobSummaryResponse(job));
  }
}
