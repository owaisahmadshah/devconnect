import { Document } from 'mongoose';

import type { TBaseJob, TJobResponse, TJobSummaryResponse } from 'shared';

export class JobMapper {
  toJobSummaryResponse(jobDoc: Document | TBaseJob): TJobSummaryResponse {
    const job = jobDoc instanceof Document ? jobDoc.toObject() : jobDoc;

    return {
      _id: job._id.toString(),
      title: job.title,
      location: job.location,
      createdAt: job.createdAt,
      organization: job.organization,
      status: job.status,
    };
  }

  toJobResponse(jobDoc: Document | TBaseJob): TJobResponse {
    const job = jobDoc instanceof Document ? jobDoc.toObject() : jobDoc;

    return {
      _id: job._id.toString(),
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
      createdAt: job.createdAt,
      organization: job.organization,
      postedBy: job.postedBy,
      status: job.status,
    };
  }
}
