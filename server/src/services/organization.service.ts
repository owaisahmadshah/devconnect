import type slugify from 'slugify';

import {
  HttpStatus,
  type TCreateOrganization,
  type TDeleteOrganization,
  type TOrganizationListResponseWithCursorPagination,
} from 'shared';
import type { OrganizationRepository } from '../repositories/organization.repository.js';
import { ApiError } from '../utils/ApiError.js';
import type { OrganizationMapper } from '../mapper/organization.mapper.js';

interface IOrganizationServiceDeps {
  repo: OrganizationRepository;
  mapper: OrganizationMapper;
  slugifyFn: typeof slugify;
}

export class OrganizationService {
  constructor(private deps: IOrganizationServiceDeps) {}

  createOrganization = async (organizationData: TCreateOrganization) => {
    const { repo, slugifyFn, mapper } = this.deps;

    const baseSlug = (slugifyFn as any)(`${organizationData.name || ''}`, {
      lower: true,
      strict: true,
    });

    let organization;

    let slug = baseSlug;
    let attempt = 0;
    let uniqueSlugFound = false;

    while (!uniqueSlugFound) {
      try {
        organization = await repo.createOrganization({
          ...organizationData,
          organizationURL: slug,
        });

        if (!organization) {
          throw new ApiError(500, 'Internal server error. Unable to create organization.');
        }

        uniqueSlugFound = true;
      } catch (err: any) {
        if (err.code === 11000) {
          // Duplicate key error modify slug
          attempt++;

          // Further retries → append random number
          slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
        } else {
          throw err;
        }
      }
    }

    if (!organization) {
      throw new ApiError(500, 'Internal server error. Unable to create organization.');
    }

    const createdOrg = await repo.findOrganization({
      query: (organization._id as any).toString(),
    });

    if (createdOrg.length === 0) {
      throw new ApiError(500, 'Internal server error. Unable to retrieve created organization.');
    }

    return mapper.toOrganizationResponse(createdOrg[0]);
  };

  deleteOrganization = async ({ _id }: TDeleteOrganization) => {
    const { repo } = this.deps;
    const deletedOrganization = await repo.deleteOrganization({ organizationId: _id });

    if (!deletedOrganization) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Organization not found.');
    }
    return deletedOrganization;
  };

  findAllOrganizationsOfUser = async ({
    profileId,
    limit,
    cursor,
  }: {
    profileId: string;
    limit: number;
    cursor: string | null;
  }): Promise<TOrganizationListResponseWithCursorPagination> => {
    const { repo, mapper } = this.deps;

    const organizations = await repo.findAllOrganizationsOfUser({
      profileId,
      limit,
      cursor,
    });

    const responseOrganization = organizations.map(org =>
      mapper.toOrganizationSummaryResponse(org),
    );

    const hasMore = organizations.length === limit;
    const nextCursor = hasMore ? (organizations[organizations.length - 1]._id as string) : null;

    return {
      organizations: responseOrganization,
      hasMore,
      nextCursor,
    };
  };

  findOrganizationByIdOrURL = async ({ query }: { query: string }) => {
    const { repo, mapper } = this.deps;

    const organization = await repo.findOrganization({ query });

    if (!organization || organization.length === 0) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Organization not found.');
    }

    return mapper.toOrganizationResponse(organization[0]);
  };
}
