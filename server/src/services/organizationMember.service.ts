import {
  HttpStatus,
  type TCreateOrganizationMember,
  type TCreateOrganizationMemberInvite,
  type TDeleteOrganizationMember,
  type TDeleteOrganizationMemberInvite,
  type TUpdateOrganizationMemberInvite,
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

    const admins = await repo.findAdminCount({ orgId: organizationMemberData.organizationId });

    // First member gets in freely (org creator), subsequent members require admin approval
    if (admins > 0) {
      await this.checkIsAdmin({
        orgId: organizationMemberData.organizationId,
        userId: organizationMemberData.userId,
      });
    }

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

    const member = await repo.findOrganizationMember({ orgId: organizationId, userId });

    // Admin can delete even himself if other admins are there
    if (!member) {
      throw new ApiError(HttpStatus.NOT_FOUND, "Member doesn't exits.");
    }

    await this.checkIsAdmin({ orgId: organizationId, userId });

    if (member.role === 'admin') {
      await this.checkIsLastAdmin({ orgId: organizationId });
    }

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

  updateOrganizationMemberRole = async ({
    _id,
    role,
    actorId,
    organizationId,
  }: TUpdateOrganizationMemberRole) => {
    const { repo, mapper } = this.deps;

    await this.checkIsAdmin({ orgId: organizationId, userId: actorId as string });

    // Admin(Actor) can even change his role if there is atleast on other admin
    if (role === 'member') {
      await this.checkIsLastAdmin({ orgId: organizationId });
    }

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

  deleteOrganizationMemberInvite = async (data: TDeleteOrganizationMemberInvite) => {
    const { repo } = this.deps;

    const updatedMember = await repo.deleteOrganizationMemberInvite({ memberId: data.inviteId });

    return updatedMember;
  };

  acceptOrganizationMemberInvite = async (data: TUpdateOrganizationMemberInvite) => {
    const { repo } = this.deps;

    const updatedMember = await repo.deleteOrganizationMemberInvite({ memberId: data.inviteId });

    return updatedMember;
  };

  async checkIsAdmin(data: { orgId: string; userId: string }, options?: { message?: string }) {
    const { repo } = this.deps;

    const member = await repo.findOrganizationMember(data);

    if (!member) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found.');
    }

    if (member.role !== 'admin') {
      throw new ApiError(HttpStatus.FORBIDDEN, options?.message ?? 'Only admin can make changes.');
    }
  }

  async checkIsLastAdmin(data: { orgId: string }, options?: { message?: string }) {
    const { repo } = this.deps;

    const adminsCount = await repo.findAdminCount(data);

    if (adminsCount === 1) {
      throw new ApiError(
        HttpStatus.FORBIDDEN,
        options?.message ?? "Last admin role can't be changed.",
      );
    }
  }
}
