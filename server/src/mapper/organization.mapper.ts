import type {
  TBaseOrganization,
  TOrganizationResponse,
  TOrganizationSummaryResponse,
} from 'shared';
import { Document } from 'mongoose';

export class OrganizationMapper {
  toOrganizationSummaryResponse(
    organization: Document | TBaseOrganization,
  ): TOrganizationSummaryResponse {
    const orgObj = organization instanceof Document ? organization.toObject() : organization;

    return {
      _id: orgObj._id,
      name: orgObj.name,
      organizationURL: orgObj.organizationURL,
      logo: orgObj.logo,
    };
  }

  toOrganizationResponse(organization: Document | TBaseOrganization): TOrganizationResponse {
    const orgObj = organization instanceof Document ? organization.toObject() : organization;

    return {
      _id: orgObj._id,
      name: orgObj.name,
      description: orgObj.description,
      websiteURL: orgObj.websiteURL,
      organizationURL: orgObj.organizationURL,
      logo: orgObj.logo,
      createdBy: orgObj.createdBy,
      createdAt: orgObj.createdAt,
      isAdmin: orgObj.isAdmin,
    };
  }
}
