import slugify from 'slugify';

import { OrganizationMapper } from '../mapper/organization.mapper.js';
import { OrganizationRepository } from '../repositories/organization.repository.js';
import { OrganizationService } from '../services/organization.service.js';
import { OrganizationController } from '../controllers/organization.controller.js';
import { OrganizationMemberRepository } from '../repositories/organization-member.repository.js';

const organizationMapper = new OrganizationMapper();
const organizationRepository = new OrganizationRepository();
const organizationMemberRepository = new OrganizationMemberRepository();
const organizationService = new OrganizationService({
  repo: organizationRepository,
  mapper: organizationMapper,
  slugifyFn: slugify,
  organizationMemberRepo: organizationMemberRepository,
});
const organizationController = new OrganizationController(organizationService);

export { organizationRepository, organizationMapper, organizationService, organizationController };
