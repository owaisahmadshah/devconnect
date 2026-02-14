import { Document, model, Schema } from 'mongoose';

import type { TAddOrganizationMember } from 'shared';

export interface IOrganizationMember
  extends Document, Omit<TAddOrganizationMember, 'userId' | 'organizationId'> {
  userId: Schema.Types.ObjectId;
  organizationId: Schema.Types.ObjectId;
}

const organizationMemberSchema = new Schema<IOrganizationMember>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
  },
  {
    timestamps: true,
  },
);

organizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

export const OrganizationMember = model<IOrganizationMember>(
  'OrganizationMember',
  organizationMemberSchema,
);
