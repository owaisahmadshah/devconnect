import type { TProjectResponse, TProjectSummaryResponse } from 'shared';
import { Document } from 'mongoose';

export class ProjectMapper {
  static toPublicProject = (projectData: Document): TProjectResponse => {
    const projectObj = projectData.toObject();
    return {
      _id: projectData._id as string,
      title: projectObj.title,
      description: projectObj.description,
      githubUrl: projectObj.githubUrl,
      liveDemoUrl: projectObj.liveDemoUrl,
      createdBy: projectObj.createdBy,
      isFeatured: projectObj.isFeatured,
      creationDate: projectObj.creationDate,
      visibility: projectObj.visibility,
      collaborators: projectObj.collaborator,
      tags: projectObj.tags,
      media: projectObj.media,
      techStacks: projectObj.techStack,
      createdAt: projectObj.createdAt,
      updatedAt: projectObj.updatedAt,
    };
  };

  static toProjectSummary = (projectData: Document): TProjectSummaryResponse => {
    const projectObj = projectData.toObject();
    return {
      _id: projectData._id as string,
      title: projectObj.title,
      description: projectObj.description,
      createdBy: projectObj.createdBy,
      creationDate: projectObj.creationDate,
      tags: projectObj.tags,
      techStacks: projectObj.techStack,
      createdAt: projectObj.createdAt,
    };
  };
}
