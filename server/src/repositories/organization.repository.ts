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

  findOrganizationSummaryById(orgId: string) {
    return Organization.findById(orgId).select('_id name organizationURL')
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
    let matchStage: any = { createdBy: new mongoose.Types.ObjectId(profileId) };

    if (cursor) {
      matchStage = {
        ...matchStage,
        createdAt: { $lt: new Date(cursor) },
      };
    }

    return Organization.aggregate([
      {
        $match: matchStage,
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

  findRecommendedOrganizationsForUser({
    profileId,
    limit,
    cursor,
  }: {
    profileId: string;
    limit: number;
    cursor: string | null;
  }) {
    let matchStage: any = {};

    if (cursor) {
      matchStage.createdAt = { $lt: new Date(cursor) };
    }

    return Organization.aggregate([
      {
        $match: matchStage,
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

  searchOrganizations({
    query,
    limit,
    cursor,
  }: {
    query: string;
    profileId: string;
    limit: number;
    cursor: string | null;
  }) {
    let matchStage: any = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    };

    if (cursor) {
      matchStage.createdAt = { $lt: new Date(cursor) };
    }

    return Organization.aggregate([
      {
        $match: matchStage,
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

  updateOrganizationField({
    organizationId,
    field,
    value,
  }: {
    organizationId: string;
    field: string;
    value: any;
  }) {
    const updateData: any = {};
    updateData[field] = value;

    return Organization.findByIdAndUpdate(
      organizationId,
      {
        $set: updateData,
      },
      { new: true },
    );
  }
}
