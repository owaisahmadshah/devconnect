import mongoose from 'mongoose';

import { Organization } from '../models/organization.model.js';
import type { TCreateOrganization } from 'shared';
import {
  paginateCursorPipeline,
  profileSummaryLookupPipeline,
  projectStage,
  unwindField,
} from '../utils/aggregationHelpers.js';
import { ORGANIZATION_FIELDS_PROJECTION } from '../constants/organizationProjections.js';

export class OrganizationRepository {
  createOrganization(organizationData: TCreateOrganization & { organizationURL: string }) {
    return Organization.create(organizationData);
  }

  deleteOrganization({ organizationId }: { organizationId: string }) {
    return Organization.findByIdAndDelete(organizationId);
  }

  findOrganizationById({ organizationId }: { organizationId: string }) {
    const organizationObjectId = new mongoose.Types.ObjectId(organizationId);

    return Organization.aggregate([
      {
        $match: {
          _id: organizationObjectId,
        },
      },
      profileSummaryLookupPipeline({
        localField: 'createdBy',
        asField: 'createdBy',
      }),
      unwindField({
        asField: 'createdBy',
      }),
      projectStage(ORGANIZATION_FIELDS_PROJECTION.DETAIL),
    ]);
  }

  findAllOrganizationsOfUser({
    profileId,
    limit,
    cursor,
  }: {
    profileId: string;
    limit: number;
    cursor: string | null;
  }) {
    // const profileObjectId = new mongoose.Types.ObjectId(profileId);
    let matchStage: any = { createdBy: new mongoose.Types.ObjectId(profileId) };

    if (cursor) {
      matchStage = {
        ...matchStage,
        createdAt: { $lt: new Date(cursor) },
      };
    }

    return Organization.aggregate([
      {
        $match: {
          createdBy: matchStage,
        },
      },
      ...paginateCursorPipeline({
        limit,
      }),
      profileSummaryLookupPipeline({
        localField: 'createdBy',
        asField: 'createdBy',
      }),
      unwindField({
        asField: 'createdBy',
      }),
      projectStage(ORGANIZATION_FIELDS_PROJECTION.SUMMARY),
    ]);
  }

  findByOrganizationURL({ url }: { url: string }) {
    return Organization.aggregate([
      {
        $match: {
          organizationURL: url,
        },
      },
      profileSummaryLookupPipeline({
        localField: 'createdBy',
        asField: 'createdBy',
      }),
      unwindField({
        asField: 'createdBy',
      }),
      projectStage(ORGANIZATION_FIELDS_PROJECTION.DETAIL),
    ]);
  }

  // TODO: Add recommend organizations based on user's interests and connections
}
