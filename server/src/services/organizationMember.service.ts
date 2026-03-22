import {
  HttpStatus,
  type TCreateOrganizationMember,
  type TCreateOrganizationMemberInvite,
  type TDeleteOrganizationMember,
  type TUpdateOrganizationMemberRole,
} from 'shared';
import type { OrganizationMemberRepository } from '../repositories/organization-member.repository.js';
import { ApiError } from '../utils/ApiError.js';
import type { OrganizationMemberMapper } from '../mapper/organizationMember.mapper.js';

interface IOrganizationMemberService {
  repo: OrganizationMemberRepository;
  mapper: OrganizationMemberMapper;
}

export class OrganizationMemberService {
  constructor(private deps: IOrganizationMemberService) {}

  createOrgMember = async (organizationMemberData: TCreateOrganizationMember) => {
    const { repo } = this.deps;

    const organizationMember = await repo.createOrganizationMember({
      ...organizationMemberData,
      status: organizationMemberData?.status ?? 'pending',
    });

    if (!organizationMember) {
      throw new ApiError(500, 'Internal server error. Unable to create organization member.');
    }

    return organizationMember;
  };

  deleteOrganizationMember = async ({ organizationId, userId }: TDeleteOrganizationMember) => {
    const { repo } = this.deps;

    const deletedOrganizationMember = await repo.deleteOrganizationMember({
      organizationId,
      userId,
    });

    if (!deletedOrganizationMember) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Organization member not found.');
    }

    return deletedOrganizationMember;
  };

  findAllMembersOfOrganizationById = async ({ organizationId }: { organizationId: string }) => {
    const { repo, mapper } = this.deps;

    const organizationMembers = await repo.findAllMembersOfOrganizationById({ organizationId });

    const response = organizationMembers.map(orgMem => mapper.toOrganizationMemberResponse(orgMem));

    return response;
  };

  updateOrganizationMemberRole = async ({ _id, role }: TUpdateOrganizationMemberRole) => {
    const { repo, mapper } = this.deps;

    const updatedOrganizationMember = await repo.updateOrganizationMemberRole({
      organizationId: _id,
      role,
    });

    if (!updatedOrganizationMember) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Organization member not found.');
    }

    return mapper.toOrganizationMemberResponse(updatedOrganizationMember);
  };

  organizationMemberInvitations = async ({ profileId }: { profileId: string }) => {
    const { repo, mapper } = this.deps;

    const invitations = await repo.getOrganizationMemberInvitations({ profileId });

    const response = invitations.map(invite =>
      mapper.toOrganizationMemberWithStatusResponse(invite),
    );

    return response;
  };

  createOrganizationMemberInvite = async (data: TCreateOrganizationMemberInvite) => {
    const { repo } = this.deps;

    const invitation = await repo.createOrganizationMember({ ...data, status: 'pending' });

    return invitation;
  };
}
