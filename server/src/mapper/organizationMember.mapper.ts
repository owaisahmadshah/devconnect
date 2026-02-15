import type { Document } from 'mongoose';

import type { TOrganizationMemberResponse } from 'shared';

export class OrganizationMemberMapper {
  toOrganizationMemberResponse(organizationMemberData: Document): TOrganizationMemberResponse {
    const orgMemData = organizationMemberData.toObject();

    return {
      _id: orgMemData._id,
      organization: orgMemData.organization,
      user: orgMemData.user,
      role: orgMemData.role,
      createdAt: orgMemData.createdAt,
    };
  }
}
