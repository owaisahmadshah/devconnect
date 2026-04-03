import { Document } from 'mongoose';

import type {
  TBaseOrganizationMember,
  TOrganizationMemberResponse,
  TOrganizationMemberWithStatusResponse,
} from 'shared';

export class OrganizationMemberMapper {
  toOrganizationMemberResponse(
    organizationMemberData: Document | TBaseOrganizationMember,
  ): TOrganizationMemberResponse {
    const orgMemData =
      organizationMemberData instanceof Document
        ? organizationMemberData.toObject()
        : organizationMemberData;

    return {
      _id: orgMemData._id,
      organization: orgMemData.organization,
      user: orgMemData.user,
      role: orgMemData.role,
      createdAt: orgMemData.createdAt,
    };
  }

  toOrganizationMemberWithStatusResponse(
    organizationMemberData: Document | TBaseOrganizationMember,
  ): TOrganizationMemberWithStatusResponse {
    const orgMemData =
      organizationMemberData instanceof Document
        ? organizationMemberData.toObject()
        : organizationMemberData;

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
