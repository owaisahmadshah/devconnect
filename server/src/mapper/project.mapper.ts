import type { TProjectResponse, TProjectSummaryResponse } from 'shared';
import { Document } from 'mongoose';

export class ProjectMapper {
  static toPublicProject = (projectData: any): TProjectResponse => {
    const projectObj = projectData instanceof Document ? projectData.toObject() : projectData;
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
      techStacks: projectObj.techStacks,
      createdAt: projectObj.createdAt,
      updatedAt: projectObj.updatedAt,
    };
  };

  static toProjectSummary = (projectData: any): TProjectSummaryResponse => {
    const projectObj = projectData instanceof Document ? projectData.toObject() : projectData;
    return {
      _id: projectData._id as string,
      title: projectObj.title,
      description: projectObj.description,
      createdBy: projectObj.createdBy,
      creationDate: projectObj.creationDate,
      tags: projectObj.tags,
      techStacks: projectObj.techStacks,
      createdAt: projectObj.createdAt,
    };
  };
}
