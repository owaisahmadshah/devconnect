import { Document, model, Schema } from 'mongoose';

import type { TCreateJob } from 'shared';

export interface IJob extends Document, Omit<TCreateJob, 'organizationId' | 'postedBy'> {
  organizationId: Schema.Types.ObjectId;
  postedBy: Schema.Types.ObjectId;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  },
);

export const Job = model<IJob>('Job', jobSchema);
