import type { TOrganizationResponse, TOrganizationSummaryResponse } from 'shared';
import type { Document } from 'mongoose';

export class OrganizationMapper {
  toOrganizationSummaryResponse(organization: Document): TOrganizationSummaryResponse {
    const orgObj = organization;

    return {
      _id: orgObj._id,
      name: orgObj.name,
      organizationURL: orgObj.organizationURL,
      logo: orgObj.logo,
    };
  }

  toOrganizationResponse(organization: Document): TOrganizationResponse {
    const orgObj = organization;

    return {
      _id: orgObj._id,
      name: orgObj.name,
      description: orgObj.description,
      websiteURL: orgObj.websiteURL,
      organizationURL: orgObj.organizationURL,
      logo: orgObj.logo,
      createdBy: orgObj.createdBy,
      createdAt: orgObj.createdAt,
    };
  }
}
