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
import type { OrganizationMemberRepository } from '../repositories/organization-member.repository.js';

interface IOrganizationServiceDeps {
  repo: OrganizationRepository;
  organizationMemberRepo: OrganizationMemberRepository;
  mapper: OrganizationMapper;
  slugifyFn: typeof slugify;
}

export class OrganizationService {
  constructor(private deps: IOrganizationServiceDeps) {}

  createOrganization = async (organizationData: TCreateOrganization) => {
    const { repo, slugifyFn, mapper, organizationMemberRepo } = this.deps;

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

    await organizationMemberRepo.createOrganizationMember({
      organizationId: organization._id as string,
      userId: organizationData.createdBy,
      role: 'admin',
    });

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

  findOrganizationByIdOrURL = async ({
    query,
    profileId,
  }: {
    query: string;
    profileId: string;
  }) => {
    const { repo, mapper } = this.deps;

    const organization = await repo.findOrganization({ query });

    if (!organization || organization.length === 0) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Organization not found.');
    }

    // TODO: Optimize this by doing a single query that checks if the user is a member and their role, instead of fetching organization and then checking if the user is admin OR Just check it findOrganization pipeline itself and add isAdmin field there instead of doing it here in service layer, because there could be multiple admins within one organization
    return mapper.toOrganizationResponse({
      ...organization[0],
      isAdmin: organization[0].createdBy._id.toString() === profileId,
    });
  };
}
