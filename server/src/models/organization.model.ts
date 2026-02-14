import { Document, model, Schema } from 'mongoose';

import type { TCreateOrganization } from 'shared';

export interface IOrganization extends Document, Omit<TCreateOrganization, 'createdBy'> {
  createdBy: Schema.Types.ObjectId;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
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
