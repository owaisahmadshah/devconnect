import type { Document } from 'mongoose';

import type { TOrganizationMemberResponse, TOrganizationMemberWithStatusResponse } from 'shared';

export class OrganizationMemberMapper {
  toOrganizationMemberResponse(organizationMemberData: Document): TOrganizationMemberResponse {
    // const orgMemData = organizationMemberData.toObject();
    const orgMemData = organizationMemberData;

    return {
      _id: orgMemData._id,
      organization: orgMemData.organization,
      user: orgMemData.user,
      role: orgMemData.role,
      createdAt: orgMemData.createdAt,
    };
  }

  toOrganizationMemberWithStatusResponse(
    organizationMemberData: Document,
  ): TOrganizationMemberWithStatusResponse {
    // const orgMemData = organizationMemberData.toObject();
    const orgMemData = organizationMemberData;

    return {
      _id: orgMemData._id,
      organization: orgMemData.organization,
      user: orgMemData.user,
      role: orgMemData.role,
      createdAt: orgMemData.createdAt,
      status: orgMemData.status,
    };
  }
}
