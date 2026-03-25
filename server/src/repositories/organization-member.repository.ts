import mongoose from 'mongoose';

import { OrganizationMember } from '../models/organization-member.model.js';
import type { TCreateOrganizationMember, TChangeOrganizationMemberRole } from 'shared';
import {
  lookupPipeline,
  profileSummaryLookupPipeline,
  projectStage,
  unwindField,
} from '../utils/aggregationHelpers.js';

export class OrganizationMemberRepository {
  findOrganizationMember({ orgId, userId }: { orgId: string; userId: string }) {
    return OrganizationMember.findOne({ organizationId: orgId, userId: userId });
  }

  findAdminCount({ orgId }: { orgId: string }) {
    return OrganizationMember.countDocuments({ organizationId: orgId, role: 'admin' });
  }

  createOrganizationMember(organizationMemberData: TCreateOrganizationMember) {
    return OrganizationMember.create(organizationMemberData);
  }

  deleteOrganizationMember({ organizationId, userId }: { organizationId: string; userId: string }) {
    // TODO: Validate Before deleting, check if the user is the last admin of the organization. If yes, prevent deletion and return an error message.

    const organizationObjectId = new mongoose.Types.ObjectId(organizationId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    return OrganizationMember.findOneAndDelete({
      organizationId: organizationObjectId,
      userId: userObjectId,
    });
  }

  findAllMembersOfOrganizationById({ organizationId }: { organizationId: string }) {
    const organizationObjectId = new mongoose.Types.ObjectId(organizationId);

    return OrganizationMember.aggregate([
      {
        $match: {
          organizationId: organizationObjectId,
          status: 'accepted',
        },
      },
      profileSummaryLookupPipeline({
        localField: 'userId',
        asField: 'user',
      }),
      unwindField({
        asField: 'user',
      }),
      lookupPipeline({
        localField: 'organizationId',
        foreignField: '_id',
        from: 'organizations',
        as: 'organization',
      }),
      unwindField({
        asField: 'organization',
      }),
      projectStage({
        _id: 1,
        role: 1,
        user: 1,
        organization: 1,
        createdAt: 1,
      }),
    ]);
  }

  findAllMembersOfOrganizationByURL({ url }: { url: string }) {
    return OrganizationMember.aggregate([
      {
        $match: {
          url: url,
          status: 'accepted',
        },
      },
      profileSummaryLookupPipeline({
        localField: 'userId',
        asField: 'user',
      }),
      unwindField({
        asField: 'user',
      }),
      lookupPipeline({
        localField: 'organizationId',
        foreignField: '_id',
        from: 'organizations',
        as: 'organization',
      }),
      unwindField({
        asField: 'organization',
      }),
      projectStage({
        _id: 1,
        role: 1,
        user: 1,
        organization: 1,
      }),
    ]);
  }

  updateOrganizationMemberRole({ organizationId, role }: TChangeOrganizationMemberRole) {
    // TODO: Validate Before updating, check if the user is the last admin of the organization. If yes, prevent role change and return an error message.

    const organizationObjectId = new mongoose.Types.ObjectId(organizationId);

    return OrganizationMember.findOneAndUpdate(
      {
        organizationId: organizationObjectId,
      },
      { role },
      { new: true },
    );
  }

  getOrganizationMemberInvitations({ profileId }: { profileId: string }) {
    return OrganizationMember.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(profileId),
          status: 'pending',
        },
      },
      profileSummaryLookupPipeline({
        localField: 'userId',
        asField: 'user',
      }),
      unwindField({
        asField: 'user',
      }),
      lookupPipeline({
        localField: 'organizationId',
        foreignField: '_id',
        from: 'organizations',
        as: 'organization',
      }),
      unwindField({
        asField: 'organization',
      }),
      projectStage({
        _id: 1,
        role: 1,
        user: 1,
        organization: 1,
        status: 1,
      }),
    ]);
  }

  deleteOrganizationMemberInvite({ memberId }: { memberId: string }) {
    return OrganizationMember.findByIdAndDelete(memberId);
  }

  acceptOrganizationMemberInvite({ memberId }: { memberId: string }) {
    return OrganizationMember.findByIdAndUpdate(memberId, { status: 'accepted' });
  }
}
