import { Types } from 'mongoose';

import type { TCreateJob, TDeleteJob, TGetSearchJob, TPagination, TUpdateJob } from 'shared';
import { Job } from '../models/job.model.js';
import {
  lookupPipeline,
  paginateCursorPipeline,
  profileSummaryLookupPipeline,
  projectStage,
  unwindField,
} from '../utils/aggregationHelpers.js';
import { JOB_FIELDS_PROJECTION } from '../constants/jobProjections.js';

export class JobRepository {
  createJob(jobData: TCreateJob) {
    return Job.create(jobData);
  }

  deleteJob({ _id }: TDeleteJob) {
    return Job.findByIdAndDelete(_id);
  }

  updateJobStatus({ _id, status }: TUpdateJob) {
    return Job.findByIdAndUpdate(_id, { status }, { new: true });
  }

  findAllJobsOfOrganization({
    organizationId,
    limit,
    cursor,
  }: {
    organizationId: string;
    limit: number;
    cursor: string | null;
  }) {
    let matchStage: any = { organizationId: new Types.ObjectId(organizationId) };

    if (cursor) {
      matchStage = {
        ...matchStage,
        createdAt: { $lt: new Date(cursor) },
      };
    }

    return Job.aggregate([
      { $match: matchStage },
      ...paginateCursorPipeline({
        limit,
      }),
      lookupPipeline({
        localField: 'organizationId',
        foreignField: '_id',
        from: 'organizations',
        as: 'organization',
      }),
      unwindField({ asField: 'organization' }),
      projectStage(JOB_FIELDS_PROJECTION.SUMMARY),
    ]);
  }

  findJobById({ jobId }: { jobId: string }) {
    const jobIdObjectId = new Types.ObjectId(jobId);

    return Job.aggregate([
      { $match: { _id: jobIdObjectId } },
      profileSummaryLookupPipeline({
        localField: 'postedBy',
        asField: 'postedBy',
      }),
      unwindField({ asField: 'postedBy' }),
      lookupPipeline({
        localField: 'organizationId',
        foreignField: '_id',
        from: 'organizations',
        as: 'organization',
      }),
      unwindField({ asField: 'organization' }),
      projectStage(JOB_FIELDS_PROJECTION.DETAIL),
    ]);
  }

  searchJobs(query: TGetSearchJob & TPagination) {
    const { q, location, type, status, cursor, limit } = query;

    const matchStage: Record<string, unknown> = {};

    if (q) matchStage.title = { $regex: q, $options: 'i' };
    if (location) matchStage.location = { $regex: location, $options: 'i' };
    if (type) matchStage.type = type;
    if (status) matchStage.status = status;

    if (cursor) {
      matchStage.createdAt = { $lt: new Date(cursor) };
    }

    return Job.aggregate([
      { $match: matchStage },
      ...paginateCursorPipeline({
        limit: limit as number,
      }),
      profileSummaryLookupPipeline({
        localField: 'postedBy',
        asField: 'postedBy',
      }),
      unwindField({ asField: 'postedBy' }),
      lookupPipeline({
        localField: 'organizationId',
        foreignField: '_id',
        from: 'organizations',
        as: 'organization',
      }),
      unwindField({ asField: 'organization' }),
      projectStage(JOB_FIELDS_PROJECTION.SUMMARY),
    ]);
  }

  // TODO: Recommend jobs based on user's profile, skills, and interests. This can be done by matching the user's profile with the job's requirements and preferences.
  getJobFeed({ limit, cursor }: { profileId: string; limit: number; cursor: string | null }) {
    let matchStage: any = {};

    if (cursor) {
      matchStage = { createdAt: { $lt: new Date(cursor) } };
    }

    return Job.aggregate([
      {
        $match: matchStage,
      },
      profileSummaryLookupPipeline({
        localField: 'postedBy',
        asField: 'postedBy',
      }),
      unwindField({ asField: 'postedBy' }),
      lookupPipeline({
        localField: 'organizationId',
        foreignField: '_id',
        from: 'organizations',
        as: 'organization',
      }),
      unwindField({ asField: 'organization' }),
      projectStage(JOB_FIELDS_PROJECTION.SUMMARY),
    ]);
  }
}
