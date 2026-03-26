import { OrganizationMemberMapper } from '../mapper/organizationMember.mapper.js';
import { OrganizationMemberRepository } from '../repositories/organization-member.repository.js';
import { OrganizationMemberService } from '../services/organizationMember.service.js';
import { OrganizationMemberController } from '../controllers/organizationMember.controller.js';
import { notificationService } from './notification.container.js';

const organizationMemberRepository = new OrganizationMemberRepository();
const organizationMemberMapper = new OrganizationMemberMapper();
const organizationMemberService = new OrganizationMemberService({
  repo: organizationMemberRepository,
  mapper: organizationMemberMapper,
  notificationService: notificationService
});

const organizationMemberController = new OrganizationMemberController(organizationMemberService);

export {
  organizationMemberRepository,
  organizationMemberMapper,
  organizationMemberService,
  organizationMemberController,
};
