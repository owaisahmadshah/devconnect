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

  findOrganization({ query }: { query: string }) {
    let matchState: any = {};

    if (mongoose.Types.ObjectId.isValid(query)) {
      matchState._id = new mongoose.Types.ObjectId(query);
    } else {
      matchState.organizationURL = query;
    }

    return Organization.aggregate([
      {
        $match: {
          ...matchState,
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
  // TODO: Add recommend organizations based on user's interests and connections
}
