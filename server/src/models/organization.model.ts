import { Document, model, Schema } from 'mongoose';

import type { TCreateOrganization } from 'shared';

export interface IOrganization extends Document, Omit<TCreateOrganization, 'createdBy'> {
  createdBy: Schema.Types.ObjectId;
  organizationURL: string;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    websiteURL: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    organizationURL: {
      type: String,
      unique: true,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Organization = model<IOrganization>('Organization', organizationSchema);
