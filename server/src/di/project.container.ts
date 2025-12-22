import { ProjectController } from '../controllers/project.controller.js';
import { ProjectRepository } from '../repositories/project.repository.js';
import { ProjectService } from '../services/project.service.js';
import { profileService } from './profile.container.js';

const projectRepository = new ProjectRepository();

const projectService = new ProjectService(projectRepository, profileService);

const projectController = new ProjectController(projectService);

export { projectRepository, projectService, projectController };
